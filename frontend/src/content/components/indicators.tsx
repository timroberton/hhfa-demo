import React from 'react';
import { Button, COLOR, Icon2 } from 'components-ui';
import { getDefaultIndicator } from '../defaults';
import { UseEditors } from '../hooks/use_editors';
import { UseStructure } from '../hooks/use_structure';
import { UseDatasets } from '../hooks/use_datasets';

type IndicatorsProps = {
    us: UseStructure,
    ue: UseEditors,
    ud: UseDatasets,
};

export const Indicators: React.FC<IndicatorsProps> = (p) => {

    if (!p.ud.anyReady) {
        return <div className="p-6">No datasets uploaded. Go to "Uploads" and upload a dataset to get started.</div>;
    }

    if (p.us.structure.indicators.length === 0) {
        return <div className="flex h-full w-full overflow-hidden p-6 items-center justify-center">
            <div className="h-72 text-center">
                <div className="mb-8 text-2xl text-blue-900">Create an indicator</div>
                <Button label="New indicator" onClick={() => p.ue.setIndicatorEditor(getDefaultIndicator())} />
            </div>
        </div>
    }

    return <div className="p-6 w-full h-full overflow-y-scroll select-text">

        <div className="grid grid-cols-12 gap-4 pb-2 font-semibold select-none">
            <div className="px-2 py-1 rounded  col-span-1">ID</div>
            <div className="px-2 py-1 rounded  col-span-3">Label</div>
            <div className="px-2 py-1 rounded  col-span-1">Data type</div>
            <div className="px-2 py-1 rounded  col-span-3">Expression</div>
            <div className="px-2 py-1 rounded  col-span-3">Status</div>
            <div
                className=" px-2 py-1 rounded col-span-1 text-right"
            >Actions</div>
        </div>

        {p.us.structure.indicators.map(a => {
            return <div key={a.id} className="grid grid-cols-12 gap-4 mb-2 rounded bg-blue-100">
                <div className="px-2 py-1   col-span-1">{a.id}</div>
                <div className="px-2 py-1  col-span-3">{a.label}</div>
                {a.isBinary &&
                    <div className="px-2 py-1  text-purple-600 col-span-1">Binary</div>
                }
                {a.isNumber &&
                    <div className="px-2 py-1  text-blue-600 col-span-1">Number</div>
                }
                <div className="pl-2 py-1  col-span-3">{a.condition}</div>
                {a.err
                    ? <div className={`flex space-x-2 px-2 py-1 col-span-3 text-red-600`}>
                        <Icon2
                            name="ban"
                            color={COLOR.RED}
                        />
                        <div className="">

                            {a.msg || "Error"}
                        </div>
                    </div>
                    : <div className={`flex space-x-2 px-2 py-1 col-span-3 text-green-600`}>
                        <Icon2
                            name="check"
                            color={COLOR.GREEN}
                        />
                        <div className="">Ok</div></div>
                }
                <div
                    className="text-right px-2 col-span-1 "
                    style={{ paddingTop: "0.2rem" }}
                >
                    <Button
                        label="Edit"
                        onClick={() => p.ue.setIndicatorEditor(a)}
                        small
                    />
                </div>
            </div>;
        })}

    </div>;

}