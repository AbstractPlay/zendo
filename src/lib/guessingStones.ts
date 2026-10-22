import type { ZendoGameState } from "@/schemas/game";

export function findStudentIndex(game: ZendoGameState, studentId: string): number {
    if (!game.students) {
        return -1;
    }
    return game.students.findIndex((s) => s.id === studentId);
}

export function studentStoneCount(game: ZendoGameState, studentId: string): number {
    const idx = findStudentIndex(game, studentId);
    if (idx === -1) {
        return 0;
    }
    return game.students![idx].guesses;
}

/** Spend one guessing stone when a guess is submitted. Returns false if none available. */
export function trySpendGuessingStone(game: ZendoGameState, studentId: string): boolean {
    const idx = findStudentIndex(game, studentId);
    if (idx === -1 || game.students![idx].guesses < 1) {
        return false;
    }
    game.students![idx].guesses--;
    return true;
}

/** Refund one stone when the master rejects or the student withdraws a pending guess. */
export function refundGuessingStone(game: ZendoGameState, studentId: string): void {
    const idx = findStudentIndex(game, studentId);
    if (idx === -1) {
        return;
    }
    game.students![idx].guesses++;
}
