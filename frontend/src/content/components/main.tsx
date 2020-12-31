import React, { useState } from 'react';
import { useStructure } from '../hooks/use_structure';
import { useEditors } from '../hooks/use_editors';
import { useDatasets } from '../hooks/use_datasets';
import { _HOST } from "../urls";
import { Variables } from './variables';
import { Results } from './results';
import { Indicators } from './indicators';
import { Analyses } from './analyses';
import { Uploads } from './uploads';
import { Configuration } from './configuration';
import { Shell1 } from 'components-ui';
import { useAnalyze } from '../hooks/use_analyze';
import { Button } from 'components-ui';
import { COLOR } from 'components-ui';
import { Script } from './script';
import { useResults } from '../hooks/use_results';
import { getDefaultAnalysis, getDefaultIndicator } from '../defaults';
import { LoadEditor } from './load_editor';
import { IndicatorEditor } from './indicator_editor';
import { AnalysisEditor } from './analysis_editor';

export enum TAB {
    Uploads = "Uploads",
    Configuration = "Configuration",
    Variables = "Variables",
    Indicators = "Indicators",
    Analyses = "Analyses",
    Results = "Results",
}

const _TAB_LABELS = {
    [TAB.Uploads]: "Uploads",
    [TAB.Configuration]: "Configuration",
    [TAB.Variables]: "Variables",
    [TAB.Indicators]: "Indicators",
    [TAB.Analyses]: "Analyses",
    [TAB.Results]: "Results",
}

type MainProps = {
    sessionId: string,
    resetSession: () => void,
};

export const Main: React.FC<MainProps> = (p) => {

    const [tab, setTab] = useState<TAB>(TAB.Uploads);

    const ud = useDatasets(p.sessionId);
    const us = useStructure(ud.rawVars1);
    const ua = useAnalyze(p.sessionId, ud.datasets, us.structure);
    const ur = useResults(us.structure.analyses, p.sessionId, ua.tempId);
    const ue = useEditors();

    return <div className="font-sourcesanspro select-none">
        <Shell1
            title="HHFA Analysis Platform"
            tab={tab}
            setTab={setTab}
            tabs={[
                { tab: TAB.Uploads, label: _TAB_LABELS[TAB.Uploads], icon: "cloud-upload" },
                { tab: TAB.Configuration, label: _TAB_LABELS[TAB.Configuration], icon: "office-building" },
                // { tab: TAB.Variables, label: _TAB_LABELS[TAB.Variables], icon: "database" },
                { tab: TAB.Indicators, label: _TAB_LABELS[TAB.Indicators], icon: "star" },
                { tab: TAB.Analyses, label: _TAB_LABELS[TAB.Analyses], icon: "calculator" },
                { tab: TAB.Results, label: _TAB_LABELS[TAB.Results], icon: "presentation-chart-bar" },
            ]}
            bottomButtons={[
                // { label: "Script", icon: "code", onClick: () => ue.setScriptViewer(true) },
                { label: "Documentation", icon: "menu-alt-2", href: "/documentation", newTab: true },
                { label: "Tutorial", icon: "light-bulb", href: "/tutorial", newTab: true },
                {
                    label: "Save setup",
                    icon: "document-download",
                    onClick: () => {
                        const uri = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(us.structure, null, "  "));
                        const a = document.createElement("a");
                        a.download = `hhfa_${Date.now()}.json`;
                        a.href = uri;
                        document.body.appendChild(a);
                        a.click();
                        URL.revokeObjectURL(a.href);
                        document.body.removeChild(a);
                    },
                },
                { label: "Load setup", icon: "document-add", onClick: () => ue.setLoadEditor(true) },
                { label: "End session", icon: "logout", onClick: p.resetSession },
            ]}
            width={168}
            header={_TAB_LABELS[tab]}
            buttons={<>

                {tab === TAB.Results && !ua.running && ud.anyReady && us.structure.indicators.length > 0 && us.structure.analyses.length > 0 &&
                    <>
                        <Button
                            label={ua.needsRunning ? "Run" : "Re-run"}
                            onClick={() => ua.run()}
                            color={COLOR.BLACK}
                            medium
                        />
                    </>
                }
                {tab === TAB.Indicators && ud.anyReady &&
                    <>
                        <Button
                            label="New indicator"
                            onClick={() => ue.setIndicatorEditor(getDefaultIndicator())}
                            medium
                        />
                    </>
                }
                {tab === TAB.Analyses && ud.anyReady && us.structure.indicators.length > 0 &&
                    <>
                        <Button
                            label="New analysis"
                            onClick={() => ue.setAnalysisEditor(getDefaultAnalysis())}
                            medium
                        />
                    </>
                }

            </>}
        >

            {tab === TAB.Uploads &&
                <Uploads
                    sessionId={p.sessionId}
                    ud={ud}
                    ue={ue}
                />
            }

            {tab === TAB.Configuration &&
                <Configuration
                    us={us}
                    ue={ue}
                    ud={ud}
                />
            }

            {tab === TAB.Variables &&
                <Variables
                    us={us}
                    ud={ud}
                    ue={ue}
                />
            }

            {tab === TAB.Indicators &&
                <Indicators
                    us={us}
                    ud={ud}
                    ue={ue}
                />
            }

            {tab === TAB.Analyses &&
                <Analyses
                    us={us}
                    ud={ud}
                    ue={ue}
                />
            }

            {tab === TAB.Results &&
                <Results
                    sessionId={p.sessionId}
                    us={us}
                    ud={ud}
                    ua={ua}
                    ue={ue}
                    ur={ur}
                />
            }

            {ue.scriptViewer &&
                <Script
                    sessionId={p.sessionId}
                    us={us}
                    cancel={ue.closeAllEditors}
                />
            }

            {ue.loadEditor &&
                <LoadEditor
                    us={us}
                    cancel={ue.closeAllEditors}
                />
            }

            {ue.indicatorEditor &&
                <IndicatorEditor
                    indicatorData={ue.indicatorEditor}
                    createOrUpdateIndicator={us.createOrUpdateIndicator}
                    deleteIndicator={us.deleteIndicator}
                    cancel={ue.closeAllEditors}
                    rawVarList={ud.rawVars1}
                />
            }

            {ue.analysisEditor &&
                <AnalysisEditor
                    analysisData={ue.analysisEditor}
                    us={us}
                    ue={ue}
                />
            }

        </Shell1>
    </div >;

};