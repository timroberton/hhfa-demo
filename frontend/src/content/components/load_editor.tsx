import React from 'react';
import { _HOST } from '../urls';
//@ts-ignore
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { Modal, ModalActions } from 'components-ui';
import { Button } from 'components-ui';
import { UseStructure } from '../hooks/use_structure';

type LoadEditorProps = {
    us: UseStructure,
    cancel: () => void,
}

export const UNSELECTED: number = -1;

export const LoadEditor: React.FC<LoadEditorProps> = (p) => {

    function onAddFileStart(f: any) {
        const reader = new FileReader();
        reader.onload = function (evt) {
            if (evt && evt.target) {
                const s = JSON.parse(evt.target.result as string);
                p.us.loadStructure(s);
            }
            p.cancel();
        }
        reader.onerror = function (evt) {
            console.log("ere")
        }
        reader.readAsText(f.file, "UTF-8");
    }

    return <Modal
        cancel={p.cancel}
    >

        <FilePond
            key={"abc"}
            allowMultiple={false}
            allowRevert={false}
            onaddfilestart={onAddFileStart}
            //@ts-ignore
            credits={false}
        />

        <ModalActions>
            <Button
                label="Cancel"
                onClick={p.cancel}
            />
        </ModalActions>

    </Modal>;

}