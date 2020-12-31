import React, { useState } from "react";
import { Modal, Button, Input, COLOR, ModalActions, ModalErrorMessage, Checkbox } from 'components-ui';
import { Indicator, RawVar } from "../types_server";
import { getTokensBinary, checkAndUpdateIndicator } from "../validate_indicators";
import { _NO_VALUE } from "./config_editor";

type IndicatorEditorProps = {
    indicatorData: Indicator,
    createOrUpdateIndicator: (v: Indicator, originalIndicatorName: string) => string,
    deleteIndicator: (originalIndicatorName: string) => string,
    cancel: () => void,
    rawVarList: RawVar[],
}

export const IndicatorEditor: React.FC<IndicatorEditorProps> = (p) => {

    const originalIndicatorName = p.indicatorData.id;
    const isExisting = originalIndicatorName !== "";

    const [tempName, setTempName] = useState<string>(p.indicatorData.id);
    const [tempLabel, setTempLabel] = useState<string>(p.indicatorData.label);
    const [tempCondition, setTempCondition] = useState<string>(p.indicatorData.condition);

    const [tempIsBinary, setTempIsBinary] = useState<boolean>(p.indicatorData.isBinary);

    const [tempUseRemapMissing, setTempUseRemapMissing] = useState<boolean>(p.indicatorData.useRemapMissing);
    const [tempRemapMissingToZero, setTempRemapMissingToZero] = useState<boolean>(p.indicatorData.remapMissing === 0);

    const [err, setErr] = useState<string>("");

    const tokens = getTokensBinary(tempCondition);

    async function save() {

        if (!tempName.trim()) {
            setErr("You must enter an ID");
            return;
        }
        if (!tempLabel.trim()) {
            setErr("You must enter a label");
            return;
        }
        if (!tempCondition.trim()) {
            setErr("You must enter an expression");
            return;
        }

        const v: Indicator = {
            id: tempName.trim(),
            label: tempLabel.trim(),
            condition: tempCondition.trim(),
            isBinary: tempIsBinary,
            isNumber: !tempIsBinary,
            useRemapMissing: tempUseRemapMissing,
            remapMissing: tempUseRemapMissing ? (tempRemapMissingToZero ? 0 : 1) : _NO_VALUE,
            err: false,
            msg: "",
        };

        checkAndUpdateIndicator(v, p.rawVarList);

        if (v.err) {
            setErr(v.msg);
            return;
        }

        const errMsg = p.createOrUpdateIndicator(v, originalIndicatorName);
        if (errMsg) {
            setErr(errMsg);
            return;
        }
        p.cancel();

    }

    async function remove() {
        const errMsg = p.deleteIndicator(originalIndicatorName);
        if (errMsg) {
            setErr(errMsg);
            return;
        }
        p.cancel();
    }

    return <Modal
        cancel={p.cancel}
    >

        <div className="pb-1 leading-none">ID ~ should start with ind_</div>
        <Input
            value={tempName}
            onChange={setTempName}
        />
        <div className="mt-4 pb-1 leading-none">Label</div>
        <Input
            value={tempLabel}
            onChange={setTempLabel}
        />
        <div className="mt-4 pb-2 leading-none">Data type to create</div>
        <Checkbox
            label="Binary (each observation/facility is assigned either 0 or 1)"
            checked={tempIsBinary}
            onClick={() => setTempIsBinary(true)}
            small
            radio
            marginBottom
        />
        <Checkbox
            label="Number (each observation/facility is assigned  a number)"
            checked={!tempIsBinary}
            onClick={() => setTempIsBinary(false)}
            small
            radio
        />
        <div className="mt-4 pb-1 leading-none">
            <span>Expression</span>
            {tempIsBinary
                ? <span> ~ must resolve to a BOOLEAN (true or false)</span>
                : <span> ~ must resolve to a NUMBER (usually greater than or equal to 0)</span>
            }
        </div>
        <Input
            value={tempCondition}
            onChange={setTempCondition}
        />
        {tokens.length > 0 && <>
            <div className="mt-4 pb-1 leading-none italic">Variables identified</div>
            <div className="bg-gray-200 rounded-md pb-2 pr-2 text-sm">
                {tokens.map(a => {
                    return <span key={a.id} className={`mt-2 ml-2 px-2 py-1 inline-block rounded-md ${a.err ? "bg-red-300" : "bg-green-300"}`}>{a.text}</span>
                })}
            </div>
        </>}
        <div className="mt-4 pb-2 leading-none">If any of the required variables are missing...</div>
        <Checkbox
            label="Set this indicator to missing"
            checked={!tempUseRemapMissing}
            onClick={() => {
                setTempUseRemapMissing(false);
            }}
            small
            radio
            marginBottom
        />
        <Checkbox
            label="Set this indicator to 0"
            checked={tempUseRemapMissing && tempRemapMissingToZero}
            onClick={() => {
                setTempUseRemapMissing(true);
                setTempRemapMissingToZero(true);
            }}
            small
            radio
            marginBottom
        />
        <Checkbox
            label="Set this indicator to 1"
            checked={tempUseRemapMissing && !tempRemapMissingToZero}
            onClick={() => {
                setTempUseRemapMissing(true);
                setTempRemapMissingToZero(false);
            }}
            small
            radio
        />

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
                onClick={p.cancel}
            />
        </ModalActions>

    </Modal>;

};
