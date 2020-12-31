import { useState } from "react";
import { deleteUpload, getVarlist } from "../actions/crud";
import { RawVar } from "../types_server";
import { copy } from "../utils";
import _DEFAULT_VARLIST from "../default_varlist.json";

export type UseDatasets = {
    refreshVarlist: (dn: DatasetNumber, fileName: string) => Promise<string>,
    deleteDataset: (dn: DatasetNumber) => void,
    //
    loading: boolean,
    deleting: DatasetDeleting,
    deletingErr: DatasetDeletingErr,
    // err: string,
    //
    datasets: Datasets,
    ready1: boolean,
    ready2: boolean,
    ready3: boolean,
    ready4: boolean,
    anyReady: boolean,
    //
    rawVars1: RawVar[],
    //
    datasetForAnalysis: string,
    fileNameForAnalysis: string,
    setDatasetForAnalysis: React.Dispatch<React.SetStateAction<string>>,
};

export function useDatasets(sessionId: string): UseDatasets {

    const [datasets, setDatasets] = useState<Datasets>(_DEFAULT_DATASETS);
    const [loading, setLoading] = useState<boolean>(false);

    const [datasetForAnalysis, setDatasetForAnalysis] = useState<string>(DatasetNumber.One);

    const [deleting, setDeleting] = useState<DatasetDeleting>(getDefaulDeleting());
    const [deletingErr, setDeletingErr] = useState<DatasetDeletingErr>(getDefaulDeletingErr());
    // const [err, setErr] = useState<string>("");

    async function refreshVarlist(dn: DatasetNumber, fileName: string): Promise<string> {
        setLoading(true);
        // setErr("");
        const rvl = await getVarlist(sessionId, fileName);
        if (!rvl) {
            // setErr("Problem parsing data file");
            setLoading(false);
            return "Problem parsing uploaded file. File may not be correct format.";
        }
        console.log(JSON.stringify(rvl))
        setDatasets(prev => {
            return {
                ...prev,
                [dn]: {
                    rawVars: rvl,
                    fileName,
                    ready: true,
                },
            };
        });
        setLoading(false);
        return "";
    }

    async function deleteDataset(dn: DatasetNumber): Promise<void> {
        const d = getDefaulDeleting();
        d[dn] = true;
        setDeleting(d);
        setDeletingErr(getDefaulDeletingErr());
        const fileName = datasets[dn].fileName;
        const { error, msg } = await deleteUpload(sessionId, fileName);

        if (error) {
            const derr = getDefaulDeletingErr();
            derr[dn] = msg;
            setDeletingErr(derr);
            setDeleting(getDefaulDeleting());
            return;
        }

        setDatasets(prev => {
            return {
                ...prev,
                [dn]: {
                    rawVars: [],
                    fileName: "",
                    ready: false,
                },
            };
        });
        setDeleting(getDefaulDeleting());
    }

    const fileNameForAnalysis = datasetForAnalysis === "UNSELECTED"
        ? ""
        : datasets[datasetForAnalysis as DatasetNumber].ready
            ? datasets[datasetForAnalysis as DatasetNumber].fileName
            : "";

    const ready1 = datasets[DatasetNumber.One].ready;
    const ready2 = datasets[DatasetNumber.Two].ready;
    const ready3 = datasets[DatasetNumber.Three].ready;
    const ready4 = datasets[DatasetNumber.Four].ready;
    const anyReady = ready1 || ready2 || ready3 || ready4;

    return {
        refreshVarlist,
        deleteDataset,
        //
        loading,
        deleting,
        deletingErr,
        // err,
        //
        datasets,
        ready1,
        ready2,
        ready3,
        ready4,
        anyReady,
        //
        rawVars1: datasets[DatasetNumber.One] ? datasets[DatasetNumber.One].rawVars : [],
        //
        datasetForAnalysis,
        fileNameForAnalysis,
        setDatasetForAnalysis,
    };

}

export type Datasets = {
    [key in DatasetNumber]: Dataset;
};

export type Dataset = {
    rawVars: RawVar[],
    fileName: string,
    ready: boolean,
};

export enum DatasetNumber {
    One = "One",
    Two = "Two",
    Three = "Three",
    Four = "Four",
}

const _DEFAULT_DATASETS: Datasets = {
    // [DatasetNumber.One]: {
    //     rawVars: _DEFAULT_VARLIST,
    //     fileName: "hfa_comb_bfa.dta",
    //     ready: true,
    // },
    [DatasetNumber.One]: {
        rawVars: [],
        fileName: "",
        ready: false,
    },
    [DatasetNumber.Two]: {
        rawVars: [],
        fileName: "",
        ready: false,
    },
    [DatasetNumber.Three]: {
        rawVars: [],
        fileName: "",
        ready: false,
    },
    [DatasetNumber.Four]: {
        rawVars: [],
        fileName: "",
        ready: false,
    },
};

export type DatasetDeleting = {
    [key: string]: boolean,
}
export type DatasetDeletingErr = {
    [key: string]: string,
}

const _DEFAULT_DELETING = {
    [DatasetNumber.One]: false,
    [DatasetNumber.Two]: false,
    [DatasetNumber.Three]: false,
    [DatasetNumber.Four]: false,
};

function getDefaulDeleting(): DatasetDeleting {
    return copy(_DEFAULT_DELETING);
}

const _DEFAULT_DELETING_ERR = {
    [DatasetNumber.One]: "",
    [DatasetNumber.Two]: "",
    [DatasetNumber.Three]: "",
    [DatasetNumber.Four]: "",
};

function getDefaulDeletingErr(): DatasetDeletingErr {
    return copy(_DEFAULT_DELETING_ERR);
}