<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peer } from "@/stores/writePeerObj";
    import { commitGame } from "@/lib/gameSync";
    import {
        fetchGraphvizSvg,
        downloadSvgBlob,
        fetchPlantUmlSvg,
        isSvgDownloadReady,
        loadCardsRenderers,
        pyramidColourMap,
        renderCardsSvg,
        renderMathHtml,
        renderSyncKoanSvg,
    } from "@/lib/viewKoanRender";

    const koanSvgScope = `z-${crypto.randomUUID().replace(/-/g, "")}-`;

    export let koanNum: number | undefined = undefined;
    export let koanStr: string | undefined = undefined;
    export let noExpand = false;

    $: displayStr =
        koanStr ??
        (koanNum !== undefined && $game.koans !== undefined ? $game.koans[koanNum]?.string : undefined);

    $: displayHtbn =
        koanStr !== undefined
            ? undefined
            : koanNum !== undefined && $game.koans !== undefined
              ? $game.koans[koanNum]?.htbn
              : undefined;

    $: displayNum = koanStr !== undefined ? undefined : koanNum;

    $: masterColours = pyramidColourMap($game.colours);

    $: equation =
        $game.koanType === "math" && displayStr !== undefined ? renderMathHtml(displayStr) : "";

    let svgResults = "";

    $: if (displayStr === undefined || $game.koanType === undefined) {
        svgResults = "";
    } else {
        const type = $game.koanType;
        const str = displayStr;
        const colours = masterColours;

        if (type === "1dpyramids" || type === "2dpyramids" || type === "dotmatrix") {
            svgResults = renderSyncKoanSvg(type, str, colours, koanSvgScope);
        } else if (type === "1dcards" || type === "2dcards") {
            svgResults = "Loading cards…";
            const captured = str;
            const capturedType = type;
            loadCardsRenderers().then((renderers) => {
                if (displayStr !== captured || $game.koanType !== capturedType) {
                    return;
                }
                svgResults = renderCardsSvg(capturedType, captured, renderers, koanSvgScope);
            });
        } else if (type === "graphviz") {
            svgResults = "Rendering…";
            const captured = str;
            fetchGraphvizSvg(captured)
                .then((svg) => {
                    if (displayStr !== captured || $game.koanType !== "graphviz") {
                        return;
                    }
                    svgResults = svg;
                })
                .catch((err) => {
                    if (displayStr === captured && $game.koanType === "graphviz") {
                        svgResults = String(err);
                    }
                });
        } else if (type === "plantuml" && str.length > 0) {
            svgResults = "Rendering…";
            const captured = str;
            fetchPlantUmlSvg(captured)
                .then((txt) => {
                    if (displayStr !== captured || $game.koanType !== "plantuml") {
                        return;
                    }
                    svgResults = txt;
                })
                .catch((e) => {
                    if (displayStr === captured && $game.koanType === "plantuml") {
                        svgResults = String(e);
                    }
                });
        } else {
            svgResults = "";
        }
    }

    const toggleNature = () => {
        const n = displayNum;
        if ($game.koans !== undefined && n !== undefined) {
            commitGame((g) => {
                if (g.koans?.[n]) {
                    g.koans[n].htbn = !g.koans[n].htbn;
                }
            }, `Koan ${n}'s Buddha nature was toggled.`);
        }
    };

    let modalDelete = "";
    const deleteKoan = () => {
        const n = displayNum;
        if ($game.koans !== undefined && n !== undefined) {
            commitGame((g) => {
                if (g.guesses) {
                    for (let i = 0; i < g.guesses.length; i++) {
                        if (g.guesses[i].index > n) {
                            g.guesses[i].index--;
                        }
                    }
                }
                g.koans?.splice(n, 1);
            }, `Koan ${n} was removed, and everything was renumbered accordingly.`);
            modalDelete = "";
        }
    };

    let modalExpand = "";
    const expandKoan = () => {
        if (displayNum !== undefined && !noExpand && $game.koanType !== "text") {
            modalExpand = "is-active";
        }
    };

    $: svgDownloadReady = isSvgDownloadReady(svgResults);

    const downloadKoanSvg = () => {
        if (!svgDownloadReady) {
            return;
        }
        downloadSvgBlob(
            svgResults,
            `Koan_${(displayNum ?? 0) + 1}_${new Date().toISOString()}.svg`,
        );
    };
</script>

{#if koanStr === undefined && koanNum === undefined}
    <p class="is-danger">
        The developer screwed up. The ViewKoan component needs to receive either a number or a string.
    </p>
{:else}
    <article class="media">
        {#if displayNum !== undefined}
            <div class="media-left">
                <p class="subtitle">{displayNum + 1}</p>
            </div>
        {/if}
        <div class="media-content" on:click={expandKoan}>
            {#if $game.koanType === "image"}
                <figure class="koan image is-square">
                    <img src={displayStr} alt="Undescribed koan" />
                </figure>
            {:else if $game.koanType === "math"}
                <figure class="koan">
                    <p>{@html equation}</p>
                </figure>
            {:else if $game.koanType === "1dpyramids" || $game.koanType === "2dpyramids"}
                <figure class="koan pyramidkoan">
                    {@html svgResults}
                </figure>
            {:else if $game.koanType === "1dcards" || $game.koanType === "2dcards"}
                <figure class="koan cardkoan">
                    {@html svgResults}
                </figure>
            {:else if $game.koanType === "dotmatrix"}
                <figure class="koan dotmatrixkoan">
                    {@html svgResults}
                </figure>
            {:else if $game.koanType === "graphviz" || $game.koanType === "plantuml"}
                <figure class="koan graphkoan">
                    {@html svgResults}
                </figure>
            {:else}
                <figure class="koan textkoan content">
                    <p>{displayStr}</p>
                </figure>
            {/if}
        </div>
        {#if displayHtbn !== undefined}
            <div class="media-right">
                {#if displayHtbn}
                    <span class="icon">
                        <i class="fa-solid fa-check" aria-hidden="true"></i>
                    </span>
                {:else}
                    <span class="icon">
                        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                    </span>
                {/if}
                {#if $game.master === $peer.id && !noExpand}
                    <button class="button is-normal is-responsive" on:click={toggleNature}>
                        <span class="icon" aria-label="Toggle Buddha nature" title="Toggle Buddha nature">
                            <i class="fa-solid fa-right-left" aria-hidden="true"></i>
                        </span>
                    </button>
                    <button class="button is-normal is-responsive" on:click={() => (modalDelete = "is-active")}>
                        <span class="icon" aria-label="Delete koan" title="Delete koan">
                            <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                        </span>
                    </button>
                {/if}
                {#if $game.koanType === "1dpyramids" || $game.koanType === "2dpyramids" || $game.koanType === "1dcards" || $game.koanType === "2dcards" || $game.koanType === "dotmatrix" || $game.koanType === "graphviz" || $game.koanType === "plantuml"}
                    <button
                        class="button is-normal is-responsive"
                        type="button"
                        disabled={!svgDownloadReady}
                        aria-label="Download koan"
                        title={svgDownloadReady ? "Download koan" : "Wait for koan to finish rendering"}
                        on:click={downloadKoanSvg}
                    >
                        <span class="icon">
                            <i class="fa-solid fa-download" aria-hidden="true"></i>
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
            <p>
                <strong>This action cannot be undone!</strong> Avoid deleting koans if possible. It's better to just
                change its nature. Deleting koans can confuse players in the moment and when looking back at past
                guesses. You also can't replace them. Any new koan you add in its place will appear at the end of the
                list.
            </p>
        </section>
        <footer class="modal-card-foot">
            <button class="button is-success" on:click={deleteKoan}>Delete Koan</button>
            <button class="button" on:click={() => (modalDelete = "")}>Cancel</button>
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
            <div>
                {#if modalExpand === "is-active"}
                    <svelte:self koanNum={displayNum} koanStr={koanStr} noExpand={true} />
                {/if}
            </div>
            {#if $game.koanType !== "text" && $game.koanType !== "image"}
                <div>
                    <pre>{displayStr}</pre>
                </div>
            {/if}
        </section>
        <footer class="modal-card-foot">
            <button class="button" on:click={() => (modalExpand = "")}>Close</button>
        </footer>
    </div>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Inconsolata&display=swap");
    .fa-check {
        color: green;
    }
    .fa-xmark {
        color: red;
    }
    .textkoan {
        font-family: "Inconsolata", monospace;
    }
</style>
