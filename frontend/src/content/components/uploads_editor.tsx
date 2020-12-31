import React, { useState } from 'react';
import { _HOST } from '../urls';
//@ts-ignore
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { Spinner } from 'components-ui';
import { Modal } from 'components-ui';
import { Button } from 'components-ui';
import { DatasetNumber, UseDatasets } from '../hooks/use_datasets';

type UploadsEditorProps = {
    datasetNumber: DatasetNumber,
    sessionId: string,
    ud: UseDatasets,
    cancel: () => void,
}

export const UNSELECTED: number = -1;

export const UploadsEditor: React.FC<UploadsEditorProps> = (p) => {

    const [uploading, setUploading] = useState<boolean>(false);
    const [err, setErr] = useState<string>("");

    async function onProcessFile(a: any, b: any) {

        if (a) {
            if (a.code === 404) {
                setErr("No matching session. Click 'End session' and reconnect");
                setUploading(false);
                return;
            }
            if (a.code === 403) {
                setErr("A file with this name has already been uploaded");
                setUploading(false);
                return;
            }
        }

        const err = await p.ud.refreshVarlist(p.datasetNumber, b.filename);

        if (err) {
            setErr(err);
            setUploading(false);
            return;
        }

        p.cancel();
    }

    return <Modal
        cancel={() => { }}
    >

        {p.datasetNumber === DatasetNumber.One
            ? <FilePond
                key={"abc"}
                allowMultiple={false}
                allowRevert={false}
                server={`${_HOST}/upload/${p.sessionId}`}
                onaddfilestart={() => setUploading(true)}
                onprocessfile={onProcessFile}
                //@ts-ignore
                credits={false}
            />
            : <div className="">In this version of the platform, you can only upload <span className="font-bold">Dataset 1. Facility inventory</span>. Future versions will allow for analysis of multiple datasets.</div>
        }
        {p.ud.loading &&
            <div className="p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center bg-purple-400 text-white text-sm px-4 py-2.5 rounded-lg">
                    <Spinner />
                    <div className="ml-4">Processing varlist...</div>
                </div>
            </div>
        }

        {err &&
            <div className="p-4 bg-red-200 text-red-800 rounded-lg">
                {err}
            </div>
        }

        {!uploading &&
            <div className="flex mt-4">
                <Button
                    label="Cancel"
                    onClick={p.cancel}
                />
            </div>
        }

    </Modal>;

}