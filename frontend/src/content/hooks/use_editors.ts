import React, { useState } from "react";
import { Indicator, Variable } from "../types_server";
import { Analysis } from "../types_extra";
import { _HOST } from "../urls";
import { DatasetNumber } from "./use_datasets";

export function useEditors(): UseEditors {

    const [configEditor, setConfigEditor] = useState<string>("");
    const [variableEditor, setVariableEditor] = useState<Variable | undefined>(undefined);
    const [indicatorEditor, setIndicatorEditor] = useState<Indicator | undefined>(undefined);
    const [analysisEditor, setAnalysisEditor] = useState<Analysis | undefined>(undefined);
    const [uploadsEditor, setUploadsEditor] = useState<DatasetNumber | undefined>(undefined);
    const [scriptViewer, setScriptViewer] = useState<boolean>(false);
    const [exportEditor, setExportEditor] = useState<boolean>(false);
    const [loadEditor, setLoadEditor] = useState<boolean>(false);

    function closeAllEditors() {
        setConfigEditor("");
        setVariableEditor(undefined);
        setIndicatorEditor(undefined);
        setAnalysisEditor(undefined);
        setUploadsEditor(undefined);
        setScriptViewer(false);
        setExportEditor(false);
        setLoadEditor(false);
    }

    return {
        configEditor,
        setConfigEditor,
        //
        variableEditor,
        setVariableEditor,
        //
        indicatorEditor,
        setIndicatorEditor,
        //
        analysisEditor,
        setAnalysisEditor,
        //
        uploadsEditor,
        setUploadsEditor,
        //
        scriptViewer,
        setScriptViewer,
        //
        exportEditor,
        setExportEditor,
        //
        loadEditor,
        setLoadEditor,
        //
        closeAllEditors,
    };

}

export type UseEditors = {
    configEditor: string,
    setConfigEditor: React.Dispatch<React.SetStateAction<string>>,
    //
    variableEditor: Variable | undefined,
    setVariableEditor: React.Dispatch<React.SetStateAction<Variable | undefined>>,
    //
    indicatorEditor: Indicator | undefined,
    setIndicatorEditor: React.Dispatch<React.SetStateAction<Indicator | undefined>>,
    //
    analysisEditor: Analysis | undefined,
    setAnalysisEditor: React.Dispatch<React.SetStateAction<Analysis | undefined>>,
    //
    uploadsEditor: DatasetNumber | undefined,
    setUploadsEditor: React.Dispatch<React.SetStateAction<DatasetNumber | undefined>>,
    //
    scriptViewer: boolean,
    setScriptViewer: React.Dispatch<React.SetStateAction<boolean>>,
    //
    exportEditor: boolean,
    setExportEditor: React.Dispatch<React.SetStateAction<boolean>>,
    //
    loadEditor: boolean,
    setLoadEditor: React.Dispatch<React.SetStateAction<boolean>>,
    //
    closeAllEditors: () => void,
}