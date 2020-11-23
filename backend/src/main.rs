#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

use rocket::config::{Config, Environment};
use rocket::response::NamedFile;
use rocket_contrib::json::Json;
use rocket_upload::MultipartDatas;
use serde::{Deserialize, Serialize};
use typescript_definitions::TypeScriptify;
#[cfg(debug_assertions)]
use typescript_definitions::TypeScriptifyTrait;

mod analyze;
mod dirs;
mod run_r;
mod types;
mod typescript_export;
mod varlist;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct HHFAResponse<T> {
    pub error: bool,
    pub msg: Option<String>,
    pub data: Option<T>,
}

impl HHFAResponse<String> {
    pub fn success(data: String) -> HHFAResponse<String> {
        HHFAResponse {
            error: false,
            msg: None,
            data: Some(data),
        }
    }
    pub fn success_no_data() -> HHFAResponse<String> {
        HHFAResponse {
            error: false,
            msg: None,
            data: Some("".to_string()),
        }
    }
    pub fn error(msg: &str) -> HHFAResponse<String> {
        HHFAResponse {
            error: true,
            msg: Some(msg.to_string()),
            data: None,
        }
    }
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
////////////////// Index check ///////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

#[get("/")]
fn index_check() -> String {
    String::from("Hi there, future HHFA user!")
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
////////////////// Sessions /////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

#[get("/new_session")]
fn new_session() -> Json<HHFAResponse<String>> {
    match dirs::create_new_session_dir() {
        Ok(v) => Json(HHFAResponse::success(v)),
        Err(_) => Json(HHFAResponse::error("Problem creating session folder")),
    }
}

#[get("/end_session/<session_id>")]
fn end_session(session_id: String) -> Json<HHFAResponse<String>> {
    let res = dirs::check_session_id(&session_id);
    if res.is_err() {
        return Json(HHFAResponse::error(
            "No matching session. Click 'end session' and reconnect.",
        ));
    }
    let session_path = res.unwrap();
    match std::fs::remove_dir_all(session_path) {
        Ok(()) => Json(HHFAResponse::success_no_data()),
        Err(_) => Json(HHFAResponse::error("Problem removing session folder")),
    }
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
//////////////////// Uploads ////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

#[post("/upload/<session_id>", data = "<data>")]
fn upload(session_id: String, data: MultipartDatas) -> rocket::http::Status {
    let res = dirs::check_session_id(&session_id);
    if res.is_err() {
        return rocket::http::Status::raw(404);
    }
    let session_path = res.unwrap();
    let upload_folder_path = session_path.join(dirs::_DIRNAME_DATA);
    for f in data.files {
        if upload_folder_path.join(&f.filename).exists() {
            return rocket::http::Status::raw(403);
        }
        f.persist(std::path::Path::new(&upload_folder_path));
    }
    rocket::http::Status::raw(202)
}

#[post("/varlist", format = "application/json", data = "<data>")]
fn varlist(data: Json<types::VarlistRequest>) -> Json<HHFAResponse<Vec<types::RawVar>>> {
    let vr = data.into_inner();
    match varlist::get_varlist(&vr) {
        Ok(v) => Json(HHFAResponse {
            error: false,
            msg: None,
            data: Some(v),
        }),
        Err(_) => {
            let res = dirs::check_session_id(&vr.session_id);
            if res.is_ok() {
                let session_path = res.unwrap();
                let file_path = session_path.join(dirs::_DIRNAME_DATA).join(vr.file_name);
                let _ = std::fs::remove_file(file_path);
            }
            return Json(HHFAResponse {
                error: true,
                msg: Some(String::from(
                    "Could not parse file. May not be correct format.",
                )),
                data: None,
            });
        }
    }
}

#[get("/delete_upload/<session_id>/<file_name>")]
fn delete_upload(session_id: String, file_name: String) -> Json<HHFAResponse<String>> {
    let res = dirs::check_session_id(&session_id);
    if res.is_err() {
        return Json(HHFAResponse::error(
            "No matching session. Click 'end session' and reconnect.",
        ));
    }
    let session_path = res.unwrap();
    let file_path = session_path.join(dirs::_DIRNAME_DATA).join(file_name);
    let res2 = std::fs::remove_file(file_path);
    if res2.is_err() {
        return Json(HHFAResponse::error(
            "Could not delete file. It may have already been deleted. Click 'end session' and reconnect.",
        ));
    }
    Json(HHFAResponse::success_no_data())
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////// Analyzing ///////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

#[post("/render_script", format = "application/json", data = "<data>")]
fn render_script(data: Json<types::Structure>) -> Json<HHFAResponse<String>> {
    let structure = data.into_inner();
    match analyze::render_script(&structure) {
        Ok(v) => Json(HHFAResponse::success(v)),
        Err(_) => Json(HHFAResponse::error("Problem rendering script")),
    }
}

#[post("/analyze", format = "application/json", data = "<data>")]
fn analyze(data: Json<types::AnalyzeRequest>) -> Json<HHFAResponse<String>> {
    let ar = data.into_inner();
    println!("Analyzing {:?}", ar);
    match analyze::run_once(&ar) {
        Ok(v) => Json(HHFAResponse::success(v)),
        Err(_) => Json(HHFAResponse::error("Problem running analysis script")),
    }
}

#[get("/stream_file/<session_id>/<temp_id>/<file_name>")]
fn stream_file(session_id: String, temp_id: String, file_name: String) -> Option<NamedFile> {
    let res = dirs::check_session_id(&session_id);
    if res.is_err() {
        return None;
    }
    let session_path = res.unwrap();
    let path = session_path
        .join(dirs::_DIRNAME_TEMP)
        .join(temp_id)
        .join(file_name);
    let file = NamedFile::open(path);
    file.ok()
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
////////////////// *** MAIN *** /////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

fn main() {
    // This line is purely for generating Typescript types to be used in frontend
    #[cfg(debug_assertions)]
    typescript_export::write_file_to_tr_mono_hhfa(); // Need to run without --release flag

    // Main function starts here
    dirs::run_startup_checker();

    let cors = rocket_cors::CorsOptions::default().to_cors().unwrap();

    let config = Config::build(Environment::Production)
        .address("0.0.0.0")
        .port(9000)
        .keep_alive(0)
        .limits(rocket::config::Limits::new().limit("forms", 1000 * 1024 * 1024))
        // Secret key is generated dynamically, but could add here if desired
        .unwrap();

    rocket::custom(config)
        .mount(
            "/",
            routes![
                index_check,
                //
                new_session,
                end_session,
                //
                upload,
                varlist,
                delete_upload,
                //
                render_script,
                analyze,
                stream_file,
            ],
        )
        .attach(cors)
        .launch();
}
