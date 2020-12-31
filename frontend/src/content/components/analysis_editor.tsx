import React, { useMemo, useState } from "react";
import { Modal, ModalActions, ModalErrorMessage } from 'components-ui';
import { Button, Checkbox, IconButton, Input, Select } from 'components-ui';
import { COLOR } from 'components-ui';
import { Analysis, _ANALYSIS_TYPE_OPTIONS, _BINARY_ANALYSIS_TYPE_OPTIONS, _NUMBER_ANALYSIS_TYPE_OPTIONS } from "../types_extra";
import { AnalysisType, BinaryAnalysisType, NumberAnalysisType } from "../types_server";
import { copy } from "../utils";
import { UseStructure } from "../hooks/use_structure";
import { UseEditors } from "../hooks/use_editors";

type AnalysisEditorProps = {
    analysisData: Analysis,
    us: UseStructure,
    ue: UseEditors,
}

export const UNSELECTED: string = "UNSELECTED";

export const AnalysisEditor: React.FC<AnalysisEditorProps> = (p) => {

    const originalAnalysisId = p.analysisData.id;
    const isExisting = originalAnalysisId !== "";

    const [tempId, setTempId] = useState<string>(p.analysisData.id);
    const [tempAnalysisType, setTempAnalysisType] = useState<AnalysisType | string>(p.analysisData.analysisType);
    const [tempBinaryAnalysisType, setTempBinaryAnalysisType] = useState<BinaryAnalysisType | string>(p.analysisData.binaryAnalysisType);
    const [tempNumberAnalysisType, setTempNumberAnalysisType] = useState<NumberAnalysisType | string>(p.analysisData.numberAnalysisType);
    const [tempLabel, setTempLabel] = useState<string>(p.analysisData.label);
    const [tempItemIds, setTempItemIds] = useState<string[]>(p.analysisData.itemIds);

    const [tempIndicatorsAreBinary, setTempIndicatorsAreBinary] = useState<boolean>(p.analysisData.indicatorsAreBinary);
    const [tempUseDenominator, setTempUseDenominator] = useState<boolean>(!!p.analysisData.denominatorId);
    const [tempDenominatorId, setTempDenominatorId] = useState<string>(p.analysisData.denominatorId || UNSELECTED);

    const [err, setErr] = useState<string>("");

    const indVarListingBinary = useMemo(() => {
        return p.us.structure.indicators
            .filter(a => a.isBinary)
            .map(a => a.id);
    }, []);

    const indVarListingNumber = useMemo(() => {
        return p.us.structure.indicators
            .filter(a => a.isNumber)
            .map(a => a.id);
    }, []);

    const indVarListingForItems = tempIndicatorsAreBinary
        ? indVarListingBinary
        : indVarListingNumber;

    function updateIndicatorsAreBinary(indsAreBinary: boolean) {
        if (indsAreBinary === tempIndicatorsAreBinary) {
            return;
        }
        setTempItemIds([]);
        setTempIndicatorsAreBinary(indsAreBinary);
    }

    function addItem() {
        setTempItemIds(prev => {
            const newItemIds = copy(prev);
            newItemIds.push(UNSELECTED);
            return newItemIds;
        });
    }
    function updateItem(i: number, newId: string) {
        setTempItemIds(prev => {
            const newItemIds = copy(prev);
            newItemIds[i] = newId;
            return newItemIds;
        });
    }
    function deleteItem(i: number) {
        setTempItemIds(prev => {
            const newItemIds = copy(prev);
            newItemIds.splice(i, 1);
            return newItemIds;
        });
    }

    async function save() {

        if (!tempId.trim()) {
            setErr("You must enter an ID");
            return;
        }

        if (!tempLabel.trim()) {
            setErr("You must enter a label");
            return;
        }

        if (tempAnalysisType === UNSELECTED) {
            setErr("You must select an analysis type");
            return;
        }

        if (tempItemIds.length === 0) {
            setErr("You must add at least one item");
            return;
        }

        if (tempItemIds.includes(UNSELECTED)) {
            setErr("Cannot have unselected items");
            return;
        }

        if (tempUseDenominator && tempDenominatorId === UNSELECTED) {
            setErr('You must select a filter or check "All facilities"');
            return;
        }

        if (tempUseDenominator && tempItemIds.includes(tempDenominatorId)) {
            setErr("Cannot use a filter variable which is the same as an item variable");
            return;
        }

        // if (!tempIndicatorsAreBinary) {
        //     setErr('Currently you can only analyze "number data type" indicators');
        //     return;
        // }

        const v: Analysis = {
            id: tempId.trim(),
            analysisType: tempAnalysisType as AnalysisType,
            binaryAnalysisType: tempBinaryAnalysisType as BinaryAnalysisType,
            numberAnalysisType: tempNumberAnalysisType as NumberAnalysisType,
            label: tempLabel.trim(),
            itemIds: tempItemIds,
            denominatorId: tempUseDenominator ? tempDenominatorId : null,
            indicatorsAreBinary: tempIndicatorsAreBinary,
            indicatorsAreNumber: !tempIndicatorsAreBinary,
        };

        const errMsg = p.us.createOrUpdateAnalysis(v, originalAnalysisId);
        if (errMsg) {
            setErr(errMsg);
            return;
        }
        p.ue.closeAllEditors();

    }

    async function remove() {
        const errMsg = p.us.deleteAnalysis(originalAnalysisId);
        if (errMsg) {
            setErr(errMsg);
            return;
        }
        p.ue.closeAllEditors();
    }

    return <Modal
        cancel={p.ue.closeAllEditors}
        minWidth={800}
    >
        <div className="flex">

            <div className="w-1/2 mr-6">

                <div className="pb-1 leading-none">ID</div>
                <Input
                    value={tempId}
                    onChange={setTempId}
                />
                <div className="mt-4 pb-1 leading-none">Label</div>
                <Input
                    value={tempLabel}
                    onChange={setTempLabel}
                />
                {/* <div className="mt-3 pb-1 leading-none">Analysis type</div>
                <Select
                    value={tempAnalysisType}
                    onChange={val => setTempAnalysisType(val as AnalysisType)}
                    options={_ANALYSIS_TYPE_OPTIONS}
                /> */}
                <div className="mt-4 pb-2 leading-none">Data type of indicators</div>
                <Checkbox
                    label="Binary"
                    checked={tempIndicatorsAreBinary}
                    onClick={() => updateIndicatorsAreBinary(true)}
                    small
                    marginBottom
                    radio
                />
                <Checkbox
                    label="Number"
                    checked={!tempIndicatorsAreBinary}
                    onClick={() => updateIndicatorsAreBinary(false)}
                    small
                    radio
                />
                {tempIndicatorsAreBinary
                    ? <>
                        <div className="mt-4 pb-1 leading-none">Analysis type (for binary data type indicators)</div>
                        <Select
                            value={tempBinaryAnalysisType}
                            onChange={val => setTempBinaryAnalysisType(val as BinaryAnalysisType)}
                            options={_BINARY_ANALYSIS_TYPE_OPTIONS}
                        />
                    </>
                    : <>
                        <div className="mt-4 pb-1 leading-none">Analysis type (for number data type indicators)</div>
                        <Select
                            value={tempNumberAnalysisType}
                            onChange={val => setTempNumberAnalysisType(val as NumberAnalysisType)}
                            options={_NUMBER_ANALYSIS_TYPE_OPTIONS}
                        />
                    </>
                }
                {/* <div className="mt-4 pb-2 leading-none">Stratifiers</div>
                <Checkbox
                    label="Administration level"
                    checked={true}
                    small
                    marginBottom
                />
                <Checkbox
                    label="Urban/rural"
                    checked={true}
                    small
                    marginBottom
                />
                <Checkbox
                    label="Facility type"
                    checked={true}
                    small
                    marginBottom
                />
                <Checkbox
                    label="Managing authority (public/private)"
                    checked={true}
                    small
                    marginBottom
                /> */}
            </div>

            <div className="w-1/2">
                <div className="pb-1 leading-none">Items</div>
                {tempItemIds.map((id, i) => {
                    return <div key={i} className="flex">
                        <div className="flex-1 mb-2">
                            <Select
                                value={id}
                                onChange={val => updateItem(i, String(val))}
                                options={[
                                    { value: UNSELECTED, text: "Unselected" },
                                    ...indVarListingForItems.map(a => ({
                                        value: a,
                                        text: `${a}`,
                                    })),
                                ]}
                            />
                        </div>
                        <div className="flex-none ml-2">
                            <IconButton
                                name="minus-sm"
                                onClick={() => deleteItem(i)}
                                small
                                color={COLOR.RED}
                            />
                        </div>
                    </div>;
                })}
                <IconButton
                    name="plus-sm"
                    onClick={addItem}
                    small
                    color={COLOR.GREEN}
                />

                <div className="mt-3 pb-2 leading-none">Filter</div>
                <Checkbox
                    label="All facilities"
                    checked={!tempUseDenominator}
                    onClick={() => setTempUseDenominator(!tempUseDenominator)}
                    small
                    marginBottom
                />
                {tempUseDenominator && <>
                    <div className="mt-3 pb-2 leading-none">Binary indicator to use as filter</div>
                    <Select
                        value={tempDenominatorId}
                        onChange={val => setTempDenominatorId(String(val))}
                        options={[
                            { value: UNSELECTED, text: "Unselected" },
                            ...indVarListingBinary.map(a => ({
                                value: a,
                                text: `${a}`,
                            })),
                        ]}
                    />
                </>}
            </div>

        </div>

        <ModalErrorMessage msg={err} />

        <ModalActions>
            <Button
                label="Save"
                onClick={save}
                marginRight
                color={COLOR.GREEN}
            />
            {isExisting &&
                <Button
                    label="Delete"
                    onClick={remove}
                    marginRight
                />
            }
            <Button
                label="Cancel"
                onClick={p.ue.closeAllEditors}
            />
        </ModalActions>

    </Modal>;

};
