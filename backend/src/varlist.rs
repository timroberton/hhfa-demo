use super::*;

const _VARLIST_SCRIPT: &str = std::include_str!("templates/varlist_script.R");

pub fn get_varlist(vr: &types::VarlistRequest) -> Result<Vec<types::RawVar>, std::io::Error> {
    let session_path = dirs::check_session_id(&vr.session_id)?;
    let data_path = session_path.join(dirs::_DIRNAME_DATA);
    let (_, temp_path) = dirs::create_new_temp_dir(&vr.session_id)?;
    //
    import_files(&data_path, &temp_path, &vr.file_name)?;
    if dirs::running_in_docker() {
        run_r::run_within_docker(&temp_path)?;
    } else {
        run_r::run_outside_docker(&temp_path)?;
    }
    let variables = read_varlist(&temp_path)?;
    std::fs::remove_dir_all(temp_path)?;
    //
    Ok(variables)
}

fn import_files(
    data_path: &std::path::PathBuf,
    temp_path: &std::path::PathBuf,
    file_name: &String,
) -> Result<(), std::io::Error> {
    // Import data file
    let data_file_fr = data_path.join(&file_name);
    let data_file_to = temp_path.join(dirs::_FILENAME_COPIED_DATA_FILE);
    std::fs::copy(data_file_fr, data_file_to)?;
    // Write varlist script
    let varlist_file_to = temp_path.join(dirs::_FILENAME_SCRIPT);
    std::fs::write(varlist_file_to, _VARLIST_SCRIPT)?;
    //
    Ok(())
}

fn read_varlist(temp_path: &std::path::PathBuf) -> Result<Vec<types::RawVar>, std::io::Error> {
    let varlist_path = temp_path.join(dirs::_FILENAME_VARLIST_JSON);
    let varlist_str = std::fs::read_to_string(varlist_path)?;
    let res: Vec<types::RawVar> = serde_json::from_str(&varlist_str)?;
    Ok(res)
}
