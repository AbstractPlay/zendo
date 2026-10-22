import type { ZendoGameState } from "@/schemas/game";

export type FieldGuess = {
    student: string;
    guess: string;
};

/** [koan indices in this segment, guess divider after segment (if any)] */
export type FieldSegment = [number[], FieldGuess | undefined];

/**
 * Builds the play-field layout: koan index groups separated by accepted guesses.
 * Recomputes from game state whenever inputs change (use reactively in Field.svelte).
 */
export function buildFieldSegments(game: ZendoGameState): FieldSegment[] {
    const segments: FieldSegment[] = [];
    if (!game.hasOwnProperty("koans") || game.koans === undefined) {
        return segments;
    }
    const koanCount = game.koans.length;
    const guesses = game.guesses;
    const hasGuessHistory =
        game.hasOwnProperty("guesses") &&
        guesses !== undefined &&
        guesses.length > 0;

    if (!hasGuessHistory) {
        const lst: number[] = [];
        for (let i = 0; i < koanCount; i++) {
            lst.push(i);
        }
        segments.push([lst, undefined]);
        return segments;
    }

    for (const g of guesses) {
        let startIdx = 0;
        if (segments.length > 0) {
            const lastLst = segments[segments.length - 1][0];
            startIdx = lastLst[lastLst.length - 1] + 1;
        }
        const lst: number[] = [];
        for (let i = startIdx; i < g.index; i++) {
            lst.push(i);
        }
        segments.push([lst, { student: g.student, guess: g.guess }]);
    }

    const lastLst = segments[segments.length - 1][0];
    const startIdx = lastLst.length > 0 ? lastLst[lastLst.length - 1] + 1 : 0;
    const tail: number[] = [];
    for (let i = startIdx; i < koanCount; i++) {
        tail.push(i);
    }
    segments.push([tail, undefined]);
    return segments;
}
