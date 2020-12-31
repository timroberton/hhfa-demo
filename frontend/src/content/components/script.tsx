import React from 'react';
import { COLOR } from 'components-ui';
import { Button, IconButton } from 'components-ui';
import { Modal, ModalErrorMessage } from 'components-ui';
import { useScript } from '../hooks/use_script';
import { UseStructure } from '../hooks/use_structure';

type ScriptProps = {
    sessionId: string,
    us: UseStructure,
    cancel: () => void,
};

export const Script: React.FC<ScriptProps> = (p) => {

    const { script, loadingScript, err } = useScript(p.us.structure, true);

    return <Modal
        cancel={p.cancel}
        loading={loadingScript}
        minWidth={1000}
    >
        <ModalErrorMessage msg={err} />
        <div className="flex ">
            <div className="flex-1 h-full w-full text-xs whitespace-pre-wrap font-mono overflow-auto select-text">
                {script}
            </div>
            <div className="flex-none ml-6 text-right">
                <Button
                    label="Done"
                    color={COLOR.BLACK}
                    onClick={p.cancel}
                />
                <div className="py-1"></div>
                <div className="flex cursor-pointer">
                    <div className=" text-center bg-blue-500 hover:bg-blue-600 rounded-l text-blue-100 px-5 py-2">R</div>
                    <div
                        className=" text-center bg-blue-400 hover:bg-blue-600 rounded-r text-white px-5 py-2"
                        onClick={() => window.alert("Coming soon")}
                    >Stata</div>
                </div>
                <div className="py-1"></div>
                <IconButton
                    name="download"
                    color={COLOR.GREEN}
                    onClick={() => window.alert("Coming soon")}
                />
            </div>
        </div>
    </Modal>;

}