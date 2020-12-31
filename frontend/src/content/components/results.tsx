import XLSX from "xlsx";
import React, { useEffect, useMemo, useState } from 'react';
//@ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
//@ts-ignore
import { dark as scriptStyle } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { Button, COLOR, Spinner, toNum0, toPct1 } from 'components-ui';
import { IconButton } from 'components-ui';
import { UseAnalyze } from '../hooks/use_analyze';
import { UseEditors } from '../hooks/use_editors';
import { UseStructure } from '../hooks/use_structure';
import { UseDatasets } from '../hooks/use_datasets';
import { UseResults, AnalysisResults } from '../hooks/use_results';
import { _HOST } from '../urls';
import { useScript } from "../hooks/use_script";
import { BinaryAnalysisType, ConfigDataset1, Structure } from "../types_server";
import { Analysis, _STRATIFIER_NAMES } from "../types_extra";

type ResultsProps = {
    sessionId: string,
    us: UseStructure,
    ud: UseDatasets,
    ua: UseAnalyze,
    ue: UseEditors,
    ur: UseResults,
};

export const Results: React.FC<ResultsProps> = (p) => {

    const resultsTab = p.ur.resultsTab;
    const { script, loadingScript } = useScript(p.us.structure, resultsTab === "rscript");

    const { selectedAnalysis, aid, formatterForTable } = useMemo(() => {
        const selectedAnalysis = p.us.structure.analyses.find(a => a.id === resultsTab);
        return {
            selectedAnalysis,
            aid: selectedAnalysis ? selectedAnalysis.id : undefined,
            formatterForTable: selectedAnalysis ? (selectedAnalysis.binaryAnalysisType === BinaryAnalysisType.Proportion ? toPct1 : toNum0) : toPct1,
        };
    }, [resultsTab]);

    useEffect(() => {
        if (resultsTab === "full" || resultsTab === "rscript") {
            return;
        }
        p.ur.trigger(resultsTab);
    }, [p.sessionId, p.ua.tempId, resultsTab]);

    // function scrollToSection(id: string): void {
    //     const el = window.document.getElementById(id);
    //     if (!el) {
    //         return;
    //     }
    //     el.scrollIntoView({ behavior: "smooth" });
    // }

    if (!p.ud.anyReady) {
        return <div className="p-6">No datasets uploaded. Go to "Uploads" and upload a dataset to get started.</div>;
    }

    if (p.us.structure.indicators.length === 0) {
        return <div className="p-6">No available indicators. Go to "Indicators" and create one or more indicators.</div>;
    }

    if (p.us.structure.analyses.length === 0) {
        return <div className="p-6">No available analyses. Go to "Analyses" and create one or more analyses.</div>;
    }

    if (p.ua.running) {
        return <div className="flex h-full w-full overflow-hidden p-6 items-center justify-center">
            <div className="h-72 text-center">
                <div className="mb-8 text-2xl text-blue-900">Running...</div>
                <Spinner size={16} textColorString="text-blue-700" />
            </div>
        </div>
    }

    if (p.ua.errorRunningAnalysis) {
        return <div className="p-6 text-red-700">{p.ua.errorRunningAnalysis} Try running again. If that doesn't work, you may need to refresh your browser.</div>;
    }

    if (!p.ua.everRun) {
        return <div className="flex h-full w-full overflow-hidden p-6 items-center justify-center">
            <div className="h-72 text-center">
                <div className="mb-8 text-2xl text-blue-900">Click "Run" to get results</div>
                <Button label="Run" onClick={() => p.ua.run()} color={COLOR.BLACK} />
            </div>
        </div>
    }

    if (p.ua.needsRunning) {
        // return <div className="p-6 text-lg">Your data or analysis settings have changed. Click "Run" to get results</div>
        return <div className="flex h-full w-full overflow-hidden p-6 items-center justify-center">
            <div className="h-72 text-center">
                <div className="mb-3 text-xl text-blue-900">Your data, indicators, or analyses have changed</div>
                <div className="mb-8 text-xl text-blue-900">Click "Run" to update results</div>
                <Button label="Run" onClick={() => p.ua.run()} color={COLOR.BLACK} />
            </div>
        </div>
    }

    if (!p.ua.tempId) {
        return <div className="p-6">No tempId ~ not sure why...</div>
    }

    return <div className="flex h-full w-full overflow-hidden">

        <div className="px-4 py-5 flex-none bg-gray-100 w-48 lg:w-64">
            <MenuTab label="Full report" onClick={() => p.ur.setResultsTab("full")} selected={resultsTab === "full"} />
            {p.us.structure.analyses.map((a, i) => {
                return <MenuTab key={a.id} label={`${a.id}. ${a.label}`} onClick={() => p.ur.setResultsTab(a.id)} selected={resultsTab === a.id} />
            })}
            <MenuTab label="R script" onClick={() => p.ur.setResultsTab("rscript")} selected={resultsTab === "rscript"} />
        </div>

        {resultsTab === "rscript" &&
            <div className="flex flex-col flex-1 h-full w-0 mx-auto px-6 py-6" style={{ maxWidth: 1100 }}>
                <div className="flex-none">
                    <div className="text-3xl font-bold">R script</div>
                    <div className="mt-4">
                        <a className="text-blue-500 hover:underline" href={`${_HOST}/stream_file/${p.sessionId}/${p.ua.tempId}/${"script.R"}`} target="_blank" download>Download this script</a>
                    </div>
                </div>

                <div className="w-full overflow-hidden flex-1 r-script mt-3 text-sm font-mono whitespace-pre-wrap select-text">
                    <SyntaxHighlighter style={scriptStyle} language={"r"} children={loadingScript ? "Loading..." : script} />
                </div>
                <div className="h-3 flex-none"></div>
            </div>
        }

        {resultsTab === "full" &&
            <div className="flex-1 overflow-y-auto w-0 h-full">
                <div className="mx-auto px-6 py-6 select-text" style={{ maxWidth: 1100 }}>
                    <div className="text-3xl font-bold">Full report</div>
                    <div className="mt-8 text-lg">
                        Download the full report as a PDF file:
                        </div>
                    <a className="text-blue-500 hover:underline" href={`${_HOST}/stream_file/${p.sessionId}/${p.ua.tempId}/${"final.csv"}`} target="_blank" download>report.pdf</a>
                    <div className="mt-8 text-lg">
                        Download the full report as a Word document:
                        </div>
                    <a className="text-blue-500 hover:underline" href={`${_HOST}/stream_file/${p.sessionId}/${p.ua.tempId}/${"final.csv"}`} target="_blank" download>report.docx</a>
                    <div className="mt-8 text-lg">
                        Download all of the tables in an Excel file:
                        </div>
                    <a className="text-blue-500 hover:underline" href={`${_HOST}/stream_file/${p.sessionId}/${p.ua.tempId}/${"final.csv"}`} target="_blank" download>tables.xlsx</a>
                    <div className="mt-8 text-lg">
                        Download the R script used to run the analysis:
                        </div>
                    <a className="text-blue-500 hover:underline" href={`${_HOST}/stream_file/${p.sessionId}/${p.ua.tempId}/${"script.R"}`} target="_blank" download>script.R</a>
                    <div className="mt-8 text-lg">
                        Download entire package as a zip file:
                        </div>
                    <a className="text-blue-500 hover:underline" href={`${_HOST}/stream_file/${p.sessionId}/${p.ua.tempId}/${"script.R"}`} target="_blank" download>package.zip</a>

                </div>
            </div>
        }

        {aid &&
            <div className="flex-1 overflow-y-scroll w-0 h-full">
                <div className="mx-auto px-6 py-6 select-text" style={{ maxWidth: 1100 }}>
                    {!(p.ur.resultsHolder[aid] && p.ur.resultsHolder[aid].ready)
                        ? "Loading..."
                        : <>
                            <div className="text-3xl font-bold">{aid}. {selectedAnalysis && selectedAnalysis.label}</div>
                            <FTP
                                title={`Main results table ~ all stratifiers`}
                                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                                id={aid}
                                ar={p.ur.resultsHolder[aid]}
                                c1={p.us.structure.config1}
                                fmt={formatterForTable}
                            />
                            <ImageBox
                                id={"a1"}
                                title={plotLabel(selectedAnalysis, 1)}
                                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                                sessionId={p.sessionId}
                                successOutputId={p.ua.tempId || ""}
                                fileName={`${aid}_strat1_plot.png`}
                            />
                            <ImageBox
                                id={"a1"}
                                title={plotLabel(selectedAnalysis, 2)}
                                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                                sessionId={p.sessionId}
                                successOutputId={p.ua.tempId || ""}
                                fileName={`${aid}_strat2_plot.png`}
                            />
                            <ImageBox
                                id={"a1"}
                                title={plotLabel(selectedAnalysis, 3)}
                                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                                sessionId={p.sessionId}
                                successOutputId={p.ua.tempId || ""}
                                fileName={`${aid}_strat3_plot.png`}
                            />
                            <ImageBox
                                id={"a1"}
                                title={plotLabel(selectedAnalysis, 4)}
                                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                                sessionId={p.sessionId}
                                successOutputId={p.ua.tempId || ""}
                                fileName={`${aid}_strat4_plot.png`}
                            />
                        </>}
                </div>
            </div>
        }

    </div>;

}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Full Table Presentation ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

interface TCellProps {
    text: string,
    i: number,
    nCols: number,
    fmt: (v: number) => string,
}

export const TCell: React.FC<TCellProps> = (p) => {
    if (p.i === 0) {
        return <td className={`px-2 py-1 border border-gray-300 text-left bg-gray-50`}>{p.text}</td>;
    }
    if (p.i === (p.nCols - 1)) {
        return <td className={`px-2 py-1 border border-gray-300 text-right`}>{p.text}</td>;
    }
    //@ts-ignore
    return <td className={`px-2 py-1 border border-gray-300 text-right`}>{p.fmt(p.text)}</td>;

};

type FTPProps = {
    id: string,
    ar: AnalysisResults,
    c1: ConfigDataset1,
    title: string,
    description: string,
    fmt: (v: number) => string,
}

const FTP: React.FC<FTPProps> = (p) => {

    const nCols = (p.ar.d0 && p.ar.d0.length > 0) ? p.ar.d0[0].length : 0;

    return <OutputBox
        id={p.id}
        title={p.title}
        description={p.description}
        jsDownload={() => {
            const tbl = document.getElementById('fullTableToDownload');
            const wb = XLSX.utils.table_to_book(tbl);
            XLSX.writeFile(wb, `${p.id}_table.xlsx`);
        }}
        copyToClipboard={() => {
            const tbl = document.getElementById('fullTableToDownload');
            // selectElementContents(tbl);
            // const sheet = XLSX.utils.table_to_sheet(tbl);
            // const csv = XLSX.utils.sheet_to_csv(sheet);
            if (tbl) {
                selectElementContents(tbl);
            }
            //@ts-ignore
            // csv.select();
            // document.execCommand("copy");
        }}
    >
        {!p.ar.ready
            ? "Loading..."
            : <table className="w-full" id="fullTableToDownload">
                <tbody className="">
                    {p.ar.d0.map((r, i) => <tr key={"d0" + i}>
                        {i === 0
                            ? r.map((c, j) => j === (nCols - 1)
                                ? <th className="px-2 py-1 border border-gray-300 text-right bg-gray-100" key={j}>{c}</th>
                                : <th className="px-2 py-1 border border-gray-300 text-left bg-gray-100" key={j}>{c}</th>)
                            : r.map((c, j) => <TCell key={j} text={c} i={j} nCols={nCols} fmt={p.fmt} />)
                        }
                    </tr>)}
                    {p.c1.variableStratifier1 && <>
                        <tr key={"d1"}><td className="px-2 py-1 border border-gray-300 text-left italic text-gray-500" colSpan={nCols}>{_STRATIFIER_NAMES[1]}</td></tr>
                        {p.ar.d1.slice(1).map((r, i) => <tr key={"d1-" + i}>
                            {r.map((c, j) => <TCell key={j} text={c} i={j} nCols={nCols} fmt={p.fmt} />)}
                        </tr>)}
                    </>}
                    {p.c1.variableStratifier2 && <>
                        <tr key={"d2"}><td className="px-2 py-1 border border-gray-300 text-left italic text-gray-500" colSpan={nCols}>{_STRATIFIER_NAMES[2]}</td></tr>
                        {p.ar.d2.slice(1).map((r, i) => <tr key={"d2-" + i}>
                            {r.map((c, j) => <TCell key={j} text={c} i={j} nCols={nCols} fmt={p.fmt} />)}
                        </tr>)}
                    </>}
                    {p.c1.variableStratifier3 && <>
                        <tr key={"d3"}><td className="px-2 py-1 border border-gray-300 text-left italic text-gray-500" colSpan={nCols}>{_STRATIFIER_NAMES[3]}</td></tr>
                        {p.ar.d3.slice(1).map((r, i) => <tr key={"d3-" + i}>
                            {r.map((c, j) => <TCell key={j} text={c} i={j} nCols={nCols} fmt={p.fmt} />)}
                        </tr>)}
                    </>}
                    {p.c1.variableStratifier4 && <>
                        <tr key={"d4"}><td className="px-2 py-1 border border-gray-300 text-left italic text-gray-500" colSpan={nCols}>{_STRATIFIER_NAMES[4]}</td></tr>
                        {p.ar.d4.slice(1).map((r, i) => <tr key={"d4-" + i}>
                            {r.map((c, j) => <TCell key={j} text={c} i={j} nCols={nCols} fmt={p.fmt} />)}
                        </tr>)}
                    </>}
                </tbody>
            </table>
        }

    </OutputBox>;

}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// IMAGES ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

type ImageBoxProps = {
    id: string,
    title: string,
    description: string,
    sessionId: string,
    successOutputId: string,
    fileName: string,
}

const ImageBox: React.FC<ImageBoxProps> = (p) => {

    const url = `${_HOST}/stream_file/${p.sessionId}/${p.successOutputId}/${p.fileName}`;

    return <OutputBox
        id={p.id}
        title={p.title}
        description={p.description}
        linkDownload={url}
    >
        <img src={url} />
    </OutputBox>;

}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

type OutputBoxProps = {
    id: string,
    jsDownload?: () => void,
    linkDownload?: string,
    title: string,
    description: string,
    copyToClipboard?: () => void,
}

const OutputBox: React.FC<OutputBoxProps> = (p) => {

    return <div id={p.id} className="mt-6 mb-12">
        <div className="flex">
            <div className="flex-1 w-0">
                <div className="font-bold text-xl">{p.title}</div>
                <div className="mt-3 text-gray-600 text-sm">{p.description}</div>
            </div>
            <div className="ml-4 flex-none">
                {p.copyToClipboard &&
                    <IconButton
                        name="clipboard"
                        color={COLOR.GREEN}
                        onClick={p.copyToClipboard}
                        marginRight
                    />
                }
                <IconButton
                    name="download"
                    color={COLOR.GREEN}
                    onClick={p.jsDownload}
                    href={p.linkDownload}
                    download={!!p.linkDownload}
                />
            </div>
        </div>
        <div className="mt-4">{p.children}</div>
    </div>;

}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

type MenuTabProps = {
    label: string,
    selected: boolean,
    onClick: () => void,
};

export const MenuTab: React.FC<MenuTabProps> = (p) => {
    return <div
        className={`px-2 py-1 text-base hover:bg-gray-200 cursor-pointer rounded overflow-ellipsis whitespace-nowrap overflow-hidden ${p.selected ? "text-gray-800 font-bold" : "text-gray-600"}`}
        onClick={p.onClick}
    >{p.label}</div>;
};

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function selectElementContents(el: HTMLElement) {
    var body = document.body, range;
    if (document.createRange && window.getSelection) {
        range = document.createRange();
        const sel = window.getSelection();
        if (sel) {
            sel.removeAllRanges();
        }
        try {
            range.selectNodeContents(el);
            if (sel) {
                sel.addRange(range);
            }
        } catch (e) {
            range.selectNode(el);
            if (sel) {
                sel.addRange(range);
            }
        }
        document.execCommand("copy");
        if (sel) {
            sel.removeAllRanges();
        }

        //@ts-ignore
    } else if (body.createTextRange) {
        //@ts-ignore
        range = body.createTextRange();
        range.moveToElementText(el);
        range.select();
        range.execCommand("Copy");
    }
}

function plotLabel(a: Analysis | undefined, strat: number): string {
    return `${a && a.label} ~ by ${_STRATIFIER_NAMES[strat].toLowerCase()}`;
}