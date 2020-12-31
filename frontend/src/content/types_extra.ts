import { AnalysisType, BinaryAnalysisType, NumberAnalysisType } from "./types_server";

export type TimResponse<T> = {
    error: boolean,
    msg: string | null,
    data: T | null,
}

export const _STRATIFIER_NAMES: string[] = [
    "National",
    "Administration level",
    "Urban/rural",
    "Facility type",
    "Managing authority",
];

export const _ANALYSIS_TYPE_OPTIONS: { value: AnalysisType, text: string }[] = [
    { value: AnalysisType.TableMultiIndicatorDisaggregated, text: "Table Multi-Indicator Disaggregated" },
    { value: AnalysisType.PlotSingleIndicatorDisaggregated, text: "Plot Single-Indicator Disaggregated" },
    { value: AnalysisType.PlotMultiIndicator, text: "Plot Multi-Indicator" },
    { value: AnalysisType.TableMultiIndicatorDisaggregatedFiltered, text: "Table Multi-Indicator Disaggregated Filtered" },
    { value: AnalysisType.PlotSingleIndicatorDisaggregatedFiltered, text: "Plot Single-Indicator Disaggregated Filtered" },
    { value: AnalysisType.PlotMultiIndicatorFiltered, text: "Plot Multi-Indicator Filtered" },
];

export const _BINARY_ANALYSIS_TYPE_OPTIONS: { value: BinaryAnalysisType, text: string }[] = [
    { value: BinaryAnalysisType.Proportion, text: "Proportion" },
    { value: BinaryAnalysisType.Count, text: "Count" },
];

export const _NUMBER_ANALYSIS_TYPE_OPTIONS: { value: NumberAnalysisType, text: string }[] = [
    { value: NumberAnalysisType.Mean, text: "Mean" },
    { value: NumberAnalysisType.Median, text: "Median" },
    { value: NumberAnalysisType.Total, text: "Total" },
];

export type Analysis = {
    id: string;
    label: string;
    //
    indicatorsAreBinary: boolean,
    indicatorsAreNumber: boolean,
    //
    analysisType: AnalysisType;
    binaryAnalysisType: BinaryAnalysisType,
    numberAnalysisType: NumberAnalysisType,
    itemIds: string[];
    denominatorId: string | null;
};