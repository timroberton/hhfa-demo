use super::*;

const _VARLIST_SCRIPT: &str = std::include_str!("./varlist_script.R");

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
    let flat = read_varlist(&temp_path)?;
    std::fs::remove_dir_all(temp_path)?;
    //
    let variables = get_vars_from_flat(&flat)?;
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
    let varlist_script_to = temp_path.join(dirs::_FILENAME_SCRIPT);
    std::fs::write(varlist_script_to, _VARLIST_SCRIPT)?;
    //
    Ok(())
}

fn read_varlist(
    temp_path: &std::path::PathBuf,
) -> Result<Vec<types::RawVarFlatForRProcessing>, std::io::Error> {
    let varlist_path = temp_path.join(dirs::_FILENAME_VARLIST_JSON);
    let varlist_str = std::fs::read_to_string(varlist_path)?;
    let res: Vec<types::RawVarFlatForRProcessing> = serde_json::from_str(&varlist_str)?;
    Ok(res)
}

fn get_vars_from_flat(
    flat: &Vec<types::RawVarFlatForRProcessing>,
) -> Result<Vec<types::RawVar>, std::io::Error> {
    Ok(flat
        .iter()
        .map(|f| {
            let mut rv = types::RawVar {
                variable_name: f.variable_name.clone(),
                variable_label: f.variable_label.clone(),
                variable_type: f.variable_type.clone(),
                n_response_options: f.n_response_options,
                has_any_stata_labels: f.has_any_stata_labels,
                response_options: Vec::new(),
                n_missing: f.n_missing,
            };

            let actuals_res = serde_json::from_str::<Vec<usize>>(&f.response_option_actuals);
            let values_res = serde_json::from_str::<Vec<usize>>(&f.response_option_values);
            let labels_res = serde_json::from_str::<Vec<String>>(&f.response_option_labels);

            if actuals_res.is_err() || values_res.is_err() || labels_res.is_err() {
                println!("{}", f.variable_name);
                return rv;
            }

            let actuals = actuals_res.unwrap(); // Safe to unwrap, because already checked err
            let values = values_res.unwrap(); // Safe to unwrap, because already checked err
            let labels = labels_res.unwrap(); // Safe to unwrap, because already checked err

            if values.len() != labels.len() {
                // println!("{}", f.variable_name);
                return rv;
            }

            for val in actuals {
                match values.iter().position(|a| *a == val) {
                    Some(index) => {
                        rv.response_options.push(types::RawVarResponseOption {
                            value: val,
                            is_labelled: true,
                            label: labels[index].clone(), // Safe to index, because already compared lengths
                        });
                    }
                    None => {
                        rv.response_options.push(types::RawVarResponseOption {
                            value: val,
                            is_labelled: false,
                            label: "UNLABELLED".to_string(),
                        });
                    }
                }
            }

            return rv;
        })
        .collect())
}
