import { useEffect, useState } from "react";
import { getRenderedScript } from "../actions/crud";
import { Structure } from "../types_server";
import { _HOST } from "../urls";

export function useScript(structure: Structure, display: boolean): UseScript {

    const [script, setScript] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [err, setErr] = useState<string>("");

    const [isCurrent, setIsCurrent] = useState<boolean>(false);

    async function firstLoad(doit: boolean) {
        if (!doit || isCurrent) {
            return;
        }
        setLoading(true);
        setErr("");
        const script = await getRenderedScript(structure);
        if (!script) {
            setErr("Could not reach server at " + _HOST);
            setLoading(false);
            return;
        }
        setErr("");
        setScript(script);
        setLoading(false);
        setIsCurrent(true);
    }

    useEffect(() => {
        setIsCurrent(false);
    }, [structure]);

    useEffect(() => {
        firstLoad(display);
    }, [display]);

    return {
        script,
        loadingScript: loading,
        err,
    };

}

export type UseScript = {
    script: string,
    loadingScript: boolean,
    err: string,
};