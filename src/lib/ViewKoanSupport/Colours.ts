export type HSV = {h: number; s: number; v: number};
export const sortHSV = (a: HSV, b: HSV): number => {
    if (a.h === b.h) {
        if (a.s === b.s) {
            if (a.v === b.v) {
                return 0;
            } else {
                return a.v - b.v;
            }
        } else {
            return a.s - b.s;
        }
    } else {
        return a.h - b.h;
    }
}

export const rgbToInts = (instr: string): [number, number, number] => {
    let final: [number, number, number] = [0,0,0];
    let str = instr;
    if (str.startsWith("#")) {
        str = str.substring(1);
    }
    let individual: string[]|undefined;
    if (str.length === 3) {
        individual = str.split("");
    } else if (str.length === 6) {
        individual = [str.substring(0, 2), str.substring(2, 4), str.substring(4)];
    } else {
        throw new Error("Incoming RGB string must be 3 or 6 characters long.")
    }
    if (individual !== undefined) {
        final = [parseInt(individual[0], 16), parseInt(individual[1], 16), parseInt(individual[2], 16)]
    }
    return final;
}

export const rgbToHsv = ( r: number, g: number, b: number ): {h: number; s: number; v: number} => {

	let h: number;
	let s: number;
	let v: number;

	var maxColor = Math.max(r, g, b);
	var minColor = Math.min(r, g, b);
	var delta = maxColor - minColor;

	// Calculate hue
	// To simplify the formula, we use 0-6 range.
	if (delta === 0) {
		h = 0;
	} else if (r === maxColor) {
		h = (6 + (g - b) / delta) % 6;
	} else if (g === maxColor) {
		h = 2 + (b - r) / delta;
	} else if (b === maxColor) {
		h = 4 + (r - g) / delta;
	} else {
		h = 0;
	}
	// Then adjust the range to be 0-1
	h = h/6;

	// Calculate saturation
	if (maxColor !== 0) {
		s = delta / maxColor;
	} else {
		s = 0;
	}

	// Calculate value
	v = maxColor / 255;

	return { h, s, v };
};