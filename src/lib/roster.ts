import type { ZendoGameState } from "@/schemas/game";

/**
 * Remove a student by peer id. If they had the turn, advance to the next seat (wrap).
 * Returns whether the roster changed.
 */
export function removeStudentFromGame(state: ZendoGameState, studentId: string): boolean {
    if (!state.students) {
        return false;
    }
    const idx = state.students.findIndex((s) => s.id === studentId);
    if (idx === -1) {
        return false;
    }
    const wasCurr = state.currplayer === studentId;
    state.students.splice(idx, 1);
    if (state.students.length === 0) {
        delete state.students;
        if (wasCurr) {
            delete state.currplayer;
        }
        return true;
    }
    if (wasCurr) {
        const nextIdx = idx < state.students.length ? idx : 0;
        state.currplayer = state.students[nextIdx].id;
    }
    return true;
}

/** Master syncs roster; if master is offline, any connected peer may broadcast removals. */
export function shouldSyncRosterOnPeerDisconnect(
    state: ZendoGameState,
    myPeerId: string,
    connectedPeerIds: string[],
): boolean {
    const master = state.master;
    if (master === undefined) {
        return false;
    }
    if (master === myPeerId) {
        return true;
    }
    return !connectedPeerIds.includes(master);
}
