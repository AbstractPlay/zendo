import { loadGraphviz } from "@/lib/ViewKoanSupport/Graphviz";

declare global {
    /** @plantuml/core layout hook when `viz-global.js` is not on the page. */
    var PLANTUML_VIZ: unknown;
}

type PlantumlModule = typeof import("@plantuml/core/plantuml.js");

let enginePromise: Promise<PlantumlModule> | undefined;

function loadPlantumlEngine(): Promise<PlantumlModule> {
    if (enginePromise === undefined) {
        enginePromise = Promise.all([
            import("@plantuml/core/plantuml.js"),
            loadGraphviz(),
        ]).then(([plantuml, viz]) => {
            globalThis.PLANTUML_VIZ = viz;
            return plantuml;
        });
    }
    return enginePromise;
}

function splitPlantUmlLines(source: string): string[] {
    return source.split(/\r\n|\r|\n/);
}

export function renderPlantUmlSvg(koanStr: string): Promise<string> {
    return loadPlantumlEngine().then(
        ({ renderToString }) =>
            new Promise((resolve, reject) => {
                renderToString(splitPlantUmlLines(koanStr), resolve, reject);
            }),
    );
}
