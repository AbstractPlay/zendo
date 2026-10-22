import { describe, expect, it } from "vitest";
import {
    removeStudentFromGame,
    shouldSyncRosterOnPeerDisconnect,
} from "@/lib/roster";
import type { ZendoGameState } from "@/schemas/game";

describe("removeStudentFromGame", () => {
    it("advances currplayer to the next seat when the current player leaves", () => {
        const state: ZendoGameState = {
            master: "m",
            currplayer: "b",
            students: [
                { id: "a", guesses: 1 },
                { id: "b", guesses: 1 },
                { id: "c", guesses: 1 },
            ],
        };
        expect(removeStudentFromGame(state, "b")).toBe(true);
        expect(state.currplayer).toBe("c");
        expect(state.students!.map((s) => s.id)).toEqual(["a", "c"]);
    });

    it("wraps turn to the first remaining student when the last seat leaves", () => {
        const state: ZendoGameState = {
            currplayer: "c",
            students: [
                { id: "a", guesses: 0 },
                { id: "c", guesses: 0 },
            ],
        };
        removeStudentFromGame(state, "c");
        expect(state.currplayer).toBe("a");
    });
});

describe("shouldSyncRosterOnPeerDisconnect", () => {
    it("is true for the master", () => {
        const state: ZendoGameState = { master: "m" };
        expect(shouldSyncRosterOnPeerDisconnect(state, "m", ["s1"])).toBe(true);
    });

    it("is true for any peer when the master is not connected", () => {
        const state: ZendoGameState = { master: "m" };
        expect(shouldSyncRosterOnPeerDisconnect(state, "s1", ["s1", "s2"])).toBe(
            true,
        );
    });

    it("is false for a student while the master is still connected", () => {
        const state: ZendoGameState = { master: "m" };
        expect(shouldSyncRosterOnPeerDisconnect(state, "s1", ["m", "s1"])).toBe(
            false,
        );
    });
});
