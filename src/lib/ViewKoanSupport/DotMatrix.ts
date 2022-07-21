export const processDotMatrixSVG = (koanStr: string): string => {
    const colours: string[] = [
        "#000000",
        "#e41a1c",
        "#4daf4a",
        "#377eb8",
        "#ffff33",
        "#984ea3",
        "#ff7f00",
        "#a65628",
        "#f781bf",
    ];
    koanStr = koanStr.replaceAll(/\s/g, "");
    const parts = koanStr.split(",");
    if ( (parts.length < 2) || (parts.length > 3) ) {
        return "";
    }
    const width = parseInt(parts[0], 10);
    const height = parseInt(parts[1], 10);
    if ( (isNaN(width)) || (isNaN(height)) ) {
        return "";
    }

    let svgStr = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" viewBox="-7 -7 ${(width * 12) + 2} ${(height * 12) + 2}" width="100%" height="100%"><title>${koanStr}</title><defs>`;
    // Just add all nine colours every time, used or not
    for (let i = 0; i < colours.length; i++) {
        svgStr += `<symbol viewBox="-5 -5 10 10" id="Dot${i + 1}"><circle r="4" cx="0" cy="0" fill="${colours[i]}" stroke="${colours[i]}"></symbol>`;
    }
    svgStr += `</defs>`;

    // draw the lines
    for (let i = 0; i <= width; i++) {
        svgStr += `<line x1="${-6 + (i * 12)}" y1="-6" x2="${-6 + (i * 12)}" y2="${-6 + (height * 12)}" stroke-width="0.25" stroke="#000000"></line>`;
    }
    for (let i = 0; i <= height; i++) {
        svgStr += `<line x1="-6" y1="${-6 + (i * 12)}" x2="${-6 + (width * 12)}" y2="${-6 + (i * 12)}" stroke-width="0.25" stroke="#000000"></line>`;
    }

    // place the pieces
    if (parts.length === 3) {
        for (let i = 0; i < parts[2].length; i++) {
            const digit = parts[2][i];
            const num = parseInt(digit, 10);
            if ( (isNaN(num)) || (num === 0) ) { continue; }
            const row = Math.floor(i / width);
            const col = i % width;
            svgStr += `<use href="#Dot${digit}" x="${(col * 12) - 5.5}" y="${(row * 12) - 5.5}" height="11" width="11"></use>`;
        }
    }

    svgStr += `</svg>`;
    return svgStr;
};
