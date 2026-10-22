declare module "@plantuml/core/plantuml.js" {
    export function renderToString(
        lines: string[],
        onSuccess: (svg: string) => void,
        onError: (message: string) => void,
    ): void;
}
