import axios from "axios";
import { TimResponse } from "../types_extra";
import { RawVar, Structure } from "../types_server";
import { _HOST } from "../urls";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

export async function getSessionId(): Promise<string | null> {
    try {
        const res = await axios.get<TimResponse<string>>(`${_HOST}/new_session`);
        if (res.data.error) {
            console.log(res.data.msg);
            return null;
        }
        return res.data.data;
    }
    catch (err) {
        return null;
    }
};

export async function endSession(sessionId: string): Promise<{ error: boolean, msg: string }> {
    try {
        const res = await axios.get<TimResponse<string>>(`${_HOST}/end_session/${sessionId}`);
        if (res.data.error) {
            console.log(res.data.msg);
            return { error: true, msg: res.data.msg || "No error message" };
        }
        return { error: false, msg: "" };
    }
    catch (err) {
        return { error: true, msg: "Could not connect to backend" };
    }
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

export async function getVarlist(sessionId: string, fileName: string): Promise<RawVar[] | null> {
    try {
        const res = await axios.post<TimResponse<RawVar[]>>(`${_HOST}/varlist`, {
            session_id: sessionId,
            file_name: fileName,
        });
        if (res.data.error) {
            console.log(res.data.msg);
            return null;
        }
        return res.data.data;
    }
    catch (err) {
        return null;
    }
};

export async function deleteUpload(sessionId: string, fileName: string): Promise<{ error: boolean, msg: string }> {
    try {
        const res = await axios.get(`${_HOST}/delete_upload/${sessionId}/${fileName}`);
        if (res.data.error) {
            console.log(res.data.msg);
            return { error: true, msg: res.data.msg || "No error message" };
        }
        return { error: false, msg: "" };
    }
    catch (err) {
        return { error: true, msg: "Could not connect to backend" };
    }
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

export async function getRenderedScript(structure: Structure): Promise<string | null> {
    try {
        structure.analyses.forEach((a, i) => {
            a.id = "A" + (i + 1);
        });
        const res = await axios.post<TimResponse<string>>(`${_HOST}/render_script`, structure, { responseType: 'text' });
        if (res.data.error) {
            console.log(res.data.msg);
            return null;
        }
        return res.data.data;
    }
    catch (err) {
        return null;
    }
};

export async function runAnalysis(sessionId: string, fileName: string, structure: Structure): Promise<string | null> {
    try {
        structure.analyses.forEach((a, i) => {
            a.id = "A" + (i + 1);
        });
        const analysisRequest = {
            session_id: sessionId,
            file_name: fileName,
            structure,
        };
        const res = await axios.post<TimResponse<string>>(`${_HOST}/analyze`, analysisRequest);
        if (res.data.error) {
            console.log(res.data.msg);
            return null;
        }
        return res.data.data;
    }
    catch (err) {
        return null;
    }
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

export async function getCSVFileText(sessionId: string, successOutputId: string, fileName: string): Promise<string | null> {
    try {
        const res = await axios.get(`${_HOST}/stream_file/${sessionId}/${successOutputId}/${fileName}`, { responseType: 'text' });
        return res.data;
    }
    catch (err) {
        return null;
    }
};

export async function getCSVFileArrayBuffer(sessionId: string, successOutputId: string, fileName: string): Promise<string | null> {
    try {
        const res = await axios.get(`${_HOST}/stream_file/${sessionId}/${successOutputId}/${fileName}`, { responseType: 'arraybuffer' });
        return res.data;
    }
    catch (err) {
        return null;
    }
};
