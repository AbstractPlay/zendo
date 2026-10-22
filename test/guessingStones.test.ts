import { describe, expect, it } from "vitest";
import {
    refundGuessingStone,
    trySpendGuessingStone,
} from "@/lib/guessingStones";
import type { ZendoGameState } from "@/schemas/game";

function gameWithStones(id: string, count: number): ZendoGameState {
    return {
        students: [{ id, guesses: count }],
    };
}

describe("guessingStones", () => {
    it("spends one stone when available", () => {
        const game = gameWithStones("s", 2);
        expect(trySpendGuessingStone(game, "s")).toBe(true);
        expect(game.students![0].guesses).toBe(1);
    });

    it("refuses spend at zero", () => {
        const game = gameWithStones("s", 0);
        expect(trySpendGuessingStone(game, "s")).toBe(false);
    });

    it("refunds one stone after reject or withdraw", () => {
        const game = gameWithStones("s", 0);
        refundGuessingStone(game, "s");
        expect(game.students![0].guesses).toBe(1);
    });
});
