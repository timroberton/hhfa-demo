import { useEffect, useMemo, useState } from "react";
import { runAnalysis } from "../actions/crud";
import { Structure } from "../types_server";
import { DatasetNumber, Datasets } from "./use_datasets";

export type UseAnalyze = {
    everRun: boolean,
    needsRunning: boolean,
    running: boolean,
    run: () => void,
    errorRunningAnalysis: string,
    tempId: string | null,
};

export function useAnalyze(sessionId: string, datasets: Datasets, structure: Structure): UseAnalyze {

    const permanentSessionId = useMemo(() => sessionId, [sessionId]);

    const [everRun, setEverRun] = useState<boolean>(false);
    const [needsRunning, setNeedsRunning] = useState<boolean>(true);
    const [running, setRunning] = useState<boolean>(false);
    const [errorRunningAnalysis, setErrorRunningAnalysis] = useState<string>("");
    const [tempId, setTempId] = useState<string | null>(null);

    useEffect(() => {
        setNeedsRunning(true);
        setErrorRunningAnalysis("");
        setTempId(null);
    }, [datasets, structure]);

    async function run() {
        if (!datasets[DatasetNumber.One]) {
            return;
        }
        setRunning(true);
        setErrorRunningAnalysis("");
        setTempId(null);
        const newTempId = await runAnalysis(permanentSessionId, datasets[DatasetNumber.One].fileName, structure);
        if (!newTempId) {
            setErrorRunningAnalysis("Problem with analysis script. R did not complete the analysis.");
            setTempId(newTempId);
            setRunning(false);
            return;
        }
        setTempId(newTempId);
        setRunning(false);
        setNeedsRunning(false);
        setEverRun(true);

    }

    return {
        everRun,
        needsRunning,
        running,
        run,
        errorRunningAnalysis,
        tempId,
    };

}