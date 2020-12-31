import React, { useMemo, useState } from "react";
import { Modal, ModalActions, ModalErrorMessage } from 'components-ui';
import { Button, Checkbox, Input } from 'components-ui';
import { COLOR } from 'components-ui';
import { RawVar, Variable, RawVarResponseOption, VariableRemapping, VariableLabel } from "../types_server";
import { UseStructure } from "../hooks/use_structure";
import { getDefaultVariable } from "../defaults";
import { sortNumericByProp } from 'components-ui';
import { RawVarSelector } from "./raw_var_selector";
import { _STRATIFIER_NAMES } from "../types_extra";

type ConfigEditorProps = {
    prop: string,
    us: UseStructure,
    cancel: () => void,
    rawVarList: RawVar[],
}

type RemapTEMP = {
    fromValue: number,
    fromLabel: string,
    to: string,
    toMissing: boolean,
};

type LabelTEMP = {
    value: number,
    oldLabel: string,
    newLabel: string,
};

export const ConfigEditor: React.FC<ConfigEditorProps> = (p) => {

    const { initialRawVar, initialVariableData, initialRemapValuesTEMP, initialLabelsTEMP } = useMemo(() => {
        //@ts-ignore
        return getInitialVariableData(p.us.structure.config1[p.prop], p.rawVarList);
    }, []);

    //@ts-ignore
    const [using, setUsing] = useState<boolean>(p.us.structure.config1[p.prop] !== null);
    //
    const [tempRawVar, setTempRawVar] = useState<RawVar | undefined>(initialRawVar);
    //
    const [tempUseRemapValues, setTempUseRemapValues] = useState<boolean>(initialVariableData.useRemapValues);
    const [tempUseRemapMissing, setTempUseRemapMissing] = useState<boolean>(initialVariableData.useRemapMissing);
    const [tempRemapMissing, setTempRemapMissing] = useState<string>(serializeRemap(initialVariableData.remapMissing));
    //
    const [tempRemapValues, setTempRemapValues] = useState<RemapTEMP[]>(initialRemapValuesTEMP);
    const [tempLabels, setTempLabels] = useState<LabelTEMP[]>(initialLabelsTEMP);
    //
    const [err, setErr] = useState<string>("");
    const [openRawVarSelector, setOpenRawVarSelector] = useState<boolean>(false);

    function updateTempRawVar(newRawVar: RawVar) {
        setErr("");
        if (tempRawVar && newRawVar.variableName === tempRawVar.variableName) {
            return;
        }
        setTempRawVar(newRawVar);
        const newRemapValuesTEMP = newRawVar.responseOptions.map<RemapTEMP>(a => {
            return {
                fromValue: a.value,
                fromLabel: a.label,
                to: "",
                toMissing: false,
            };
        });
        setTempUseRemapValues(false);
        setTempUseRemapMissing(false);
        setTempRemapMissing("");
        setTempRemapValues(newRemapValuesTEMP);
        const newTempLabels = createLabelsTEMP(
            newRawVar.responseOptions, // <-- reason for update
            false,
            newRemapValuesTEMP, // <-- reason for update
            false,
            "",
            [],
        );
        setTempLabels(newTempLabels);
    }

    function toggleUseRemapValues() {
        setErr("");
        const useRemapValues = !tempUseRemapValues;
        setTempUseRemapValues(useRemapValues);
        const newTempLabels = createLabelsTEMP(
            (tempRawVar as RawVar).responseOptions,
            useRemapValues, // <-- reason for update
            tempRemapValues,
            tempUseRemapMissing,
            tempRemapMissing,
            tempLabels,
        );
        setTempLabels(newTempLabels);
    }

    function updateRemapTo(i: number, val: string): void {
        setErr("");
        const newRemapValues: RemapTEMP[] = [...tempRemapValues];
        newRemapValues[i].to = val;
        setTempRemapValues(newRemapValues);
        const newTempLabels = createLabelsTEMP(
            (tempRawVar as RawVar).responseOptions,
            tempUseRemapValues,
            newRemapValues, // <-- reason for update
            tempUseRemapMissing,
            tempRemapMissing,
            tempLabels,
        );
        setTempLabels(newTempLabels);
    }

    function updateRemapToMissing(i: number, val: boolean): void {
        setErr("");
        const newRemapValues: RemapTEMP[] = [...tempRemapValues];
        newRemapValues[i].toMissing = val;
        setTempRemapValues(newRemapValues);
        const newTempLabels = createLabelsTEMP(
            (tempRawVar as RawVar).responseOptions,
            tempUseRemapValues,
            newRemapValues, // <-- reason for update
            tempUseRemapMissing,
            tempRemapMissing,
            tempLabels,
        );
        setTempLabels(newTempLabels);
    }

    function toggleUseRemapMissing() {
        setErr("");
        const useRemapMissing = !tempUseRemapMissing;
        setTempUseRemapMissing(useRemapMissing);
        const newTempLabels = createLabelsTEMP(
            (tempRawVar as RawVar).responseOptions,
            tempUseRemapValues,
            tempRemapValues,
            useRemapMissing, // <-- reason for update
            tempRemapMissing,
            tempLabels,
        );
        setTempLabels(newTempLabels);
    }

    function updateRemapMissing(newRemapMissing: string): void {
        setErr("");
        setTempRemapMissing(newRemapMissing);
        const newTempLabels = createLabelsTEMP(
            (tempRawVar as RawVar).responseOptions,
            tempUseRemapValues,
            tempRemapValues,
            tempUseRemapMissing,
            newRemapMissing, // <-- reason for update
            tempLabels,
        );
        setTempLabels(newTempLabels);
    }

    function updateLabel(i: number, val: string): void {
        setErr("");
        setTempLabels(prev => {
            const newLabelsTEMP: LabelTEMP[] = [...prev];
            newLabelsTEMP[i].newLabel = val;
            return newLabelsTEMP;
        });
    }

    async function save() {

        if (!using) {
            const errMsg = p.us.updateVariableConfig1(p.prop, null);
            if (errMsg) {
                setErr(errMsg);
                return;
            }
            p.cancel();
            return;
        }

        if (!tempRawVar) {
            setErr("If you want to use this stratifier, you must select a variable");
            return;
        }

        // Check remap values
        if (tempUseRemapValues) {
            for (let i = 0; i < tempRemapValues.length; i++) {
                const a = tempRemapValues[i];
                if (!a.toMissing && deserializeRemap(a.to) === _NO_VALUE) {
                    setErr("You have incorrect remappings. Make sure all values map to an integer >= 0");
                    return;
                }
            }
        }

        // Check remap missing
        if (tempUseRemapMissing && deserializeRemap(tempRemapMissing) === _NO_VALUE) {
            setErr("You have incorrect missing remap. Make sure missing maps to an integer >= 0");
            return;
        }

        // Check labels exist
        for (let i = 0; i < tempLabels.length; i++) {
            if (tempLabels[i].newLabel.trim() === "") {
                setErr("You have missing labels. Make sure all values have a label");
                return;
            }
        }

        // Check labels are unique
        for (let i = 0; i < tempLabels.length; i++) {
            if (tempLabels.findIndex(b => b.newLabel.trim() === tempLabels[i].newLabel.trim()) !== i) {
                setErr("You have non-unique labels. Make sure all labels are unique");
                return;
            }
        }

        const v: Variable = {
            rawVarName: tempRawVar.variableName,
            variableName: "",
            variableLabel: "",
            variableType: "",
            useRemapValues: tempUseRemapValues,
            remapValues: tempUseRemapValues ? tempRemapValues.map<VariableRemapping>(a => {
                return {
                    from: a.fromValue,
                    to: deserializeRemap(a.to),
                    toMissing: a.toMissing,
                };
            }) : [],
            useRemapMissing: tempUseRemapMissing,
            remapMissing: tempUseRemapMissing ? deserializeRemap(tempRemapMissing) : _NO_VALUE,
            labels: tempLabels.map<VariableLabel>(a => {
                return {
                    value: a.value,
                    label: a.newLabel.trim(),
                };
            }),
        };

        const errMsg = p.us.updateVariableConfig1(p.prop, v);
        if (errMsg) {
            setErr(errMsg);
            return;
        }
        p.cancel();

    }

    return openRawVarSelector

        ? <RawVarSelector
            set={updateTempRawVar}
            rawVarList={p.rawVarList}
            cancel={() => setOpenRawVarSelector(false)}
            filterFunc={rawVar => rawVar.nResponseOptions < 30}
        />
        : <Modal
            minWidth={1200}
            cancel={p.cancel}
        >
            <div className="font-bold text-2xl">{_STRATIFIER_NAMES[Number(p.prop.slice(-1))]}</div>
            <div className="mt-2">
                <Checkbox
                    label={"Use this stratifier"}
                    checked={using}
                    onClick={() => setUsing(!using)}
                    small
                />
            </div>
            {using &&
                <div className="mt-4 flex space-x-10">

                    <div className="w-1/2">
                        <div className="bg-gray-200 px-4 py-3 rounded-md">
                            <div className="flex justify-between items-start">
                                <div className="">
                                    <div className="text-lg font-semibold pb-1 leading-none">Variable = {tempRawVar ? tempRawVar.variableName : "UNSELECTED"}</div>
                                    {tempRawVar && <>
                                        <div className="">Original label = {tempRawVar.variableLabel}</div>
                                        <div className="">Original type = {tempRawVar.variableType}</div>
                                        <div className="">Number unique response options = {tempRawVar.nResponseOptions}</div>
                                        <div className="">Number missing = {tempRawVar.nMissing}</div>
                                    </>}
                                </div>
                                <Button
                                    label={tempRawVar ? "Change" : "Select"}
                                    onClick={() => setOpenRawVarSelector(true)}
                                    medium
                                />
                            </div>
                        </div>
                        {tempRawVar && <>
                            <div className="mt-4 leading-none"></div>
                            <Checkbox
                                label={"Remap values"}
                                checked={tempUseRemapValues}
                                onClick={toggleUseRemapValues}
                                small
                                marginBottom
                            />

                            {tempUseRemapValues && <>
                                <div className="mt-3 pb-1 leading-none"></div>
                                {tempRemapValues.map((a, i) => {
                                    return <div key={a.fromValue} className="grid grid-cols-8 gap-x-4 mt-1">
                                        <div className="col-span-5 leading-tight">{a.fromValue} ({a.fromLabel}) &rarr;</div>
                                        <div className="col-span-1 h-10">
                                            {!a.toMissing &&
                                                <Input
                                                    value={a.to}
                                                    onChange={val => updateRemapTo(i, val)}
                                                />
                                            }
                                        </div>
                                        <div className="col-span-2">
                                            <Checkbox
                                                label="To missing"
                                                checked={a.toMissing}
                                                onClick={() => updateRemapToMissing(i, !a.toMissing)}
                                                small
                                            />
                                        </div>
                                    </div>
                                })}
                            </>}
                            {tempRawVar.nMissing > 0 && <>
                                <div className="mt-3 pb-1 leading-none"></div>
                                <Checkbox
                                    label={"Remap missing"}
                                    checked={tempUseRemapMissing}
                                    onClick={toggleUseRemapMissing}
                                    small
                                />
                                {tempUseRemapMissing && <>
                                    <div className="mt-3 pb-2 leading-none">Remap missing to...</div>
                                    <Input
                                        value={tempRemapMissing}
                                        onChange={updateRemapMissing}
                                    />
                                </>}
                            </>}
                        </>}
                    </div>

                    <div className="w-1/2">
                        {tempRawVar && <>
                            <div className="font-semibold mb-2 text-lg">Labels</div>
                            {tempLabels.map((a, i) => {
                                return <div key={a.value} className="flex space-x-4 mt-1">
                                    <div className="w-1/2 leading-tight">{a.value} ({a.oldLabel}) =</div>
                                    <div className="flex-1 h-10">
                                        <Input
                                            value={a.newLabel}
                                            onChange={val => updateLabel(i, val)}
                                        />
                                    </div>
                                </div>;
                            })}
                        </>}
                    </div>

                </div>
            }

            <div className="mt-4"></div>
            <ModalErrorMessage msg={err} />

            <ModalActions>
                <Button
                    label="Save"
                    onClick={save}
                    marginRight
                    color={COLOR.GREEN}
                />
                <Button
                    label="Cancel"
                    onClick={p.cancel}
                />
            </ModalActions>

        </Modal>;

}

function getInitialVariableData(v: Variable | null, rawVarList: RawVar[]): {
    initialVariableData: Variable,
    initialRawVar: RawVar | undefined,
    initialRemapValuesTEMP: RemapTEMP[],
    initialLabelsTEMP: LabelTEMP[],
} {
    let initialVariableData: Variable = !!v
        ? v
        : getDefaultVariable();

    const initialRawVar = rawVarList.find(a => a.variableName === initialVariableData.rawVarName);

    // If cannot find rawVar (because new, or because no longer available)
    if (!v || !initialRawVar) {
        return {
            initialVariableData: getDefaultVariable(),
            initialRawVar: undefined,
            initialRemapValuesTEMP: [],
            initialLabelsTEMP: [],
        };
    }

    // If can find rawVar
    const initialRemapValuesTEMP = initialRawVar.responseOptions.map<RemapTEMP>(a => {
        const existing = initialVariableData.remapValues.find(b => b.from === a.value);
        return {
            fromValue: a.value,
            fromLabel: a.label,
            to: existing ? serializeRemap(existing.to) : "",
            toMissing: existing ? existing.toMissing : false,
        };
    });

    const existingLabelsTEMP = initialVariableData.labels.map<LabelTEMP>(a => {
        return {
            value: a.value,
            newLabel: a.label,
            oldLabel: initialVariableData.useRemapValues ? "Remapped or Missing" : "TODO_GET_FROM_EXISTING",
        };
    });

    if (initialRawVar.nMissing === 0) {
        initialVariableData.useRemapMissing = false;
    }

    if (!initialVariableData.useRemapMissing) {
        initialVariableData.remapMissing = _NO_VALUE;
    }

    const initialLabelsTEMP = createLabelsTEMP(
        initialRawVar.responseOptions,
        initialVariableData.useRemapValues,
        initialRemapValuesTEMP,
        initialVariableData.useRemapMissing,
        serializeRemap(initialVariableData.remapMissing),
        existingLabelsTEMP,
    );

    return {
        initialVariableData,
        initialRawVar,
        initialRemapValuesTEMP,
        initialLabelsTEMP,
    };
}

function createLabelsTEMP(
    rawVarResponseOptions: RawVarResponseOption[],
    useRemapValues: boolean,
    remapValuesTEMP: RemapTEMP[],
    useRemapMissing: boolean,
    remapMissing: string,
    existingLabelsTEMP: LabelTEMP[],
): LabelTEMP[] {

    const newLabels: LabelTEMP[] = [];

    if (!useRemapValues) {
        newLabels.push(...rawVarResponseOptions.map<LabelTEMP>(a => {
            const existingLabel = existingLabelsTEMP.find(b => b.value === a.value);
            return {
                value: a.value,
                oldLabel: a.label,
                newLabel: existingLabel ? existingLabel.newLabel : a.label,
            };
        }));
    } else {
        newLabels.push(...remapValuesTEMP
            .filter(a => !a.toMissing)
            .filter(a => deserializeRemap(a.to) !== _NO_VALUE)
            .filter((a, i, arr) => arr.findIndex(b => b.to === a.to) === i)
            .map<LabelTEMP>(a => {
                const toVal = deserializeRemap(a.to);
                const existingLabel = existingLabelsTEMP.find(b => b.value === toVal);
                return {
                    value: toVal,
                    oldLabel: "Remapped",
                    newLabel: existingLabel ? existingLabel.newLabel : "",
                };
            }));
    }

    if (useRemapMissing) {
        const toVal = deserializeRemap(remapMissing);
        if (toVal !== _NO_VALUE && !newLabels.some(a => a.value === toVal)) {
            const existingLabel = existingLabelsTEMP.find(b => b.value === toVal);
            newLabels.push({
                value: toVal,
                oldLabel: "Missing",
                newLabel: existingLabel ? existingLabel.newLabel : "",
            });
        }
    }

    sortNumericByProp(newLabels, "value");

    return newLabels;
}

export const _NO_VALUE: number = 99999999;

function serializeRemap(v: number): string {
    if (isNaN(v) || v < 0 || v === _NO_VALUE) {
        return "";
    }
    return String(v);
}

function deserializeRemap(str: string): number {
    if (str.trim() === "") {
        return _NO_VALUE;
    }
    const toVal = Number(str.trim());
    if (isNaN(toVal) || toVal < 0 || toVal === _NO_VALUE) {
        return _NO_VALUE;
    }
    return Math.floor(toVal);
}