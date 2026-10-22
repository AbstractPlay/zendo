import katex from "katex";
import { defaultColours, process1dSvg, process2dSvg } from "@/lib/ViewKoanSupport/Pyramids";
import { processDotMatrixSVG } from "@/lib/ViewKoanSupport/DotMatrix";
import type { ZendoGameState } from "@/schemas/game";

export type KoanType = NonNullable<ZendoGameState["koanType"]>;

export function pyramidColourMap(
    colours: ZendoGameState["colours"],
): Map<string, string> {
    if (colours === undefined) {
        return new Map(defaultColours);
    }
    return new Map(colours.map(({ abbreviation, hex }) => [abbreviation, hex]));
}

export function renderMathHtml(koanStr: string): string {
    try {
        return katex.renderToString(koanStr, { displayMode: true });
    } catch {
        return "Invalid equation";
    }
}

export function renderSyncKoanSvg(
    koanType: KoanType | undefined,
    koanStr: string,
    pyramidColours: Map<string, string>,
    symbolScope = "",
): string {
    if (koanType === "1dpyramids") {
        return process1dSvg(koanStr, pyramidColours, symbolScope);
    }
    if (koanType === "2dpyramids") {
        return process2dSvg(koanStr, pyramidColours, symbolScope);
    }
    if (koanType === "dotmatrix") {
        return processDotMatrixSVG(koanStr, symbolScope);
    }
    return "";
}

type CardsRenderers = {
    process1dCards: (koanStr: string, symbolScope?: string) => string;
    process2dCards: (koanStr: string, symbolScope?: string) => string;
};

let cardsModulePromise: Promise<CardsRenderers> | undefined;

export function loadCardsRenderers(): Promise<CardsRenderers> {
    if (cardsModulePromise === undefined) {
        cardsModulePromise = import("@/lib/ViewKoanSupport/Cards");
    }
    return cardsModulePromise;
}

export function renderCardsSvg(
    koanType: "1dcards" | "2dcards",
    koanStr: string,
    renderers: CardsRenderers,
    symbolScope = "",
): string {
    return koanType === "1dcards"
        ? renderers.process1dCards(koanStr, symbolScope)
        : renderers.process2dCards(koanStr, symbolScope);
}

export function isSvgDownloadReady(svg: string): boolean {
    return (
        svg.length > 0 &&
        !svg.startsWith("Loading") &&
        !svg.startsWith("Rendering")
    );
}

/** Avoid data-URI size limits and match on-screen SVG bytes. */
export function downloadSvgBlob(svg: string, filename: string): void {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
}

let graphvizModulePromise: Promise<typeof import("@/lib/ViewKoanSupport/Graphviz")> | undefined;

export function fetchGraphvizSvg(koanStr: string): Promise<string> {
    if (graphvizModulePromise === undefined) {
        graphvizModulePromise = import("@/lib/ViewKoanSupport/Graphviz");
    }
    return graphvizModulePromise.then((m) => m.renderGraphvizSvg(koanStr));
}

let plantumlModulePromise: Promise<typeof import("@/lib/ViewKoanSupport/Plantuml")> | undefined;

export function fetchPlantUmlSvg(koanStr: string): Promise<string> {
    if (plantumlModulePromise === undefined) {
        plantumlModulePromise = import("@/lib/ViewKoanSupport/Plantuml");
    }
    return plantumlModulePromise.then((m) => m.renderPlantUmlSvg(koanStr));
}
