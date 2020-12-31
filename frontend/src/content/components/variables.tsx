import React from 'react';
import { Button } from 'components-ui';
import { Icon } from 'components-ui';
import { getDefaultVariable } from '../defaults';
import { UseEditors } from '../hooks/use_editors';
import { UseStructure } from '../hooks/use_structure';
import { DatasetNumber, UseDatasets } from '../hooks/use_datasets';
// import { VariableEditor } from './variable_editor';

type VariablesProps = {
    us: UseStructure,
    ud: UseDatasets,
    ue: UseEditors,
};

export const Variables: React.FC<VariablesProps> = (p) => {

    return <div className="p-6">

        <div className="grid grid-cols-12 gap-4 pb-2 font-bold">
            <div className="py-1 rounded col-span-2">From variable</div>
            <div className="px-2 py-1 rounded  col-span-1 flex justify-center">
                {/* <Icon
                    name="arrow-right"
                    size={24}
                /> */}
            </div>
            <div className="py-1 rounded  col-span-2">To variable</div>
            <div className="py-1 rounded  col-span-4">Label</div>
            <div className="py-1 rounded  col-span-2">Type</div>
            <div
                className="py-1 rounded  col-span-1 cursor-pointer hover:underline"
            >Actions</div>
        </div>

        {p.us.structure.variables.map(a => {
            return <div key={a.variableName} className="grid grid-cols-12 gap-4 pb-4">
                <div className="px-2 py-1 rounded bg-red-200 col-span-2">{a.rawVarName}</div>
                <div className="px-2 py-1 rounded bg-red-200 col-span-1 flex justify-center">
                    <Icon
                        name="arrow-right"
                        size={24}
                    />
                </div>
                <div className="px-2 py-1 rounded bg-red-200 col-span-2">{a.variableName}</div>
                <div className="px-2 py-1 rounded bg-green-200 col-span-4">{a.variableLabel}</div>
                <div className="px-2 py-1 rounded bg-orange-200 col-span-2">{a.variableType}</div>
                <div
                    className="px-2 py-1 rounded bg-gray-200 col-span-1 cursor-pointer hover:underline"
                    onClick={() => p.ue.setVariableEditor(a)}
                >Edit</div>
            </div>;
        })}

        <Button
            label="New variable"
            onClick={() => p.ue.setVariableEditor(getDefaultVariable())}
        />

        {/* {p.ue.variableEditor &&
            <VariableEditor
                variableData={p.ue.variableEditor}
                createOrUpdateVariable={p.us.createOrUpdateVariable}
                deleteVariable={p.us.deleteVariable}
                cancel={p.ue.closeAllEditors}
                rawVarList={p.ud.datasets[DatasetNumber.One].rawVars}
            />
        } */}

    </div>;

}