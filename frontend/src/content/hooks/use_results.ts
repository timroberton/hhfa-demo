import { getCSVFileArrayBuffer } from "../actions/crud";
import { Analysis } from "../types_extra";
import XLSX from "xlsx";
import { useEffect, useState } from "react";

export type UseResults = {
    trigger: (analysisId: string) => void,
    resultsHolder: ResultsHolder,
    resultsTab: string,
    setResultsTab: (newResultsTab: string) => void,
};

export function useResults(analyses: Analysis[], sessionId: string, tempId: string | null): UseResults {

    const [resultsHolder, setResultsHolder] = useState<ResultsHolder>(getFreshResultsHolder(analyses));
    const [resultsTab, setResultsTab] = useState<string>("full");

    useEffect(() => {
        setResultsHolder(getFreshResultsHolder(analyses));
        setResultsTab("full");
    }, [analyses, tempId]);

    async function trigger(analysisId: string) {
        if (!tempId) {
            return;
        }
        if (resultsHolder[analysisId] && resultsHolder[analysisId].ready) {
            return;
        }
        const d0 = await attemptGetCSVFile(sessionId, tempId, `${analysisId}_stratnone_table.csv`);
        const d1 = await attemptGetCSVFile(sessionId, tempId, `${analysisId}_strat1_table.csv`);
        const d2 = await attemptGetCSVFile(sessionId, tempId, `${analysisId}_strat2_table.csv`);
        const d3 = await attemptGetCSVFile(sessionId, tempId, `${analysisId}_strat3_table.csv`);
        const d4 = await attemptGetCSVFile(sessionId, tempId, `${analysisId}_strat4_table.csv`);
        if (!d0 || !d1 || !d2 || !d3 || !d4) {
            setResultsHolder(prev => {
                const rh = { ...prev };
                if (!rh[analysisId]) {
                    return rh;
                }
                rh[analysisId].error = true;
                return rh;
            });
            return;
        }
        setResultsHolder(prev => {
            const rh = { ...prev };
            rh[analysisId] = {
                ready: true,
                error: false,
                d0,
                d1,
                d2,
                d3,
                d4,
            };
            return rh;
        });
    }

    return {
        trigger,
        resultsHolder,
        resultsTab,
        setResultsTab,
    };

}

function getFreshResultsHolder(analyses: Analysis[]): ResultsHolder {
    const rh: ResultsHolder = {};
    analyses.forEach(a => {
        rh[a.id] = {
            ready: false,
            error: false,
            d0: [],
            d1: [],
            d2: [],
            d3: [],
            d4: [],
        };
    });
    return rh;
}

type ResultsHolder = {
    [analysisId: string]: AnalysisResults,
};

export type AnalysisResults = {
    ready: boolean,
    error: boolean,
    d0: any[][],
    d1: any[][],
    d2: any[][],
    d3: any[][],
    d4: any[][],
};

async function attemptGetCSVFile(sessionId: string, tempId: string, fileName: string): Promise<any[][] | undefined> {
    const data = await getCSVFileArrayBuffer(sessionId, tempId, fileName);
    if (!data) {
        return undefined;
    }
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
        return undefined;
    }
    const sheet = workbook.Sheets[sheetName];
    const j: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    return j;
}