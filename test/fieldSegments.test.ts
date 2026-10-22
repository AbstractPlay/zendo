import { describe, expect, it } from "vitest";
import { buildFieldSegments } from "@/lib/fieldSegments";
import type { ZendoGameState } from "@/schemas/game";

function gameWithKoans(count: number): ZendoGameState {
    return {
        koans: Array.from({ length: count }, (_, i) => ({
            string: `k${i}`,
            htbn: false,
        })),
    };
}

describe("buildFieldSegments", () => {
    it("returns empty when koans are missing", () => {
        expect(buildFieldSegments({})).toEqual([]);
    });

    it("returns one segment with all koan indices when there is no guess history", () => {
        expect(buildFieldSegments(gameWithKoans(3))).toEqual([[ [0, 1, 2], undefined ]]);
    });

    it("treats empty guesses like no guess history", () => {
        const game = { ...gameWithKoans(2), guesses: [] };
        expect(buildFieldSegments(game)).toEqual([[ [0, 1], undefined ]]);
    });

    it("splits koans at accepted guess indices", () => {
        const game: ZendoGameState = {
            ...gameWithKoans(5),
            guesses: [
                { student: "s1", guess: "g1", index: 2 },
                { student: "s2", guess: "g2", index: 4 },
            ],
        };
        expect(buildFieldSegments(game)).toEqual([
            [ [0, 1], { student: "s1", guess: "g1" } ],
            [ [2, 3], { student: "s2", guess: "g2" } ],
            [ [4], undefined ],
        ]);
    });
});
