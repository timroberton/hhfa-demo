#[cfg(debug_assertions)]
use super::*;

#[cfg(debug_assertions)]
pub fn write_file_to_tr_mono_hhfa() {
    let s = format!(
        "{}\n\n{}\n\n{}\n\n{}\n\n{}\n\n{}\n\n{}\n\n{}\n\n{}\n\n{}\n\n{}\n\n{}\n\n{}\n\n{}\n\n",
        "import { Analysis } from './types_extra';",
        types::AnalyzeRequest::type_script_ify(),
        types::VarlistRequest::type_script_ify(),
        types::RawVar::type_script_ify(),
        types::RawVarResponseOption::type_script_ify(),
        types::Structure::type_script_ify(),
        types::ConfigDataset1::type_script_ify(),
        types::Variable::type_script_ify(),
        types::VariableRemapping::type_script_ify(),
        types::VariableLabel::type_script_ify(),
        types::Indicator::type_script_ify(),
        types::AnalysisType::type_script_ify(),
        types::BinaryAnalysisType::type_script_ify(),
        types::NumberAnalysisType::type_script_ify(),
    );

    let _ = std::fs::write(
        "/Users/timroberton/projects/tr-lerna/packages/app-hhfa/content/types_server.ts",
        s,
    );
}
