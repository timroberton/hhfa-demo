import { AnalysisType, BinaryAnalysisType, Indicator, NumberAnalysisType, Structure, Variable } from "./types_server";
import { Analysis } from './types_extra';
import defaultStructureBLANK from "./default_structure_BLANK.json";
import { copy } from "./utils";
import { _NO_VALUE } from "./components/config_editor";

export function getDefaultStructure(): Structure {
    const s: Structure = copy(defaultStructureBLANK);
    return s;
}

export function getDefaultVariable(): Variable {
    return {
        variableName: "",
        variableLabel: "",
        variableType: "number",
        rawVarName: "UNSELECTED",
        useRemapValues: false,
        useRemapMissing: false,
        remapMissing: _NO_VALUE,
        remapValues: [],
        labels: [],
    };
}

export function getDefaultIndicator(): Indicator {
    return {
        id: "",
        label: "",
        condition: "",
        isBinary: true,
        isNumber: false,
        useRemapMissing: false,
        remapMissing: _NO_VALUE,
        err: false,
        msg: "",
    };
}

export function getDefaultAnalysis(): Analysis {
    return {
        id: "",
        label: "",
        //
        indicatorsAreBinary: true,
        indicatorsAreNumber: false,
        //
        analysisType: AnalysisType.TableMultiIndicatorDisaggregated,
        binaryAnalysisType: BinaryAnalysisType.Proportion,
        numberAnalysisType: NumberAnalysisType.Mean,
        itemIds: [],
        denominatorId: null,
    };
}
