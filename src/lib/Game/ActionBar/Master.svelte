<script lang="ts">
    import { Buffer } from "buffer";
    import type { ZendoGameMessages } from "@/schemas/messages";
    import { game } from "@/stores/writeGame";
    import { peers } from "@/stores/writePeers";
    import { observers } from "@/stores/derivedObservers";
    import AddKoan from "./AddKoan.svelte";
    import MarkKoan from "./Master/MarkKoan.svelte";
    import ReviewGuess from "./Master/ReviewGuess.svelte";
    import ChangeColours from "./Master/ChangeColours.svelte";
    import { colours } from "@/stores/writeColours";

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

    let welcomeCommitted = true;
    const saveWelcomeMsg = () => {
        pushGame(`Welcome message updated.`);
        welcomeCommitted = true;
    }

    let selectedObserver = "";
    const admit = () => {
        if (selectedObserver.length > 0) {
            if ( (! $game.hasOwnProperty("students")) || ($game.students === undefined) ) {
                $game.students = [];
            }
            $game.students.push({id: selectedObserver, guesses: 0});
            $game = $game;
            pushGame(`|${selectedObserver}| was admitted to the dojo.`);
        }
    };

    let koanType = "text";
    const chooseType = () => {
        if ( (koanType === "text") || (koanType === "image") || (koanType === "math") || (koanType === "1dpyramids") || (koanType === "dotmatrix") || (koanType === "graphviz") || (koanType === "2dpyramids") || (koanType === "1dcards") || (koanType === "2dcards") || (koanType === "plantuml") ) {
            $game.koanType = koanType;
            // set default colours
            if (koanType.endsWith("pyramids")) {
                $game.colours = [...$colours.entries()].map(([abbrev, rgb]) => {return {abbreviation: abbrev, hex: rgb}}) as [{abbreviation: string; hex: string}, ...{abbreviation: string; hex: string}[]];
            }
            $game = $game;
            pushGame(`Koan type set to ${koanType}.`);
        } else {
            alert(`Invalid koan type selected (${koanType}).`)
        }
    };

    let expandInstructions = true;
</script>

<div class="box">
{#if $game.hasOwnProperty("koanType") && $game.koanType !== undefined}
    <div class="card" id="instructionBox">
        <header class="card-header">
            <p class="card-header-title" on:click="{() => expandInstructions = !expandInstructions}">Instructions</p>
            <button class="card-header-icon" aria-label="toggle instructions" title="toggle instructions" on:click="{() => expandInstructions = !expandInstructions}">
            {#if expandInstructions}
                <span class="icon">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
            {:else}
                <span class="icon">
                    <i class="fa-solid fa-angle-left" aria-hidden="true"></i>
                </span>
            {/if}
            </button>
        </header>
    {#if expandInstructions}
        <div class="card-content content">
            <p>You can invite people to your dojo immediately. It's recommended to include a short welcome message that lays out the ground rules for the game, including the exact nature of the koans. You can use <a href="https://www.markdownguide.org/basic-syntax">Markdown</a> format to add links if helpful.</p>

            <p>The hardest part about being master is choosing a rule that is the right difficulty. Read <a href="https://www.looneylabs.com/content/zendo">Looney Labs's Zendo rules page for a downloadable PDF with good guidance for budding masters.</a></p>

            <p>As people join, you can add them as students. Once you've added your initial two koans, you can select a starting player and the game will try to automatically keep the player order going, but you can assign the current player at any time.</p>
        </div>
    {/if}
    </div>
    <div class="field">
        <label class="label" for="WelcomeMsg">Welcome Message</label>
        <div class="control">
            <textarea class="textarea {welcomeCommitted ? "is-success" : "is-warning"}" placeholder="Pinned to the top of the play area. Supports Markdown." rows="3" id="WelcomeMsg" bind:value="{$game.welcome}" on:input="{() => welcomeCommitted = false}"></textarea>
        </div>
        <button class="button" on:click={saveWelcomeMsg}>Save Welcome Message</button>
    </div>
    {#if $observers.length > 0}
        <div class="field">
            <label class="label" for="observerSelect">Select observers to admit as students</label>
            <div class="select">
                <select id="observerSelect" bind:value="{selectedObserver}">
                {#each $observers as o}
                    <option value="{o.id}">{o.alias}</option>
                {/each}
                </select>
            </div>
            <p class="control">
                <button class="button" on:click="{admit}">
                    Admit to Dojo
                </button>
            </p>
        </div>
    {/if}
{#if $game.koanType === "1dpyramids" || $game.koanType === "2dpyramids"}
    <ChangeColours />
{/if}
    <AddKoan/>

    {#if $game.hasOwnProperty("koanPending")}
        <MarkKoan/>
    {:else if $game.hasOwnProperty("guessPending")}
        <ReviewGuess/>
    {/if}
{:else}
    <p class="subtitle">Choose dojo type (cannot be changed):</p>
    <div class="control">
        <label class="radio">
            <input type="radio" bind:group={koanType} name="koanType" value={"text"}>
            Text (words, numbers, etc.)
        </label><br>
        <label class="radio">
            <input type=radio bind:group={koanType} name="koanType" value={"image"}>
            Images (square)
        </label><br>
        <label class="radio">
            <input type=radio bind:group={koanType} name="koanType" value={"1dpyramids"}>
            1D pyramids
        </label><br>
        <label class="radio">
            <input type=radio bind:group={koanType} name="koanType" value={"2dpyramids"}>
            2D pyramids
        </label><br>
        <label class="radio">
            <input type=radio bind:group={koanType} name="koanType" value={"1dcards"}>
            1D playing cards
        </label><br>
        <label class="radio">
            <input type=radio bind:group={koanType} name="koanType" value={"2dcards"}>
            2D playing cards
        </label><br>
        <label class="radio">
            <input type=radio bind:group={koanType} name="koanType" value={"dotmatrix"}>
            Dot matrix (coloured dots on rectangular grids)
        </label><br>
        <label class="radio">
            <input type=radio bind:group={koanType} name="koanType" value={"graphviz"}>
            GraphViz (rendered by <a href="https://graphviz.org/docs/layouts/dot/">dot</a>)
        </label><br>
        <label class="radio">
            <input type=radio bind:group={koanType} name="koanType" value={"plantuml"}>
            PlantUML (<a href="https://plantuml.com/">homepage</a>)
        </label><br>
        <label class="radio">
            <input type=radio bind:group={koanType} name="koanType" value={"math"}>
            Math (powered by <a href="https://katex.org/">KaTeX</a>)
        </label>
    </div>
    <p class="control">
        <button class="button" on:click="{chooseType}">
            Select Koan Type
        </button>
    </p>
{/if}
</div>

<style>
    #instructionBox {
        margin-bottom: 1em;
    }
    .card-header-title {
        padding-bottom: 0rem;
    }
</style>