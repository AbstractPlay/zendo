import type { Viz } from "@viz-js/viz";

let vizPromise: Promise<Viz> | undefined;

export function loadGraphviz(): Promise<Viz> {
    if (vizPromise === undefined) {
        vizPromise = import("./vendor/viz.js").then((m: { instance: () => Promise<Viz> }) =>
            m.instance(),
        );
    }
    return vizPromise;
}

export function renderGraphvizSvg(koanStr: string): Promise<string> {
    return loadGraphviz().then((viz) =>
        viz.renderString(koanStr, { format: "svg", engine: "dot" }),
    );
}
