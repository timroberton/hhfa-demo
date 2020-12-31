import { RawVar } from "../types_server";
import { Button, Modal, ModalActions } from "components-ui"

interface RawVarSelectorProps {
    set: (rawVar: RawVar) => void,
    cancel: () => void,
    rawVarList: RawVar[],
    filterFunc: (rawVar: RawVar) => boolean,
}

export const RawVarSelector: React.FC<RawVarSelectorProps> = (p) => {

    function save(rawVar: RawVar) {
        p.set(rawVar);
        p.cancel();
    }

    return <Modal
        minWidth={1200}
        cancel={p.cancel}
    >
        <div className="text-lg font-semibold">Select a variable from the dataset</div>
        <div className="mt-3 max-h-96 overflow-y-scroll rounded-md bg-gray-200 px-4 py-3">
            {p.rawVarList.filter(p.filterFunc).map(a => {
                return <div
                    key={a.variableName}
                    className="mb-2 px-3 py-1 bg-white rounded hover:bg-gray-100 cursor-pointer grid grid-cols-8"
                    onClick={() => save(a)}
                >
                    <div className="font-semibold col-span-2">{a.variableName}</div>
                    <div className=" col-span-4">{a.variableLabel}</div>
                    <div className=" col-span-1">{a.variableType}</div>
                    <div className=" col-span-1">{a.nResponseOptions}</div>
                </div>;
            })}
        </div>
        <ModalActions>
            <Button
                label="Cancel"
                onClick={p.cancel}
            />
        </ModalActions>
    </Modal>;

};
