use super::*;

const _HANDLEBARS_TEMPLATE: &str = std::include_str!("templates/script.hbs");
const _HANDLEBARS_SUBTEMPLATE_1: &str = std::include_str!("templates/partial_remap.hbs");
const _HANDLEBARS_SUBTEMPLATE_2: &str = std::include_str!("templates/partial_analysis.hbs");

pub fn render_script(structure: &mut types::Structure) -> Result<String, std::io::Error> {
    structure.hydrate()?;
    let mut handlebars = handlebars::Handlebars::new();
    handlebars.register_escape_fn(handlebars::no_escape);
    // let _HANDLEBARS_TEMPLATE = std::fs::read_to_string("src/templates/script.hbs")?; // Will change back to const
    let res = handlebars.register_template_string("s1", _HANDLEBARS_TEMPLATE);
    if res.is_err() {
        return io_err("Could not register template 1");
    }
    // let _HANDLEBARS_SUBTEMPLATE_1 = std::fs::read_to_string("src/templates/partial_remap.hbs")?; // Will change back to const
    let res = handlebars.register_template_string("remap", _HANDLEBARS_SUBTEMPLATE_1);
    if res.is_err() {
        return io_err("Could not register subtemplate 1");
    }
    // let _HANDLEBARS_SUBTEMPLATE_2 = std::fs::read_to_string("src/templates/partial_analysis.hbs")?; // Will change back to const
    let res = handlebars.register_template_string("analysis", _HANDLEBARS_SUBTEMPLATE_2);
    if res.is_err() {
        return io_err("Could not register subtemplate 2");
    }
    match handlebars.render("s1", structure) {
        Ok(v) => Ok(v),
        Err(_) => io_err("Could not render handlebars template"),
    }
}

impl types::Structure {
    pub fn hydrate(&mut self) -> Result<(), std::io::Error> {
        for analysis in &mut self.analyses {
            // Items
            analysis.items = Vec::new();
            for item_id in &analysis.item_ids {
                match self.indicators.iter().find(|a| a.id == *item_id) {
                    Some(v) => analysis.items.push(v.clone()),
                    None => {
                        return io_err("No item in Indicators for item_id");
                    }
                }
            }
            // Denominator
            match &analysis.denominator_id {
                Some(id) => match self.indicators.iter().find(|a| a.id == *id) {
                    Some(v) => {
                        analysis.denominator = Some(v.clone());
                    }
                    None => {
                        return io_err("No item in Indicators for denominator_id");
                    }
                },
                None => {
                    analysis.denominator = None;
                }
            }
        }
        Ok(())
    }
}

pub fn run_once(ar: &mut types::AnalyzeRequest) -> Result<String, std::io::Error> {
    let script = analyze::render_script(&mut ar.structure)?;
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

fn io_err<T>(msg: &str) -> Result<T, std::io::Error> {
    Err(std::io::Error::new(std::io::ErrorKind::Other, msg))
}
