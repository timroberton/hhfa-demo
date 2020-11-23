#[cfg(debug_assertions)]
use super::*;

#[cfg(debug_assertions)]
pub fn write_file_to_tr_mono_hhfa() {
    let s = format!(
        "{}\n\n{}\n\n{}\n\n{}\n\n{}\n\n{}\n\n{}\n\n{}\n\n",
        types::AnalyzeRequest::type_script_ify(),
        types::VarlistRequest::type_script_ify(),
        types::RawVar::type_script_ify(),
        types::Structure::type_script_ify(),
        types::Variable::type_script_ify(),
        types::Indicator::type_script_ify(),
        types::Analysis::type_script_ify(),
        types::AnalysisType::type_script_ify(),
    );

    let _ = std::fs::write("../tr-mono/src/apps/hhfa/types_server.ts", s);
}
