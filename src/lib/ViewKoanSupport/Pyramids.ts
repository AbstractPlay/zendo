const pyramidSymbols = new Map<string,[string,string]>([
    ["3", [`<symbol viewBox="0 0 180 180" id=""><polygon points="90,2.5 40,177.5 140,177.5" data-playerfill="true" stroke-opacity="0.5" stroke-width="2" stroke="#000000"></polygon><circle r="5" cx="52.5" cy="167.5" fill="#000000" opacity="0.75"></circle><circle r="5" cx="67.5" cy="167.5" fill="#000000" opacity="0.75"></circle><circle r="5" cx="82.5" cy="167.5" fill="#000000" opacity="0.75"></circle></symbol>`, `<symbol viewBox="0 0 180 180" id=""><rect width="100" height="100" data-playerfill="true" stroke-opacity="0.5" stroke-width="2" stroke="#000000" x="40" y="40"></rect><line x1="40" y1="140" x2="140" y2="40" stroke-opacity="0.25" stroke-width="1" stroke="#000000"></line><line x1="40" y1="40" x2="140" y2="140" stroke-opacity="0.25" stroke-width="1" stroke="#000000"></line><circle r="2" cx="90" cy="90" fill="#000000" opacity="0.25"></circle><line x1="50" y1="136" x2="60" y2="136" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="65" y1="136" x2="75" y2="136" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="80" y1="136" x2="90" y2="136" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="130" y1="44" x2="120" y2="44" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="115" y1="44" x2="105" y2="44" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="100" y1="44" x2="90" y2="44" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="44" y1="50" x2="44" y2="60" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="44" y1="65" x2="44" y2="75" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="44" y1="80" x2="44" y2="90" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="136" y1="130" x2="136" y2="120" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="136" y1="115" x2="136" y2="105" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="136" y1="100" x2="136" y2="90" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line></symbol>`]],
    ["2", [`<symbol viewBox="0 0 180 180" id=""><polygon points="90,21.25 50.9375,158.75 129.0625,158.75" data-playerfill="true" stroke-opacity="0.5" stroke-width="2" stroke="#000000"></polygon><circle r="5" cx="63.4375" cy="148.75" fill="#000000" opacity="0.75"></circle><circle r="5" cx="78.4375" cy="148.75" fill="#000000" opacity="0.75"></circle></symbol>`, `<symbol viewBox="0 0 180 180" id=""><rect width="180" height="180" fill="none"></rect><rect width="78.125" height="78.125" data-playerfill="true" stroke-opacity="0.5" stroke-width="2" stroke="#000000" x="50.9375" y="50.9375"></rect><line x1="50.9375" y1="129.0625" x2="129.0625" y2="50.9375" stroke-opacity="0.25" stroke-width="1" stroke="#000000"></line><line x1="50.9375" y1="50.9375" x2="129.0625" y2="129.0625" stroke-opacity="0.25" stroke-width="1" stroke="#000000"></line><circle r="2" cx="90" cy="90" fill="#000000" opacity="0.25"></circle><line x1="60.9375" y1="125.0625" x2="70.9375" y2="125.0625" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="75.9375" y1="125.0625" x2="85.9375" y2="125.0625" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="119.0625" y1="54.9375" x2="109.0625" y2="54.9375" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="104.0625" y1="54.9375" x2="94.0625" y2="54.9375" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="54.9375" y1="60.9375" x2="54.9375" y2="70.9375" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="54.9375" y1="75.9375" x2="54.9375" y2="85.9375" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="125.0625" y1="119.0625" x2="125.0625" y2="109.0625" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="125.0625" y1="104.0625" x2="125.0625" y2="94.0625" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line></symbol>`]],
    ["1", [`<symbol viewBox="0 0 180 180" id=""><polygon points="90,40 61.875,140 118.125,140" data-playerfill="true" stroke-opacity="0.5" stroke-width="2" stroke="#000000"></polygon><circle r="5" cx="74.375" cy="130" fill="#000000" opacity="0.75"></circle></symbol>`, `<symbol viewBox="0 0 180 180" id=""><rect width="180" height="180" fill="none"></rect><rect width="56.25" height="56.25" data-playerfill="true" stroke-opacity="0.5" stroke-width="2" stroke="#000000" x="61.875" y="61.875"></rect><line x1="61.875" y1="118.125" x2="118.125" y2="61.875" stroke-opacity="0.25" stroke-width="1" stroke="#000000"></line><line x1="61.875" y1="61.875" x2="118.125" y2="118.125" stroke-opacity="0.25" stroke-width="1" stroke="#000000"></line><circle r="2" cx="90" cy="90" fill="#000000" opacity="0.25"></circle><line x1="71.875" y1="114.125" x2="81.875" y2="114.125" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="108.125" y1="65.875" x2="98.125" y2="65.875" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="65.875" y1="71.875" x2="65.875" y2="81.875" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="114.125" y1="108.125" x2="114.125" y2="98.125" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line></symbol>`]],
]);
export const pyramidColours = new Map<string, string>([
    ["RD", "#e41a1c"],
    ["BU", "#377eb8"],
    ["GN", "#4daf4a"],
    ["YE", "#ffff33"],
    ["VT", "#984ea3"],
    ["OG", "#ff7f00"],
    ["BN", "#a65628"],
    ["PK", "#f781bf"],
    ["GY", "#999999"],
    ["WH", "#ffffff"],
]);

export const process1dSvg = (koanStr: string): string => {
    // Doing this the dirty but straightforward way of just cobbling together an SVG from pieces.

    const pieces = koanStr.toUpperCase().split(/\s+/);
    if ( (koanStr === undefined) || (koanStr === "") || (pieces.length === 0) ) {
        return "";
    }
    let svgStr = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" viewBox="0 0 ${(pieces.length * 190) - 10} 180" width="100%" height="100%"><title>${koanStr}</title><defs>`;

    // Process each piece to populate <defs>
    const codes = new Set<string>();
    for (const p of pieces) {
        if ( (p.length < 3) || (p.length > 5) ) { continue; }
        let colour = p.slice(0, 2);
        let size = p[2];
        let dir: string;
        if (p.length > 3) {
            dir = p.slice(3);
        }
        const rgb = pyramidColours.get(colour);
        if (rgb === undefined) { continue; }
        if (! ["1", "2", "3"].includes(size)) { continue; }

        // Check for dupes
        let code = "";
        if ( (dir === undefined) || (dir === "U") ) {
            code = colour + size + "U"
        } else {
            code = colour + size + "F";
        }
        if (codes.has(code)) { continue; }
        codes.add(code);

        if ( (dir === undefined) || (dir === "U") ) {
            // Load "up" version
            let insert = pyramidSymbols.get(size!)[1];
            insert = insert.replace(` id="">`, ` id="${colour}${size}UP">`);
            insert = insert.replace(`data-playerfill="true"`, `fill="${rgb}"`);
            svgStr += insert;
        } else {
            // Load "flat" version
            let insert = pyramidSymbols.get(size!)[0];
            insert = insert.replace(` id="">`, ` id="${colour}${size}FLAT">`);
            insert = insert.replace(`data-playerfill="true"`, `fill="${rgb}"`);
            svgStr += insert;
        }
    }
    svgStr += `</defs>`;

    // Place each piece
    for (let i = 0; i < pieces.length; i++) {
        const p = pieces[i];
        let y = 0; let cy = 90;
        let x = (190 * i); let cx = x + 90;

        if ( (p.length < 3) || (p.length > 5) ) { continue; }
        let colour = p.slice(0, 2);
        let size = p[2];
        let dir: string;
        if (p.length > 3) {
            dir = p.slice(3);
        }
        const rgb = pyramidColours.get(colour);
        if (rgb === undefined) { continue; }
        if (! ["1", "2", "3"].includes(size)) { continue; }

        if ( (dir === undefined) || (dir === "U") ) {
            // Place "up" version
            svgStr += `<use href="#${colour}${size}UP" x="${x}" y="${y}" height="180" width="180"></use>`;
        } else {
            // Place "flat" version
            if (! ["N", "NE", "E", "SE", "S", "SW", "W", "NW"].includes(dir)) { continue; }
            let deg = 0;
            if (dir === "E") {
                deg = 90;
            } else if (dir === "S") {
                deg = 180;
            } else if (dir === "W") {
                deg = 270;
            } else if (dir === "NE") {
                deg = 45;
            } else if (dir === "SE") {
                deg = 135;
            } else if (dir === "NW") {
                deg = -45;
            } else if (dir === "SW") {
                deg = -135;
            }
            if (deg !== 0) {
                if ( (size === "3") && (deg % 90 !== 0) ) {
                    let tx = 0; let ty = 0;
                    if (dir === "NE") {
                        tx = 10; ty = -10;
                    } else if (dir === "SE") {
                        tx = 10; ty = 10;
                    } else if (dir === "SW") {
                        tx = -10; ty = 10;
                    } else if (dir === "NW") {
                        tx = -10; ty = -10;
                    }
                    svgStr += `<use href="#${colour}${size}FLAT" x="${x}" y="${y}" height="180" width="180" transform="translate(${tx} ${ty}) rotate(${deg} ${cx} ${cy})"></use>`;
                } else {
                    svgStr += `<use href="#${colour}${size}FLAT" x="${x}" y="${y}" height="180" width="180" transform="rotate(${deg} ${cx} ${cy})"></use>`;
                }
            } else {
                svgStr += `<use href="#${colour}${size}FLAT" x="${x}" y="${y}" height="180" width="180"></use>`;
            }
        }
    }

    // Terminate
    svgStr += `</svg>`
    return svgStr;
};

export const process2dSvg = (koanStr: string): string => {
    // Doing this the dirty but straightforward way of just cobbling together an SVG from pieces.
    const rows = koanStr.toUpperCase().split(/\n/);
    let maxpcs = 0;
    for (const row of rows) {
        const pcs = row.split(/\s+/);
        maxpcs = Math.max(maxpcs, pcs.length);
    }
    let pieces = koanStr.toUpperCase().split(/\s+/);
    if ( (koanStr === undefined) || (koanStr === "") || (pieces.length === 0) ) {
        return "";
    }
    let svgStr = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" viewBox="0 0 ${(maxpcs * 190) - 10} ${(rows.length * 190) - 10}" width="100%" height="100%"><title>${koanStr}</title><defs>`;

    // Process each piece to populate <defs>
    const codes = new Set<string>();
    for (const p of pieces) {
        if ( (p.length < 3) || (p.length > 5) ) { continue; }
        let colour = p.slice(0, 2);
        let size = p[2];
        let dir: string;
        if (p.length > 3) {
            dir = p.slice(3);
        }
        const rgb = pyramidColours.get(colour);
        if (rgb === undefined) { continue; }
        if (! ["1", "2", "3"].includes(size)) { continue; }

        // Check for dupes
        let code = "";
        if ( (dir === undefined) || (dir === "U") ) {
            code = colour + size + "U"
        } else {
            code = colour + size + "F";
        }
        if (codes.has(code)) { continue; }
        codes.add(code);

        if ( (dir === undefined) || (dir === "U") ) {
            // Load "up" version
            let insert = pyramidSymbols.get(size!)[1];
            insert = insert.replace(` id="">`, ` id="${colour}${size}UP">`);
            insert = insert.replace(`data-playerfill="true"`, `fill="${rgb}"`);
            svgStr += insert;
        } else {
            // Load "flat" version
            let insert = pyramidSymbols.get(size!)[0];
            insert = insert.replace(` id="">`, ` id="${colour}${size}FLAT">`);
            insert = insert.replace(`data-playerfill="true"`, `fill="${rgb}"`);
            svgStr += insert;
        }
    }
    svgStr += `</defs>`;

    // Place each piece
    for (let rowidx = 0; rowidx < rows.length; rowidx++) {
        const row = rows[rowidx];
        pieces = row.toUpperCase().split(/\s+/);
        for (let i = 0; i < pieces.length; i++) {
            const p = pieces[i];
            let y = (190 * rowidx); let cy = y + 90;
            let x = (190 * i); let cx = x + 90;

            if ( (p.length < 3) || (p.length > 5) ) { continue; }
            let colour = p.slice(0, 2);
            let size = p[2];
            let dir: string;
            if (p.length > 3) {
                dir = p.slice(3);
            }
            const rgb = pyramidColours.get(colour);
            if (rgb === undefined) { continue; }
            if (! ["1", "2", "3"].includes(size)) { continue; }
            if ( (dir === undefined) || (dir === "U") ) {
                // Place "up" version
                svgStr += `<use href="#${colour}${size}UP" x="${x}" y="${y}" height="180" width="180"></use>`;
            } else {
                // Place "flat" version
                if (! ["N", "NE", "E", "SE", "S", "SW", "W", "NW"].includes(dir)) { continue; }
                let deg = 0;
                if (dir === "E") {
                    deg = 90;
                } else if (dir === "S") {
                    deg = 180;
                } else if (dir === "W") {
                    deg = 270;
                } else if (dir === "NE") {
                    deg = 45;
                } else if (dir === "SE") {
                    deg = 135;
                } else if (dir === "NW") {
                    deg = -45;
                } else if (dir === "SW") {
                    deg = -135;
                }
                if (deg !== 0) {
                    if ( (size === "3") && (deg % 90 !== 0) ) {
                        let tx = 0; let ty = 0;
                        if (dir === "NE") {
                            tx = 10; ty = -10;
                        } else if (dir === "SE") {
                            tx = 10; ty = 10;
                        } else if (dir === "SW") {
                            tx = -10; ty = 10;
                        } else if (dir === "NW") {
                            tx = -10; ty = -10;
                        }
                        svgStr += `<use href="#${colour}${size}FLAT" x="${x}" y="${y}" height="180" width="180" transform="translate(${tx} ${ty}) rotate(${deg} ${cx} ${cy})"></use>`;
                    } else {
                        svgStr += `<use href="#${colour}${size}FLAT" x="${x}" y="${y}" height="180" width="180" transform="rotate(${deg} ${cx} ${cy})"></use>`;
                    }
                } else {
                    svgStr += `<use href="#${colour}${size}FLAT" x="${x}" y="${y}" height="180" width="180"></use>`;
                }
            }
        }
    }

    // Terminate
    svgStr += `</svg>`
    return svgStr;
};
