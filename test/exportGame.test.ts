import { describe, expect, it } from "vitest";
import { buildExportGameSnapshot } from "@/lib/exportGame";
import type { ZendoGameState } from "@/schemas/game";

describe("buildExportGameSnapshot", () => {
    it("maps student ids to display names without mutating live guesses", () => {
        const live: ZendoGameState = {
            koanType: "text",
            welcome: "hi",
            koans: [{ string: "a", htbn: true }],
            guesses: [{ student: "peer-a", guess: "rule", index: 1 }],
        };
        const exported = buildExportGameSnapshot(live, (id) =>
            id === "peer-a" ? "Alice" : id,
        );
        expect(exported.guesses![0].student).toBe("Alice");
        expect(live.guesses![0].student).toBe("peer-a");
        expect(exported.guesses![0]).not.toBe(live.guesses![0]);
        expect(exported.koans).not.toBe(live.koans);
        expect(exported.koans![0]).toBe(live.koans![0]);
    });
});
