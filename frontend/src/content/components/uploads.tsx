import React from 'react';
import { _HOST } from '../urls';
//@ts-ignore
import { DatasetNumber, UseDatasets } from '../hooks/use_datasets';
import { Icon2, IconButton, toNum0 } from 'components-ui';
import { UseEditors } from '../hooks/use_editors';
import { UploadsEditor } from './uploads_editor';
import { COLOR } from 'components-ui';

type UploadsProps = {
    sessionId: string,
    ud: UseDatasets,
    ue: UseEditors,
};

export const Uploads: React.FC<UploadsProps> = (p) => {

    return <div className="p-6 w-full overflow-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {[
            { dn: DatasetNumber.One, title: "Dataset 1. Facility inventory" },
            { dn: DatasetNumber.Two, title: "Dataset 2. Quality of care record review" },
            { dn: DatasetNumber.Three, title: "Dataset 3. Data verification and systems assessment (facility level)" },
            { dn: DatasetNumber.Four, title: "Dataset 4. Data verification and systems assessment (district level)" },
        ].map(a => {
            const ready = p.ud.datasets[a.dn].ready;
            return <div key={a.dn} className="col-span-1 bg-gray-100 rounded">
                <div className={`font-semibold ${ready ? "bg-green-200" : "bg-gray-200"} rounded-t px-4 py-3`}>{a.title}</div>
                <div className="flex">
                    <div className="px-4 py-3 flex-1">
                        {p.ud.deleting[a.dn]
                            ? <div className="">Deleting...</div>
                            : p.ud.deletingErr[a.dn]
                                ? <div className="text-red-600">{p.ud.deletingErr[a.dn]}</div>
                                : ready
                                    ? <div className="grid grid-cols-4 col-gap-4 row-gap-2 leading-8">
                                        <div className="col-span-2">Uploaded</div><div className="col-span-2">
                                            <Icon2
                                                name="check"
                                                color={COLOR.BLACK}
                                            />
                                        </div>
                                        <div className="col-span-2">File name</div><div className="col-span-2">{p.ud.datasets[a.dn].fileName}</div>
                                        <div className="col-span-2">Number of variables</div><div className="col-span-2">{toNum0(p.ud.datasets[a.dn].rawVars.length)}</div>
                                    </div>
                                    : <div className="text-gray-500">Not uploaded</div>
                        }
                    </div>
                    <div className="px-4 py-3 flex-none">
                        {ready
                            ? <IconButton
                                name="trash"
                                onClick={() => p.ud.deleteDataset(a.dn)}
                                color={COLOR.GRAY}
                            />
                            : <IconButton
                                name="cloud-upload"
                                onClick={() => p.ue.setUploadsEditor(a.dn)}
                                color={COLOR.GREEN}
                            />
                        }
                    </div>
                </div>
            </div>;
        })}

        {p.ue.uploadsEditor &&
            <UploadsEditor
                datasetNumber={p.ue.uploadsEditor}
                sessionId={p.sessionId}
                ud={p.ud}
                cancel={p.ue.closeAllEditors}
            />
        }

    </div>;

}