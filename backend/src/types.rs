use super::*;

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub struct AnalyzeRequest {
    pub session_id: String,
    pub file_name: String,
    pub structure: Structure,
}

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub struct VarlistRequest {
    pub session_id: String,
    pub file_name: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct RawVarFlatForRProcessing {
    pub variable_name: String,
    pub variable_label: String,
    pub variable_type: String,
    pub n_response_options: usize,
    pub response_option_actuals: String,
    pub has_any_stata_labels: bool,
    pub response_option_values: String,
    pub response_option_labels: String,
    pub n_missing: usize,
}

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub struct RawVar {
    #[serde(rename = "variableName")]
    pub variable_name: String,
    #[serde(rename = "variableLabel")]
    pub variable_label: String,
    #[serde(rename = "variableType")]
    pub variable_type: String,
    //
    #[serde(rename = "nResponseOptions")]
    pub n_response_options: usize,
    #[serde(rename = "hasAnyStataLabels")]
    pub has_any_stata_labels: bool,
    #[serde(rename = "responseOptions")]
    pub response_options: Vec<RawVarResponseOption>,
    //
    #[serde(rename = "nMissing")]
    pub n_missing: usize,
}

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub struct RawVarResponseOption {
    pub value: usize,
    #[serde(rename = "isLabelled")]
    pub is_labelled: bool,
    pub label: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub struct Structure {
    pub config1: ConfigDataset1,
    pub variables: Vec<Variable>,
    pub indicators: Vec<Indicator>,
    pub analyses: Vec<Analysis>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub struct ConfigDataset1 {
    #[serde(rename = "useModule1")]
    pub use_module_1: bool,
    #[serde(rename = "useModule2")]
    pub use_module_2: bool,
    #[serde(rename = "useModule3")]
    pub use_module_3: bool,
    #[serde(rename = "useModule4")]
    pub use_module_4: bool,
    //
    #[serde(rename = "useModule1CoreAdditional")]
    pub use_module_1_core_additional: bool,
    #[serde(rename = "useModule1Supplementary")]
    pub use_module_1_supplementary: bool,
    #[serde(rename = "useModule4CoreAdditional")]
    pub use_module_4_core_additional: bool,
    //
    #[serde(rename = "variableSurveyDesign1")]
    pub variable_survey_design_1: Option<Variable>,
    #[serde(rename = "variableSurveyDesign2")]
    pub variable_survey_design_2: Option<Variable>,
    #[serde(rename = "variableSurveyDesign3")]
    pub variable_survey_design_3: Option<Variable>,
    #[serde(rename = "variableSurveyDesign4")]
    pub variable_survey_design_4: Option<Variable>,
    //
    #[serde(rename = "variableStratifier1")]
    pub variable_stratifier_1: Option<Variable>,
    #[serde(rename = "variableStratifier2")]
    pub variable_stratifier_2: Option<Variable>,
    #[serde(rename = "variableStratifier3")]
    pub variable_stratifier_3: Option<Variable>,
    #[serde(rename = "variableStratifier4")]
    pub variable_stratifier_4: Option<Variable>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub struct Variable {
    #[serde(rename = "rawVarName")]
    pub raw_var_name: String,
    #[serde(rename = "variableName")]
    pub variable_name: String,
    #[serde(rename = "variableLabel")]
    pub variable_label: String,
    #[serde(rename = "variableType")]
    pub variable_type: String,
    //
    #[serde(rename = "useRemapValues")]
    pub use_remap_values: bool,
    #[serde(rename = "useRemapMissing")]
    pub use_remap_missing: bool,
    #[serde(rename = "remapValues")]
    pub remap_values: Vec<VariableRemapping>,
    #[serde(rename = "remapMissing")]
    pub remap_missing: usize,
    //
    pub labels: Vec<VariableLabel>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub struct VariableRemapping {
    pub from: usize,
    #[serde(rename = "toMissing")]
    pub to_missing: bool,
    pub to: usize,
}

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub struct VariableLabel {
    pub value: usize,
    pub label: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub struct Indicator {
    pub id: String,
    pub label: String,
    //
    #[serde(rename = "isBinary")]
    pub is_binary: bool,
    #[serde(rename = "isNumber")]
    pub is_number: bool,
    //
    pub condition: String,
    //
    #[serde(rename = "useRemapMissing")]
    pub use_remap_missing: bool,
    #[serde(rename = "remapMissing")]
    pub remap_missing: usize,
    //
    #[serde(skip_deserializing)]
    pub err: bool,
    #[serde(skip_deserializing)]
    pub msg: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Analysis {
    pub id: String,
    pub label: String,
    //
    #[serde(rename = "indicatorsAreBinary")]
    pub indicators_are_binary: bool,
    #[serde(rename = "indicatorsAreNumber")]
    pub indicators_are_number: bool,
    //
    #[serde(rename = "analysisType")]
    pub analysis_type: AnalysisType,
    #[serde(rename = "binaryAnalysisType")]
    pub binary_analysis_type: BinaryAnalysisType,
    #[serde(rename = "numberAnalysisType")]
    pub number_analysis_type: NumberAnalysisType,
    //
    #[serde(rename = "itemIds")]
    pub item_ids: Vec<String>,
    #[serde(rename = "denominatorId")]
    pub denominator_id: Option<String>,
    //
    #[serde(skip_deserializing)]
    pub items: Vec<Indicator>,
    #[serde(skip_deserializing)]
    pub denominator: Option<Indicator>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub enum BinaryAnalysisType {
    Proportion,
    Count,
}

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub enum NumberAnalysisType {
    Mean,
    Median,
    Total,
}

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub enum AnalysisType {
    TableMultiIndicatorDisaggregated,
    PlotSingleIndicatorDisaggregated,
    PlotMultiIndicator,
    TableMultiIndicatorDisaggregatedFiltered,
    PlotSingleIndicatorDisaggregatedFiltered,
    PlotMultiIndicatorFiltered,
}
