import type { ZendoGameState } from "@/schemas/game";

/**
 * Snapshot for export/download: copies koans and guesses with display names only on the copy.
 */
export function buildExportGameSnapshot(
    game: ZendoGameState,
    studentDisplayName: (peerId: string) => string,
): ZendoGameState {
    const exported: ZendoGameState = {};
    if (game.koanType !== undefined) {
        exported.koanType = game.koanType;
    }
    if (game.welcome !== undefined) {
        exported.welcome = game.welcome;
    }
    if (game.guesses !== undefined) {
        exported.guesses = game.guesses.map((g) => ({
            ...g,
            student: studentDisplayName(g.student),
        }));
    }
    if (game.koans !== undefined) {
        exported.koans = [...game.koans];
    }
    return exported;
}
