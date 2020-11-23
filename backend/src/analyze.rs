use super::*;

const _HANDLEBARS_TEMPLATE: &str = std::include_str!("templates/analyze_script.hbs");

pub fn render_script(structure: &types::Structure) -> Result<String, std::io::Error> {
    let mut handlebars = handlebars::Handlebars::new();
    handlebars.register_escape_fn(handlebars::no_escape);
    let res = handlebars.register_template_string("s1", _HANDLEBARS_TEMPLATE);
    if res.is_err() {
        return Err(std::io::Error::new(std::io::ErrorKind::Other, "hmm"));
    }
    match handlebars.render("s1", structure) {
        Ok(v) => Ok(v),
        Err(_) => Err(std::io::Error::new(std::io::ErrorKind::Other, "hmm")),
    }
}

pub fn run_once(ar: &types::AnalyzeRequest) -> Result<String, std::io::Error> {
    let script = analyze::render_script(&ar.structure)?;
    //
    let session_path = dirs::check_session_id(&ar.session_id)?;
    let data_path = session_path.join(dirs::_DIRNAME_DATA);
    let (temp_id, temp_path) = dirs::create_new_temp_dir(&ar.session_id)?;
    //
    import_files_and_write_script(&data_path, &temp_path, &ar.file_name, &script)?;
    if dirs::running_in_docker() {
        run_r::run_within_docker(&temp_path)?;
    } else {
        run_r::run_outside_docker(&temp_path)?;
    }
    //
    Ok(temp_id)
}

fn import_files_and_write_script(
    data_path: &std::path::PathBuf,
    temp_path: &std::path::PathBuf,
    file_name: &String,
    script: &String,
) -> Result<(), std::io::Error> {
    // Import data file
    let data_file_fr = data_path.join(&file_name);
    let data_file_to = temp_path.join(dirs::_FILENAME_COPIED_DATA_FILE);
    std::fs::copy(data_file_fr, data_file_to)?;

    // Write script
    let varlist_file_to = temp_path.join(dirs::_FILENAME_SCRIPT);
    std::fs::write(varlist_file_to, script)?;

    //
    Ok(())
}
