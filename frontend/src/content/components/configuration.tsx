import React, { useMemo } from 'react';
import { Button, Checkbox } from 'components-ui';
import { UseEditors } from '../hooks/use_editors';
import { UseStructure } from '../hooks/use_structure';
import { DatasetNumber, UseDatasets } from '../hooks/use_datasets';
import { ConfigEditor } from './config_editor';
import { Variable } from '../types_server';
import { _STRATIFIER_NAMES } from '../types_extra';

type ConfigurationProps = {
    us: UseStructure,
    ue: UseEditors,
    ud: UseDatasets,
};

export const Configuration: React.FC<ConfigurationProps> = (p) => {

    function scrollToSection(id: string): void {
        const el = window.document.getElementById(id);
        if (!el) {
            return;
        }
        el.scrollIntoView({ behavior: "smooth" });
    }

    const rawVarsOptions = useMemo(() => [
        { value: "UNSELECTED", text: "Unselected" },
        ...p.ud.rawVars1.map(a => ({
            value: a.variableName,
            text: `${a.variableName} (${a.variableType})`,
        })),
    ], [p.ud.rawVars1]);

    if (!p.ud.anyReady) {
        return <div className="p-6">No datasets uploaded. Go to "Uploads" and upload a dataset to get started.</div>;
    }

    return <div className="flex h-full w-full overflow-hidden">

        <div className="p-6 flex-none bg-gray-100">
            <div
                className={`mb-2 text-sm ${p.ud.ready1 ? "text-gray-600 hover:underline cursor-pointer" : "text-gray-400"}`}
                onClick={p.ud.ready1 ? () => scrollToSection("Dataset1") : undefined}
            >Dataset 1</div>
            <div
                className={`mb-2 text-sm ${p.ud.ready2 ? "text-gray-600 hover:underline cursor-pointer" : "text-gray-400"}`}
                onClick={p.ud.ready2 ? () => scrollToSection("Dataset2") : undefined}
            >Dataset 2</div>
            <div
                className={`mb-2 text-sm ${p.ud.ready3 ? "text-gray-600 hover:underline cursor-pointer" : "text-gray-400"}`}
                onClick={p.ud.ready3 ? () => scrollToSection("Dataset3") : undefined}
            >Dataset 3</div>
            <div
                className={`mb-2 text-sm ${p.ud.ready4 ? "text-gray-600 hover:underline cursor-pointer" : "text-gray-400"}`}
                onClick={p.ud.ready4 ? () => scrollToSection("Dataset4") : undefined}
            >Dataset 4</div>

        </div>

        <div className="flex-1 overflow-auto w-0 h-full">
            <div className="mx-auto px-6 pb-6 select-text" style={{ maxWidth: 1100 }}>

                <DatasetBox
                    id="Dataset1"
                    title="Dataset 1. Facility inventory"
                    isReady={p.ud.ready1}
                >
                    <ConfigBox title="Modules and questionnaires">
                        <div className="grid grid-cols-2 col-gap-6 row-gap-8">
                            <div className="col-span-1">
                                <Checkbox
                                    label="Service availability"
                                    checked={p.us.structure.config1.useModule1}
                                    onClick={() => p.us.updateC1("useModule1", !p.us.structure.config1.useModule1)}
                                    small
                                />
                                <div className={`mt-2 ml-6 ${(p.us.structure.config1.useModule1) ? "" : "opacity-25"}`}>
                                    <Checkbox
                                        label="Core"
                                        checked={p.us.structure.config1.useModule1 && !p.us.structure.config1.useModule1CoreAdditional}
                                        onClick={() => p.us.updateC1("useModule1CoreAdditional", false)}
                                        small
                                        radio
                                        marginBottom
                                    />
                                    <Checkbox
                                        label="Core + additional"
                                        checked={p.us.structure.config1.useModule1 && p.us.structure.config1.useModule1CoreAdditional}
                                        onClick={() => p.us.updateC1("useModule1CoreAdditional", true)}
                                        small
                                        radio
                                        marginBottom
                                    />
                                    <Checkbox
                                        label="Building infrastructure [supplementary]"
                                        checked={p.us.structure.config1.useModule1 && p.us.structure.config1.useModule1Supplementary}
                                        onClick={() => p.us.updateC1("useModule1Supplementary", !p.us.structure.config1.useModule1Supplementary)}
                                        small
                                    />
                                </div>
                                <div className="py-4"></div>
                                <Checkbox
                                    label="Service readiness"
                                    checked={p.us.structure.config1.useModule2}
                                    onClick={() => p.us.updateC1("useModule2", !p.us.structure.config1.useModule2)}
                                    small
                                />
                                <div className={`mt-2 ml-6 ${(p.us.structure.config1.useModule2) ? "" : "opacity-25"}`}>
                                    <Checkbox
                                        label="Core"
                                        checked={p.us.structure.config1.useModule2}
                                        small
                                        radio
                                    />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <Checkbox
                                    label="Quality of care and safety"
                                    checked={p.us.structure.config1.useModule3}
                                    onClick={() => p.us.updateC1("useModule3", !p.us.structure.config1.useModule3)}
                                    small
                                />
                                <div className={`mt-2 ml-6 ${(p.us.structure.config1.useModule3) ? "" : "opacity-25"}`}>
                                    <Checkbox
                                        label="Core"
                                        checked={p.us.structure.config1.useModule3}
                                        small
                                        radio
                                    />
                                </div>
                                <div className="py-4"></div>
                                <Checkbox
                                    label="Management and finance"
                                    checked={p.us.structure.config1.useModule4}
                                    onClick={() => p.us.updateC1("useModule4", !p.us.structure.config1.useModule4)}
                                    small
                                />
                                <div className={`mt-2 ml-6 ${(p.us.structure.config1.useModule4) ? "" : "opacity-25"}`}>
                                    <Checkbox
                                        label="Core"
                                        checked={p.us.structure.config1.useModule4 && !p.us.structure.config1.useModule4CoreAdditional}
                                        onClick={() => p.us.updateC1("useModule4CoreAdditional", false)}
                                        small
                                        radio
                                        marginBottom
                                    />
                                    <Checkbox
                                        label="Core + additional"
                                        checked={p.us.structure.config1.useModule4 && p.us.structure.config1.useModule4CoreAdditional}
                                        onClick={() => p.us.updateC1("useModule4CoreAdditional", true)}
                                        small
                                        radio
                                    />
                                </div>
                            </div>
                        </div>
                    </ConfigBox>

                    <ConfigBox title="Stratifiers">
                        <ConfigVariableBox
                            label={_STRATIFIER_NAMES[1]}
                            variable={p.us.structure.config1.variableStratifier1}
                            edit={() => p.ue.setConfigEditor("variableStratifier1")}
                        />
                        <ConfigVariableBox
                            label={_STRATIFIER_NAMES[2]}
                            variable={p.us.structure.config1.variableStratifier2}
                            edit={() => p.ue.setConfigEditor("variableStratifier2")}
                        />
                        <ConfigVariableBox
                            label={_STRATIFIER_NAMES[3]}
                            variable={p.us.structure.config1.variableStratifier3}
                            edit={() => p.ue.setConfigEditor("variableStratifier3")}
                        />
                        <ConfigVariableBox
                            label={_STRATIFIER_NAMES[4]}
                            variable={p.us.structure.config1.variableStratifier4}
                            edit={() => p.ue.setConfigEditor("variableStratifier4")}
                        />
                    </ConfigBox>

                    <ConfigBox title="Survey design">
                        <ConfigVariableBox
                            label="Sampling weights"
                            variable={p.us.structure.config1.variableSurveyDesign1}
                            // edit={() => p.ue.setConfigEditor("variableSurveyDesign1")}
                            edit={() => window.alert("Coming soon")}
                        />
                        <ConfigVariableBox
                            label="Sampling strata"
                            variable={p.us.structure.config1.variableSurveyDesign2}
                            // edit={() => p.ue.setConfigEditor("variableSurveyDesign2")}
                            edit={() => window.alert("Coming soon")}
                        />
                        <ConfigVariableBox
                            label="Filter non-consented"
                            variable={p.us.structure.config1.variableSurveyDesign3}
                            // edit={() => p.ue.setConfigEditor("variableSurveyDesign3")}
                            edit={() => window.alert("Coming soon")}
                        />
                        <ConfigVariableBox
                            label="Filter non-functional facilities"
                            variable={p.us.structure.config1.variableSurveyDesign4}
                            // edit={() => p.ue.setConfigEditor("variableSurveyDesign4")}
                            edit={() => window.alert("Coming soon")}
                        />
                    </ConfigBox>

                </DatasetBox>


                <DatasetBox
                    id="Dataset2"
                    title="Dataset 2. Quality of care record review"
                    isReady={p.ud.ready2}
                >
                    <ConfigBox title="Modules and questionnaires">
                    </ConfigBox>
                    <ConfigBox title="Survey design">
                    </ConfigBox>
                    <ConfigBox title="Stratifiers">
                    </ConfigBox>
                </DatasetBox>


                <DatasetBox
                    id="Dataset3"
                    title="Dataset 3. Data verification and systems assessment (facility level)"
                    isReady={p.ud.ready3}
                >
                    <ConfigBox title="Modules and questionnaires">
                    </ConfigBox>
                    <ConfigBox title="Survey design">
                    </ConfigBox>
                    <ConfigBox title="Stratifiers">
                    </ConfigBox>
                </DatasetBox>


                <DatasetBox
                    id="Dataset4"
                    title="Dataset 4. Data verification and systems assessment (district level)"
                    isReady={p.ud.ready4}
                >
                    <ConfigBox title="Modules and questionnaires">
                    </ConfigBox>
                    <ConfigBox title="Survey design">
                    </ConfigBox>
                    <ConfigBox title="Stratifiers">
                    </ConfigBox>
                </DatasetBox>


            </div>
        </div>

        {p.ue.configEditor &&
            <ConfigEditor
                prop={p.ue.configEditor}
                us={p.us}
                cancel={p.ue.closeAllEditors}
                rawVarList={p.ud.rawVars1}
            />
        }

    </div>;
}

type ConfigBoxProps = {
    title: string,
};

const ConfigBox: React.FC<ConfigBoxProps> = (p) => {
    return <div className="col-span-1 bg-gray-100 rounded">
        <div className="px-4 py-3 flex font-semibold bg-gray-200 rounded-t">{p.title}</div>
        <div className="px-4 py-5">
            {p.children}
        </div>
    </div>;
}

type DatasetBoxProps = {
    id: string,
    title: string,
    isReady: boolean,
};

const DatasetBox: React.FC<DatasetBoxProps> = (p) => {
    if (!p.isReady) {
        return null;
    }
    return <div id={p.id} className="pt-6 pb-4">
        <div className="font-bold text-xl leading-none">{p.title}</div>
        <div className="mt-5 w-full grid grid-cols-1 gap-6">
            {p.isReady
                ? p.children
                : <div className="text-gray-400">Not uploaded</div>
            }
        </div>
    </div>;
}

type ConfigVariableBoxProps = {
    label: string,
    variable: Variable | null,
    edit: () => void,
}

const ConfigVariableBox: React.FC<ConfigVariableBoxProps> = (p) => {
    return <div className="flex space-x-4 mb-2">
        <div className="flex-none w-1/3">{p.label}</div>
        <div className={`flex-1 px-4 py-2 rounded ${p.variable ? "bg-green-200" : "bg-gray-200"}`}>
            {!p.variable
                ? <div className="">Not using</div>
                : <>
                    Using: {p.variable.rawVarName}
                    {p.variable.useRemapValues && ", remapping values"}
                    {p.variable.useRemapMissing && ", remapping missing"}
                </>
            }
        </div>
        <div className="flex-none">
            <Button
                label="Edit"
                onClick={p.edit}
                small
            />
        </div>
    </div>;
}