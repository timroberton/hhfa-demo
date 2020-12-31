import { useState } from "react";
import { copy } from "../utils";
import { Indicator, RawVar, Structure, Variable } from "../types_server";
import { Analysis } from '../types_extra';
import { _HOST } from "../urls";
import { getDefaultStructure } from "../defaults";
import { validateIndicators } from "../validate_indicators";

export function useStructure(rawVars: RawVar[]): UseStructure {

    const s = getDefaultStructure();
    validateIndicators(s, rawVars);

    const [structure, setStructure] = useState<Structure>(s);

    function loadStructure(s: Structure) {
        validateIndicators(s, rawVars);
        setStructure(s);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    function updateC1(prop: string, val: boolean | string): void {
        const s: Structure = copy(structure);
        //@ts-ignore
        s.config1[prop] = val;
        setStructure(s);
    }

    function updateVariableConfig1(prop: string, variable: Variable | null): string {
        const s: Structure = copy(structure);
        //@ts-ignore
        s.config1[prop] = variable;
        setStructure(s);
        return "";
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    function createOrUpdateVariable(v: Variable, originalVariableName: string): string {
        const s: Structure = copy(structure);
        const c = s.variables
            .filter(a => a.variableName === v.variableName && a.variableName !== originalVariableName)
            .length;
        if (c > 0) {
            return "Already a variable with this name";
        }
        const i = s.variables.findIndex(a => a.variableName === originalVariableName);
        if (i === -1) {
            s.variables.push(v);
        } else {
            s.variables[i] = v;
        }
        validateIndicators(s, rawVars);
        setStructure(s);
        return "";
    }

    function deleteVariable(originalVariableName: string): string {
        const s: Structure = copy(structure);
        const i = s.variables.findIndex(a => a.variableName === originalVariableName);
        if (i > -1) {
            s.variables.splice(i, 1);
        }
        validateIndicators(s, rawVars);
        setStructure(s);
        return "";
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    function createOrUpdateIndicator(v: Indicator, originalIndicatorName: string): string {
        const s: Structure = copy(structure);
        const c = s.indicators
            .filter(a => a.id === v.id && a.id !== originalIndicatorName)
            .length;
        if (c > 0) {
            return "Already an indicator with this name";
        }
        const i = s.indicators.findIndex(a => a.id === originalIndicatorName);
        if (i === -1) {
            s.indicators.push(v);
        } else {
            s.indicators[i] = v;
        }
        validateIndicators(s, rawVars);
        setStructure(s);
        return "";
    }

    function deleteIndicator(originalIndicatorName: string): string {
        const s: Structure = copy(structure);
        const i = s.indicators.findIndex(a => a.id === originalIndicatorName);
        if (i > -1) {
            s.indicators.splice(i, 1);
        }
        validateIndicators(s, rawVars);
        setStructure(s);
        return "";
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    function createOrUpdateAnalysis(v: Analysis, o: string): string {
        const s: Structure = copy(structure);
        const c = s.analyses
            .filter(a => a.id === v.id && a.id !== o)
            .length;
        if (c > 0) {
            return "Already an analysis with this id";
        }
        const i = s.analyses.findIndex(a => a.id === o);
        if (i === -1) {
            s.analyses.push(v);
        } else {
            s.analyses[i] = v;
        }
        setStructure(s);
        return "";
    }

    function deleteAnalysis(o: string): string {
        const s: Structure = copy(structure);
        const i = s.analyses.findIndex(a => a.id === o);
        if (i > -1) {
            s.analyses.splice(i, 1);
        }
        setStructure(s);
        return "";
    }

    function clearAnalyses(): string {
        const s: Structure = copy(structure);
        s.analyses = [];
        setStructure(s);
        return "";
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    return {
        structure,
        // loading,
        // err,
        //
        updateVariableConfig1,
        updateC1,
        //
        createOrUpdateVariable,
        deleteVariable,
        //
        createOrUpdateIndicator,
        deleteIndicator,
        //
        createOrUpdateAnalysis,
        deleteAnalysis,
        clearAnalyses,
        //
        loadStructure,
    };

}

export type UseStructure = {
    structure: Structure,
    // loading: boolean,
    // err: string,
    //
    updateVariableConfig1: (prop: string, variable: Variable | null) => string,
    updateC1: (prop: string, val: boolean | string) => void,
    //
    createOrUpdateVariable: (v: Variable, o: string) => string,
    deleteVariable: (o: string) => string,
    //
    createOrUpdateIndicator: (v: Indicator, o: string) => string,
    deleteIndicator: (o: string) => string,
    //
    createOrUpdateAnalysis: (v: Analysis, o: string) => string,
    deleteAnalysis: (o: string) => string,
    clearAnalyses: () => string,
    //
    loadStructure: (s: Structure) => void,
};