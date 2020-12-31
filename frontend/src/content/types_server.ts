import { Analysis } from './types_extra';

export type AnalyzeRequest = { session_id: string; file_name: string; structure: Structure };

export type VarlistRequest = { session_id: string; file_name: string };

export type RawVar = {     variableName: string; variableLabel: string; variableType: string;     nResponseOptions: number; hasAnyStataLabels: boolean; responseOptions: RawVarResponseOption []; nMissing: number };

export type RawVarResponseOption = { value: number; isLabelled: boolean; label: string };

export type Structure = {     config1: ConfigDataset1; variables: Variable []; indicators:     Indicator []; analyses: Analysis [] };

export type ConfigDataset1 = {     useModule1: boolean; useModule2: boolean; useModule3: boolean;     useModule4: boolean; useModule1CoreAdditional: boolean;     useModule1Supplementary: boolean; useModule4CoreAdditional: boolean;     variableSurveyDesign1: Variable | null; variableSurveyDesign2: Variable     | null; variableSurveyDesign3: Variable | null; variableSurveyDesign4:     Variable | null; variableStratifier1: Variable | null;     variableStratifier2: Variable | null; variableStratifier3: Variable |     null; variableStratifier4: Variable | null };

export type Variable = {     rawVarName: string; variableName: string; variableLabel: string;     variableType: string; useRemapValues: boolean; useRemapMissing:     boolean; remapValues: VariableRemapping []; remapMissing: number;     labels: VariableLabel [] };

export type VariableRemapping = { from: number; toMissing: boolean; to: number };

export type VariableLabel = { value: number; label: string };

export type Indicator = {     id: string; label: string; isBinary: boolean; isNumber: boolean;     condition: string; useRemapMissing: boolean; remapMissing: number;     err: boolean; msg: string };

export enum AnalysisType {     TableMultiIndicatorDisaggregated = "TableMultiIndicatorDisaggregated",     PlotSingleIndicatorDisaggregated = "PlotSingleIndicatorDisaggregated",     PlotMultiIndicator = "PlotMultiIndicator",     TableMultiIndicatorDisaggregatedFiltered =     "TableMultiIndicatorDisaggregatedFiltered",     PlotSingleIndicatorDisaggregatedFiltered =     "PlotSingleIndicatorDisaggregatedFiltered", PlotMultiIndicatorFiltered =     "PlotMultiIndicatorFiltered" };

export enum BinaryAnalysisType { Proportion = "Proportion", Count = "Count" };

export enum NumberAnalysisType { Mean = "Mean", Median = "Median", Total = "Total" };

