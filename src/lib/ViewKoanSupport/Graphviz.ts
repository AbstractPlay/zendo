import type { Viz } from "@viz-js/viz";

let vizPromise: Promise<Viz> | undefined;

export function loadGraphviz(): Promise<Viz> {
    if (vizPromise === undefined) {
        vizPromise = import("../../../vendor/graphviz/viz.js").then((m) =>
            m.instance() as unknown as Promise<Viz>,
        );
    }
    return vizPromise;
}

export function renderGraphvizSvg(koanStr: string): Promise<string> {
    return loadGraphviz().then((viz) =>
        viz.renderString(koanStr, { format: "svg", engine: "dot" }),
    );
}
