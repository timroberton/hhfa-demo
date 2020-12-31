export const a = 1;
// import React, { useEffect, useState } from "react";
// import { Modal, ModalActions, ModalErrorMessage } from 'components-ui';
// import { Button, Checkbox, Input, Select } from 'components-ui';
// import { COLOR } from 'components-ui';
// import { RawVar, Variable, VariableLabel, VariableRemapping } from "../types_server";

// type VariableEditorProps = {
//     variableData: Variable,
//     createOrUpdateVariable: (v: Variable, originalVariableName: string) => string,
//     deleteVariable: (originalVariableName: string) => string,
//     cancel: () => void,
//     rawVarList: RawVar[],
// }

// interface VariableRemappingStrings {
//     from: number,
//     to: string,
//     to_missing: boolean,
// }

// export const UNSELECTED: number = -1;

// export const VariableEditor: React.FC<VariableEditorProps> = (p) => {

//     const originalVariableName = p.variableData.variableName;
//     const isExisting = originalVariableName !== "";

//     const [tempRawVarName, setTempRawVarName] = useState<string>(p.variableData.rawVarName);
//     const [tempName, setTempName] = useState<string>(p.variableData.variableName);
//     const [tempLabel, setTempLabel] = useState<string>(p.variableData.variableLabel);
//     const [tempUseRemapValues, setTempUseRemapValues] = useState<boolean>(p.variableData.use_remap_values);
//     const [tempUseRemapMissing, setTempUseRemapMissing] = useState<boolean>(p.variableData.use_remap_missing);
//     const [tempRemapMissing, setTempRemapMissing] = useState<string>(String(p.variableData.remap_missing));
//     const [tempRemapValues, setTempRemapValues] = useState<VariableRemappingStrings[]>(() => {
//         return p.variableData.remap_values.map<VariableRemappingStrings>(a => {
//             return {
//                 from: a.from,
//                 to: String(a.to),
//                 to_missing: a.to_missing,
//             };
//         });
//     });
//     const [tempLabels, setTempLabels] = useState<VariableLabel[]>(() => {
//         return [];
//     });
//     const [err, setErr] = useState<string>("");

//     function updateRemapTo(i: number, val: string): void {
//         setTempRemapValues(prev => {
//             const nv: VariableRemappingStrings[] = [...prev];
//             nv[i].to = val;
//             return nv;
//         });
//     }
//     function updateRemapToMissing(i: number, val: boolean): void {
//         setTempRemapValues(prev => {
//             const nv: VariableRemappingStrings[] = [...prev];
//             nv[i].to_missing = val;
//             return nv;
//         });
//     }

//     function updateTempRawVarName(newVarName: string) {
//         setTempRawVarName(newVarName);
//         const v = p.rawVarList.find(a => a.variableName === newVarName);
//         if (!v || !v.responseOptions || v.responseOptions === "[]") {
//             setTempRemapValues([]);
//             return;
//         }
//         let parsed: number[] = [];
//         try {
//             parsed = JSON.parse(v.responseOptions);
//         }
//         catch (e) {
//             setTempRemapValues([]);
//             return;
//         }
//         const newRemapVals = parsed.map<VariableRemappingStrings>(a => {
//             return {
//                 from: a,
//                 to: "",
//                 to_missing: false,
//             };
//         });
//         setTempRemapValues(newRemapVals);
//     }


//     async function save() {

//         if (!tempName.trim()) {
//             setErr("Missing name");
//             return;
//         }

//         // if (tempFrom === UNSELECTED || tempTo === UNSELECTED) {
//         //     setErr("Missing from/to layer");
//         //     return;
//         // }

//         // if (tempTo < tempFrom) {
//         //     setErr("'To column' must not be less than 'From column'");
//         //     return;
//         // }

//         const v: Variable = {
//             variableName: tempName,
//             variableLabel: tempLabel,
//             variableType: p.variableData.variableType,
//             rawVarName: tempRawVarName,
//             use_remap_missing: tempUseRemapMissing,
//             use_remap_values: tempUseRemapValues,
//             remap_missing: Number(tempRemapMissing),
//             remap_values: tempRemapValues.map<VariableRemapping>(a => {
//                 return {
//                     from: a.from,
//                     to: Number(a.to),
//                     to_missing: a.to_missing,
//                 };
//             }),
//             labels: tempLabels,
//         };

//         const errMsg = p.createOrUpdateVariable(v, originalVariableName);
//         if (errMsg) {
//             setErr(errMsg);
//             return;
//         }
//         p.cancel();

//     }

//     async function remove() {
//         // if (!window.confirm("Are you sure?")) {
//         //     return;
//         // }
//         p.deleteVariable(originalVariableName);
//         p.cancel();
//     }

//     return <Modal
//         cancel={p.cancel}
//     >

//         <div className="pb-1 leading-none">From variable name</div>
//         <Select
//             value={tempRawVarName}
//             onChange={val => updateTempRawVarName(String(val))}
//             options={[
//                 { value: "UNSELECTED", text: "Unselected" },
//                 ...p.rawVarList.map(a => ({
//                     value: a.variableName,
//                     text: `${a.variableName} (${a.variableType})`,
//                 })),
//             ]}
//         />
//         <div className="mt-3 pb-1 leading-none">To variable name</div>
//         <Input
//             value={tempName}
//             onChange={setTempName}
//         />
//         <div className="mt-3 pb-1 leading-none">Label</div>
//         <Input
//             value={tempLabel}
//             onChange={setTempLabel}
//         />

//         <div className="mt-3 pb-1 leading-none"></div>
//         <Checkbox
//             label={"Remap values"}
//             checked={tempUseRemapValues}
//             onClick={() => setTempUseRemapValues(!tempUseRemapValues)}
//             small
//         />
//         {tempUseRemapValues && <>
//             {tempRemapValues.map((a, i) => {
//                 return <div key={a.from} className="grid grid-cols-3 gap-x-4">
//                     <div className="">{a.from} &rarr;</div>
//                     <div className="">
//                         {!a.to_missing &&
//                             <Input
//                                 value={String(a.to)}
//                                 onChange={val => updateRemapTo(i, String(val))}
//                             />
//                         }
//                     </div>
//                     <div className="">
//                         <Checkbox
//                             label="To missing"
//                             checked={a.to_missing}
//                             onClick={() => updateRemapToMissing(i, !a.to_missing)}
//                             small
//                         />
//                     </div>
//                 </div>
//             })}

//         </>}

//         <div className="mt-3 pb-1 leading-none"></div>
//         <Checkbox
//             label={"Remap missing"}
//             checked={tempUseRemapMissing}
//             onClick={() => setTempUseRemapMissing(!tempUseRemapMissing)}
//             small
//         />
//         {tempUseRemapMissing && <>
//             <div className="mt-3 pb-1 leading-none">Remap missing to...</div>
//             <Input
//                 value={tempRemapMissing}
//                 onChange={setTempRemapMissing}
//             />
//         </>}


//         {/* <div className="mt-3 pb-1 leading-none">Type</div>
//         <Select
//             value={tempFrom}
//             onChange={val => setTempFrom(Number(val))}
//             options={[-1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(a => ({ value: a, text: a === -1 ? "Unselected" : a.toString() }))}
//         /> */}

//         <ModalErrorMessage msg={err} />

//         <ModalActions>
//             <Button
//                 label="Save"
//                 onClick={save}
//                 marginRight
//                 color={COLOR.GREEN}
//             />
//             {isExisting &&
//                 <Button
//                     label="Delete"
//                     onClick={remove}
//                     marginRight
//                 />
//             }
//             <Button
//                 label="Cancel"
//                 onClick={p.cancel}
//             />
//         </ModalActions>

//     </Modal>;

// }