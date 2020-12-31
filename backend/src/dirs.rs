use uuid;

pub const _ENV_VARKEY_RUNNING_IN_DOCKER: &str = "RUNNING_IN_DOCKER";

pub const _DOCKER_IMAGE_TIDYVERSE_4_0_2: &str = "rocker/tidyverse:4.0.2";

pub const _FILENAME_COPIED_DATA_FILE: &str = "DATA_FILE_TO_ANALYZE.dta";
pub const _FILENAME_SCRIPT: &str = "script.R";
pub const _FILENAME_VARLIST_JSON: &str = "VARLIST.json";
pub const _PATH_TO_SESSIONS_DEV: &str = "./sessions";
pub const _PATH_TO_SESSIONS_PROD: &str = "/home/sessions";
pub const _DIRNAME_DATA: &str = "data";
pub const _DIRNAME_TEMP: &str = "temp";

pub fn running_in_docker() -> bool {
    match std::env::var(_ENV_VARKEY_RUNNING_IN_DOCKER) {
        Ok(_val) => true,
        Err(_e) => false,
    }
}

pub fn path_to_sessions() -> std::path::PathBuf {
    if running_in_docker() {
        std::path::Path::new(&_PATH_TO_SESSIONS_PROD)
            .canonicalize()
            .unwrap()
    } else {
        std::path::Path::new(&_PATH_TO_SESSIONS_DEV)
            .canonicalize()
            .unwrap()
    }
}

pub fn run_startup_checker() {
    if !std::path::Path::new(&path_to_sessions()).exists() {
        println!("ERROR! Sessions folder does not exist\n");
        std::process::exit(1);
    }
    if !running_in_docker() && check_docker_image().is_err() {
        println!("ERROR! Could not find local docker image\n");
        std::process::exit(1);
    }
    clear_session_folder();
}

fn clear_session_folder() {
    let p = path_to_sessions();
    for fres in std::fs::read_dir(&p).unwrap() {
        let f = fres.unwrap();
        let fpath = f.path();
        if fpath.is_dir() {
            std::fs::remove_dir_all(fpath).unwrap();
        } else {
            std::fs::remove_file(fpath).unwrap();
        }
    }
}

pub fn check_session_id(session_id: &String) -> Result<std::path::PathBuf, std::io::Error> {
    let p = path_to_sessions().join(session_id);
    if !std::path::Path::new(&p).exists() {
        return Err(std::io::Error::new(std::io::ErrorKind::Other, "Hmm"));
    }
    Ok(p)
}

pub fn create_new_session_dir() -> Result<String, std::io::Error> {
    let sessions_dir = path_to_sessions();
    let session_uuid = uuid::Uuid::new_v4();
    let session_id = session_uuid.to_string();
    let mut session_path = sessions_dir.join(&session_id);

    while std::path::Path::new(&session_path).exists() {
        let session_uuid = uuid::Uuid::new_v4();
        let session_id = session_uuid.to_string();
        session_path = sessions_dir.join(&session_id);
    }

    let data_path = session_path.join(_DIRNAME_DATA);
    let temp_path = session_path.join(_DIRNAME_TEMP);

    std::fs::DirBuilder::new()
        .recursive(false)
        .create(&session_path)?;

    std::fs::DirBuilder::new()
        .recursive(false)
        .create(&data_path)?;

    std::fs::DirBuilder::new()
        .recursive(false)
        .create(&temp_path)?;

    // TEMPORARY FOR DEVELOPMENT
    // TEMPORARY FOR DEVELOPMENT
    // TEMPORARY FOR DEVELOPMENT
    // TEMPORARY FOR DEVELOPMENT
    // let old_file_path = path_to_sessions().join("../hfa_comb_bfa.dta");
    // let new_file_path = data_path.join("hfa_comb_bfa.dta");
    // std::fs::copy(&old_file_path, &new_file_path).unwrap();
    // TEMPORARY FOR DEVELOPMENT
    // TEMPORARY FOR DEVELOPMENT
    // let vl = varlist::get_varlist(&types::VarlistRequest {
    //     session_id: session_id.clone(),
    //     file_name: "hfa_comb_bfa.dta".to_string(),
    // })
    // .unwrap();
    // let j = serde_json::to_string_pretty(&vl).unwrap();
    // std::fs::write("varlist.json", &j).unwrap();
    // TEMPORARY FOR DEVELOPMENT
    // TEMPORARY FOR DEVELOPMENT
    // TEMPORARY FOR DEVELOPMENT
    // TEMPORARY FOR DEVELOPMENT

    Ok(session_id)
}

pub fn create_new_temp_dir(
    session_id: &String,
) -> Result<(String, std::path::PathBuf), std::io::Error> {
    let session_path = check_session_id(session_id)?;
    let temps_dir = session_path.join(_DIRNAME_TEMP);
    let temp_uuid = uuid::Uuid::new_v4();
    let temp_id = temp_uuid.to_string();
    let mut temp_path = temps_dir.join(&temp_id);

    while std::path::Path::new(&temp_path).exists() {
        let temp_uuid = uuid::Uuid::new_v4();
        let temp_id = temp_uuid.to_string();
        temp_path = temps_dir.join(&temp_id);
    }

    std::fs::DirBuilder::new()
        .recursive(false)
        .create(&temp_path)?;

    Ok((temp_id, temp_path))
}

fn check_docker_image() -> Result<(), std::io::Error> {
    println!("Checking and pulling needed docker image...");
    let output = std::process::Command::new("docker")
        .args(&["pull", _DOCKER_IMAGE_TIDYVERSE_4_0_2])
        .output()?;
    if !output.status.success() {
        return Err(std::io::Error::new(std::io::ErrorKind::Other, "Hmm"));
    }
    Ok(())
}
