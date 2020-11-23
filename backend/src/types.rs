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

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub struct RawVar {
    #[serde(rename = "variableName")]
    pub variable_name: String,
    #[serde(rename = "variableType")]
    pub variable_type: String,
    #[serde(rename = "nResponseOptions")]
    pub n_response_otions: usize,
    #[serde(rename = "responseOptions")]
    pub response_options: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub struct Structure {
    variables: Vec<Variable>,
    indicators: Vec<Indicator>,
    analyses: Vec<Analysis>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub struct Variable {
    #[serde(rename = "variableName")]
    pub variable_name: String,
    #[serde(rename = "variableLabel")]
    pub variable_label: String,
    #[serde(rename = "variableType")]
    pub variable_type: String,
    #[serde(rename = "rawVarName")]
    pub raw_var_name: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub struct Indicator {
    #[serde(rename = "indicatorName")]
    indicator_name: String,
    #[serde(rename = "indicatorLabel")]
    indicator_label: String,
    //
    condition: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, TypeScriptify)]
pub struct Analysis {
    #[serde(rename = "analysisId")]
    analysis_id: String,
    #[serde(rename = "analysisType")]
    analysis_type: AnalysisType,
    #[serde(rename = "analysisLabel")]
    analysis_label: String,
    //
    #[serde(rename = "itemIds")]
    item_ids: Vec<String>,
    //
    #[serde(skip_deserializing)]
    items: Vec<Indicator>,
    //
    #[serde(rename = "useStratifier")]
    use_stratifier: bool,
    stratifier: Option<String>,
    //
    #[serde(rename = "useDenominator")]
    use_denominator: bool,
    denominator: Option<String>,
    #[serde(rename = "denominatorCondition")]
    denominator_condition: String,
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
