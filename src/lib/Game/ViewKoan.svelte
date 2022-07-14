<script lang="ts">
    import katex from "katex";
    import { game } from "@/stores/writeGame";
    import { peer } from "@/stores/writePeerObj";
    import { peers } from "@/stores/writePeers";
    import type { ZendoGameMessages } from "@/schemas/messages";

    // You can provide either a number or a string, but not both.
    // Passing a number assumes the koan already exists in the game object.
    export let koanNum: number = undefined;
    export let koanStr: string = undefined;
    export let noExpand = false;
    let htbn: boolean;
    if (koanStr !== undefined) {
        koanNum = undefined;
        htbn = undefined;
    }
    if (koanNum !== undefined) {
        koanStr = $game.koans[koanNum].string;
        htbn = $game.koans[koanNum].htbn;
    }

    const pushGame = () => {
        const msg: ZendoGameMessages = {
            type: "gameReplace",
            game: JSON.stringify($game)
        }
        for (const p of $peers) {
            p.connection.send(msg);
        }
    };

    const toggleNature = () => {
        $game.koans[koanNum].htbn = !$game.koans[koanNum].htbn;
        $game = $game;
        pushGame();
    };

    let equation: string;
    if ($game.koanType === "math") {
        try {
            equation = katex.renderToString(koanStr, {displayMode: true});
        } catch {
            equation = "Invalid equation";
        }
    }

    // Doing this the dirty but straightforward way of just cobbling together an SVG from pieces.
    const symbols = new Map<string,[string,string]>([
        ["3", [`<symbol viewBox="0 0 180 180" id=""><polygon points="90,2.5 40,177.5 140,177.5" data-playerfill="true" stroke-opacity="0.5" stroke-width="2" stroke="#000000"></polygon><circle r="5" cx="52.5" cy="167.5" fill="#000000" opacity="0.75"></circle><circle r="5" cx="67.5" cy="167.5" fill="#000000" opacity="0.75"></circle><circle r="5" cx="82.5" cy="167.5" fill="#000000" opacity="0.75"></circle></symbol>`, `<symbol viewBox="0 0 180 180" id=""><rect width="100" height="100" data-playerfill="true" stroke-opacity="0.5" stroke-width="2" stroke="#000000" x="40" y="40"></rect><line x1="40" y1="140" x2="140" y2="40" stroke-opacity="0.25" stroke-width="1" stroke="#000000"></line><line x1="40" y1="40" x2="140" y2="140" stroke-opacity="0.25" stroke-width="1" stroke="#000000"></line><circle r="2" cx="90" cy="90" fill="#000000" opacity="0.25"></circle><line x1="50" y1="136" x2="60" y2="136" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="65" y1="136" x2="75" y2="136" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="80" y1="136" x2="90" y2="136" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="130" y1="44" x2="120" y2="44" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="115" y1="44" x2="105" y2="44" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="100" y1="44" x2="90" y2="44" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="44" y1="50" x2="44" y2="60" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="44" y1="65" x2="44" y2="75" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="44" y1="80" x2="44" y2="90" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="136" y1="130" x2="136" y2="120" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="136" y1="115" x2="136" y2="105" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="136" y1="100" x2="136" y2="90" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line></symbol>`]],
        ["2", [`<symbol viewBox="0 0 180 180" id=""><polygon points="90,21.25 50.9375,158.75 129.0625,158.75" data-playerfill="true" stroke-opacity="0.5" stroke-width="2" stroke="#000000"></polygon><circle r="5" cx="63.4375" cy="148.75" fill="#000000" opacity="0.75"></circle><circle r="5" cx="78.4375" cy="148.75" fill="#000000" opacity="0.75"></circle></symbol>`, `<symbol viewBox="0 0 180 180" id=""><rect width="180" height="180" fill="none"></rect><rect width="78.125" height="78.125" data-playerfill="true" stroke-opacity="0.5" stroke-width="2" stroke="#000000" x="50.9375" y="50.9375"></rect><line x1="50.9375" y1="129.0625" x2="129.0625" y2="50.9375" stroke-opacity="0.25" stroke-width="1" stroke="#000000"></line><line x1="50.9375" y1="50.9375" x2="129.0625" y2="129.0625" stroke-opacity="0.25" stroke-width="1" stroke="#000000"></line><circle r="2" cx="90" cy="90" fill="#000000" opacity="0.25"></circle><line x1="60.9375" y1="125.0625" x2="70.9375" y2="125.0625" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="75.9375" y1="125.0625" x2="85.9375" y2="125.0625" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="119.0625" y1="54.9375" x2="109.0625" y2="54.9375" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="104.0625" y1="54.9375" x2="94.0625" y2="54.9375" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="54.9375" y1="60.9375" x2="54.9375" y2="70.9375" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="54.9375" y1="75.9375" x2="54.9375" y2="85.9375" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="125.0625" y1="119.0625" x2="125.0625" y2="109.0625" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="125.0625" y1="104.0625" x2="125.0625" y2="94.0625" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line></symbol>`]],
        ["1", [`<symbol viewBox="0 0 180 180" id=""><polygon points="90,40 61.875,140 118.125,140" data-playerfill="true" stroke-opacity="0.5" stroke-width="2" stroke="#000000"></polygon><circle r="5" cx="74.375" cy="130" fill="#000000" opacity="0.75"></circle></symbol>`, `<symbol viewBox="0 0 180 180" id=""><rect width="180" height="180" fill="none"></rect><rect width="56.25" height="56.25" data-playerfill="true" stroke-opacity="0.5" stroke-width="2" stroke="#000000" x="61.875" y="61.875"></rect><line x1="61.875" y1="118.125" x2="118.125" y2="61.875" stroke-opacity="0.25" stroke-width="1" stroke="#000000"></line><line x1="61.875" y1="61.875" x2="118.125" y2="118.125" stroke-opacity="0.25" stroke-width="1" stroke="#000000"></line><circle r="2" cx="90" cy="90" fill="#000000" opacity="0.25"></circle><line x1="71.875" y1="114.125" x2="81.875" y2="114.125" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="108.125" y1="65.875" x2="98.125" y2="65.875" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="65.875" y1="71.875" x2="65.875" y2="81.875" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line><line x1="114.125" y1="108.125" x2="114.125" y2="98.125" stroke-opacity="0.75" stroke-width="2" stroke="#000000"></line></symbol>`]],
    ]);
    const colours = new Map<string, string>([
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
    const processSvg = (): string => {
        const pieces = koanStr.toUpperCase().split(/\s+/);
        if ( (koanStr === undefined) || (koanStr === "") || (pieces.length === 0) ) {
            return "";
        }
        let svgStr = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" viewBox="0 0 ${(pieces.length * 190) - 10} 180" width="100%" height="100%"><defs>`;

        // Process each piece to populate <defs>
        for (const p of pieces) {
            if ( (p.length < 3) || (p.length > 4) ) { continue; }
            let colour = p.slice(0, 2);
            let size = p[2];
            let dir: string;
            if (p.length === 4) {
                dir = p[3];
            }
            const rgb = colours.get(colour);
            if (rgb === undefined) { continue; }
            if (! ["1", "2", "3"].includes(size)) { continue; }
            if ( (dir === undefined) || (dir === "U") ) {
                // Load "up" version
                let insert = symbols.get(size!)[1];
                insert = insert.replace(` id="">`, ` id="${colour}${size}UP">`);
                insert = insert.replace(`data-playerfill="true"`, `fill="${rgb}"`);
                svgStr += insert;
            } else {
                // Load "flat" version
                let insert = symbols.get(size!)[0];
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

            if ( (p.length < 3) || (p.length > 4) ) { continue; }
            let colour = p.slice(0, 2);
            let size = p[2];
            let dir: string;
            if (p.length === 4) {
                dir = p[3];
            }
            const rgb = colours.get(colour);
            if (rgb === undefined) { continue; }
            if (! ["1", "2", "3"].includes(size)) { continue; }
            if ( (dir === undefined) || (dir === "U") ) {
                // Place "up" version
                svgStr += `<use href="#${colour}${size}UP" x="${x}" y="${y}" height="180" width="180"></use>`;
            } else {
                // Place "flat" version
                if (! ["N", "E", "S", "W"].includes(dir)) { continue; }
                let deg = 0;
                if (dir === "E") {
                    deg = 90;
                } else if (dir === "S") {
                    deg = 180;
                } else if (dir === "W") {
                    deg = 270;
                }
                if (deg !== 0) {
                    svgStr += `<use href="#${colour}${size}FLAT" x="${x}" y="${y}" height="180" width="180" transform="rotate(${deg} ${cx} ${cy})"></use>`;
                } else {
                    svgStr += `<use href="#${colour}${size}FLAT" x="${x}" y="${y}" height="180" width="180"></use>`;
                }
            }
        }

        // Terminate
        svgStr += `</svg>`
        return svgStr;
    };

    let svgResults: string;
    if ($game.koanType === "1dpyramids") {
        svgResults = processSvg();
    }

    let modalDelete = "";
    const deleteKoan = () => {
        // Subtract 1 from each guess index greater than the koan number
        if ($game.hasOwnProperty("guesses")) {
            for (let i = 0; i < $game.guesses.length; i++) {
                if ($game.guesses[i].index > koanNum) {
                    $game.guesses[i].index--;
                    $game = $game;
                }
            }
        }
        // Remove koan from the list
        $game.koans.splice(koanNum, 1);
        $game = $game;
        pushGame();
        modalDelete = "";
    };

    let modalExpand = "";
    const expandKoan = () => {
        if ( (koanNum !== undefined) && (! noExpand) && ($game.koanType !== "text") ) {
            modalExpand = "is-active";
        }
    };
</script>

{#if ( (koanStr === undefined) && (koanNum === undefined) ) }
    <p class="is-danger">The developer screwed up. The ViewKoan component needs to receive either a number or a string.</p>
{:else}
<article class="media">
    {#if koanNum !== undefined}
        <div class="media-left">
            <p class="subtitle">{koanNum + 1}</p>
        </div>
    {/if}
        <div class="media-content" on:click="{expandKoan}">
        {#if $game.koanType === "image"}
            <figure class="koan image is-square">
                <img src="{koanStr}" alt="Undescribed koan">
            </figure>
        {:else if $game.koanType === "math"}
            <figure class="koan">
                <p>{@html equation}</p>
            </figure>
        {:else if $game.koanType === "1dpyramids"}
            <figure class="koan pyramidkoan">
                {@html svgResults}
            </figure>
        {:else}
            <figure class="koan text-koan content">
                <p>{koanStr}</p>
            </figure>
        {/if}
        </div>
    {#if htbn !== undefined}
        <div class="media-right">
        {#if htbn}
            <span class="icon">
                <i class="fa-solid fa-check" aria-hidden="true"></i>
            </span>
        {:else}
            <span class="icon">
                <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </span>
        {/if}
        {#if $game.master === $peer.id}
            <button class="button is-normal is-responsive" on:click="{toggleNature}">
                <span class="icon" aria-label="Toggle Buddha nature" title="Toggle Buddha nature">
                    <i class="fa-solid fa-right-left" aria-hidden="true"></i>
                </span>
            </button>
            <button class="button is-normal is-responsive" on:click="{() => modalDelete = "is-active"}">
                <span class="icon" aria-label="Delete koan" title="Delete koan">
                    <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                </span>
            </button>
        {/if}
        </div>
    {/if}
    </article>
{/if}

<div class="modal {modalDelete}" id="confirmDelete">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Delete Koan?</p>
        </header>
        <section class="modal-card-body">
            <p><strong>This action cannot be undone!</strong> Avoid deleting koans if possible. It's better to just change its nature. Deleting koans can confuse players in the moment and when looking back at past guesses. You also can't replace them. Any new koan you add in its place will appear at the end of the list.</p>
        </section>
        <footer class="modal-card-foot">
            <button class="button is-success" on:click="{deleteKoan}">Delete Koan</button>
            <button class="button" on:click="{() => {modalDelete = ""}}">Cancel</button>
        </footer>
    </div>
</div>

<div class="modal {modalExpand}" id="expandKoan">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Expand Koan</p>
        </header>
        <section class="modal-card-body">
        {#if modalExpand === "is-active"}
            <svelte:self koanNum={koanNum} noExpand={true}/>
        {/if}
        </section>
        <footer class="modal-card-foot">
            <button class="button" on:click="{() => {modalExpand = ""}}">Close</button>
        </footer>
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Inconsolata&display=swap');
    .fa-check {
        color: green;
    }
    .fa-xmark {
        color: red;
    }
    .text-koan {
        font-family: 'Inconsolata', monospace;
    }
</style>
