import { describe, expect, it } from "vitest";
import { rgbToInts } from "@/lib/ViewKoanSupport/Colours";

describe("rgbToInts", () => {
    it("expands three-digit hex shorthand", () => {
        expect(rgbToInts("#e41")).toEqual([0xee, 0x44, 0x11]);
    });

    it("parses six-digit hex", () => {
        expect(rgbToInts("#e41122")).toEqual([0xe4, 0x11, 0x22]);
    });
});
