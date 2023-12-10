<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peer } from "@/stores/writePeerObj";
    import { peers } from "@/stores/writePeers";
    import { rgbToHsv, rgbToInts, sortHSV } from "@/lib/ViewKoanSupport/Colours";
    import type { ZendoGameMessages } from "@/schemas/messages";
    import ViewKoan from "../ViewKoan.svelte";

    let modalAdd = "";
    let koanStr = "";
    let placeholder = "Text koans are presented exactly as entered";
    if ($game.koanType === "image") {
        placeholder = "Drop your image on the field above to generate this string"
    } else if ($game.koanType === "math") {
        placeholder = "Enter in TeX or LaTeX format, without delimiters"
    } else if ($game.koanType === "1dpyramids") {
        placeholder = "Enter a series of pyramid designations separated by whitespace";
    } else if ($game.koanType === "2dpyramids") {
        placeholder = "Enter a series of pyramid designations, separated by whitespace; use a hyphen for an empty cell";
    } else if ($game.koanType === "1dcards") {
        placeholder = "Enter a series of card designations separated by whitespace";
    } else if ($game.koanType === "2dcards") {
        placeholder = "Enter a series of card designations separated by whitespace; use a hyphen for an empty cell";
    } else if ($game.koanType === "dotmatrix") {
        placeholder = "Enter width, height, and then a string of digits";
    } else if ($game.koanType === "graphviz") {
        placeholder = "Type or paste your DOT code"
    } else if ($game.koanType === "plantuml") {
        placeholder = "Type or paste your PlantUML code"
    }

    let files: FileList|undefined;
    $: if (files) {
        const reader = new FileReader();
        reader.onloadend = () => {
            koanStr = reader.result as string;
        };
        try {
            reader.readAsDataURL(files[0]);
        } catch {
            alert("Invalid image file. Please try again.");
            koanStr = "";
        }
    }

    const pushGame = (description?: string) => {
        const msg: ZendoGameMessages = {
            type: "gameReplace",
            game: JSON.stringify($game),
            description,
        }
        for (const p of $peers) {
            p.connection.send(msg);
        }
    };

    let hasNature = false;
    let call: "master" | "mondo" = "master";
    const submitKoan = () => {
        if ($game.koans === undefined) {
            $game.koans = [];
        }
        koanStr = koanStr.replace(/\s+$/, "");
        // If master is submitting it, go directly to the play area.
        if ($game.master === $peer.id) {
            if (! $game.hasOwnProperty("koans")) {
                $game.koans = [];
            }
            $game.koans.push({string: koanStr, htbn: hasNature});
        // Otherwise, it goes for review
        } else {
            $game.koanPending = {
                koan: koanStr,
                call: call
            }
        }
        $game = $game;
        pushGame(`|${$peer.id}| submitted a koan.${call === "mondo" ? " Mondo has been called!" : ""}`);
        modalAdd = "";
        koanStr = "";
        files = undefined;
    };

    let typeDesc: string|undefined;
    if ($game.koanType !== undefined) {
        typeDesc = $game.koanType.charAt(0).toUpperCase() + $game.koanType.slice(1);
        if ($game.koanType === "1dpyramids") {
            typeDesc = "1D Pyramid";
        } else if ($game.koanType === "2dpyramids") {
            typeDesc = "2D Pyramid";
        } else if ($game.koanType === "1dcards") {
            typeDesc = "1D Playing Card";
        } else if ($game.koanType === "2dcards") {
            typeDesc = "2D Playing Card";
        } else if ($game.koanType === "dotmatrix") {
            typeDesc = "Dot Matrix";
        } else if ($game.koanType === "graphviz") {
            typeDesc = "GraphViz";
        } else if ($game.koanType === "plantuml") {
            typeDesc = "PlantUML";
        }
    }

    let colourSamples: string[] = [];
    game.subscribe((obj) => {
        if (obj.colours !== undefined) {
            let newMap = new Map<string, string>();
            for (const {abbreviation, hex} of obj.colours) {
                newMap.set(abbreviation, hex);
            }
            colourSamples = [];
            let sorted = [...newMap.entries()].sort((a, b) => sortHSV(rgbToHsv(...rgbToInts(a[1])), rgbToHsv(...rgbToInts(b[1]))));
            for (const [abbrev, rgb] of sorted) {
                colourSamples.push(`<code style="background-color: ${rgb}; color: black;">${abbrev}</code>`);
            }

        }
    });
</script>

<p class="control">
    <button class="button is-primary" on:click="{() => {modalAdd = "is-active"}}">
        Add Koan
    </button>
</p>

<div class="modal {modalAdd}" id="addKoan">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Add {typeDesc || "UNKNOWN"} Koan</p>
        </header>
        <section class="modal-card-body">
            <div class="field">
            {#if $game.koanType === "image"}
                <label class="label" for="dropZone">Drop an image file here</label>
                <div class="control">
                    <input class="input" type="file" bind:files="{files}" id="dropZone" accept="image/*">
                </div>
            {/if}
                <label class="label" for="koanStr">Koan String</label>
            {#if ( ($game.koanType === "graphviz") || ($game.koanType === "2dpyramids") || ($game.koanType === "2dcards") || ($game.koanType === "plantuml") )}
                <div class="control">
                    <textarea class="textarea" rows="5" placeholder="{placeholder}" id="koanStr" bind:value="{koanStr}"></textarea>
                </div>
            {:else}
                <div class="control">
                    <input class="input" type="text" placeholder="{placeholder}" id="koanStr" bind:value="{koanStr}">
                </div>
            {/if}
            {#if $game.koanType === "math"}
                <p class="help">
                    No delimiters are needed. Just enter the formula using <a href="https://katex.org/docs/supported.html">supported TeX or LaTeX notation</a>.
                </p>
            {:else if $game.koanType === "image"}
                <p class="help">
                    Images must be square.
                </p>
            {:else if ( ($game.koanType === "1dpyramids") || ($game.koanType === "2dpyramids") )}
                <p class="help">
                    COLOUR + SIZE + DIRECTION (case insensitive); direction can be a compass direction or an arbitrary integer; for example <code>RD1 BN2E VT3SW GN125</code>.
                </p>
            {:else if ( ($game.koanType === "1dcards") || ($game.koanType === "2dcards") )}
                <p class="help">Value: [A2-9TJQK], Suit: [CDHS], Special cards: RJ (red joker), BJ (black joker), BKR (red back), BKB (blue back)</p>
            {:else if $game.koanType === "dotmatrix"}
                <p class="help">
                    WIDTH,HEIGHT,CELLS (e.g., 2,2,1001)
                </p>
                <p class="help">
                    The digit <code>0</code> is an empty cell, <code>1</code> is black, and the digits <code>2–9</code> give a sequence of different colours.
                </p>
            {:else if $game.koanType === "graphviz"}
                <p class="help">
                    <a href="https://graphviz.org/doc/info/lang.html">DOT language reference</a>
                </p>
            {:else if $game.koanType === "plantuml"}
                <p class="help">
                    <a href="https://plantuml.com/">PlantUML language reference</a>
                </p>
            {/if}
            </div>
        {#if ( ($game.koanType === "1dpyramids") || ($game.koanType === "2dpyramids") )}
        {#key colourSamples}
            <p>
                Available colours: {@html colourSamples.join(", ")}.
            </p>
        {/key}
        {/if}
        {#if $game.master === $peer.id}
            <div class="field">
                <label class="checkbox">
                    <input type="checkbox" bind:checked="{hasNature}">
                    Has the Buddha nature?
                </label>
            </div>
        {:else}
            <div class="control">
                <label class="radio">
                    <input type="radio" bind:group={call} name="call" value={"master"}>
                    Master (only the master reviews; no guesses earned)
                </label><br>
                <label class="radio">
                    <input type=radio bind:group={call} name="call" value={"mondo"}>
                    Mondo (everyone reviews and predicts nature; guesses earned for correct predictions)
                </label>
            </div>
        {/if}
            <div class="content">
                <h4 class="subtitle">Preview</h4>
            {#key koanStr}
                <ViewKoan koanStr={koanStr}/>
            {/key}
            </div>
        </section>
        <footer class="modal-card-foot">
            <button class="button is-success" on:click="{submitKoan}">Submit Koan</button>
            <button class="button" on:click="{() => {modalAdd = ""; koanStr = "";}}">Cancel</button>
        </footer>
    </div>
</div>

<style></style>
