import { Button } from 'components-ui';
import React from 'react';
import { getDefaultAnalysis } from '../defaults';
import { UseDatasets } from '../hooks/use_datasets';
import { UseEditors } from '../hooks/use_editors';
import { UseStructure } from '../hooks/use_structure';

type AnalysesProps = {
    ud: UseDatasets,
    us: UseStructure,
    ue: UseEditors,
};

export const Analyses: React.FC<AnalysesProps> = (p) => {

    if (!p.ud.anyReady) {
        return <div className="p-6">No datasets uploaded. Go to "Uploads" and upload a dataset to get started.</div>;
    }

    if (p.us.structure.indicators.length === 0) {
        return <div className="p-6">No available indicators. Go to "Indicators" and create one or more indicators.</div>;
    }

    if (p.us.structure.analyses.length === 0) {
        return <div className="flex h-full w-full overflow-hidden p-6 items-center justify-center">
            <div className="h-72 text-center">
                <div className="mb-8 text-2xl text-blue-900">Create an analysis</div>
                <Button label="New analysis" onClick={() => p.ue.setAnalysisEditor(getDefaultAnalysis())} />
            </div>
        </div>
    }

    return <div className="p-6 w-full h-full overflow-y-scroll select-text">

        <div className="grid grid-cols-12 gap-4 pb-2 font-semibold select-none">
            <div className="px-2 py-1 rounded col-span-1">ID</div>
            <div className="px-2 py-1 rounded  col-span-3">Label</div>
            <div className=" px-2 py-1 rounded  col-span-1">Data type</div>
            <div className=" px-2 py-1 rounded  col-span-1">Analysis type</div>
            <div className=" px-2 py-1 rounded  col-span-4">Items</div>
            <div className=" px-2 py-1 rounded  col-span-1">Filter</div>
            <div
                className="px-2  py-1 rounded  text-right col-span-1"
            >Actions</div>
        </div>

        {p.us.structure.analyses.map(a => {
            return <div key={a.id} className="grid grid-cols-12 gap-4 mb-2 bg-blue-100 rounded">
                <div className="px-2 py-1  col-span-1">{a.id}</div>
                <div className="px-2 py-1  col-span-3">{a.label}</div>
                {a.indicatorsAreBinary && <>
                    <div className="px-2 py-1  text-purple-600 col-span-1">Binary</div>
                    <div className="px-2 py-1  text-purple-600 col-span-1">{a.binaryAnalysisType}</div>
                </>}
                {a.indicatorsAreNumber && <>
                    <div className="px-2 py-1  text-blue-600 col-span-1">Number</div>
                    <div className="px-2 py-1  text-blue-600 col-span-1">{a.numberAnalysisType}</div>
                </>}
                <div className="px-2 py-1  col-span-4">{a.itemIds.join(", ")}</div>
                <div className="px-2 py-1  col-span-1">{a.denominatorId || "All facilities"}</div>
                <div
                    className="px-2 text-right col-span-1"
                    style={{ paddingTop: "0.2rem" }}
                >
                    <Button
                        label="Edit"
                        onClick={() => p.ue.setAnalysisEditor(a)}
                        small
                    /></div>
            </div>;
        })}

    </div>;

};
