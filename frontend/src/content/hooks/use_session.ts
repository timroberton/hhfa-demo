import { useEffect, useState } from "react";
import { endSession, getSessionId } from "../actions/crud";
import { _HOST } from "../urls";

export type UseSession = {
    sessionId: string,
    loading: boolean,
    err: string,
    resetSession: () => void,
    ending: boolean,
    endingErr: string,
};

export function useSession(lastUpdate: string | null): UseSession {

    const [sessionId, setSessionId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [err, setErr] = useState<string>("");
    const [ending, setEnding] = useState<boolean>(false);
    const [endingErr, setEndingErr] = useState<string>("");

    async function firstLoad() {
        setLoading(true);
        setErr("");
        window.setTimeout(async () => {
            const sid = await getSessionId();
            if (!sid) {
                setErr("Could not connect to " + _HOST);
                setLoading(false);
                return;
            }
            setSessionId(sid);
            setLoading(false);
        }, 200);
    }

    async function resetSession() {
        setEnding(true);
        setEndingErr("");
        const { error, msg } = await endSession(sessionId);
        if (error) {
            setSessionId("");
            setEndingErr(msg);
            setEnding(false);
            return;
        }
        setSessionId("");
        setEnding(false);
    }

    useEffect(() => {
        if (lastUpdate !== null) {
            firstLoad();
        }
    }, [lastUpdate]);

    return {
        sessionId,
        loading,
        err,
        resetSession,
        ending,
        endingErr,
    };

}