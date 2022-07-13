<script lang="ts">
    import { Buffer } from "buffer";
    import type { ZendoGameMessages } from "@/schemas/messages";
    import { game } from "@/stores/writeGame";
    import { peers } from "@/stores/writePeers";
    import { observers } from "@/stores/derivedObservers";
    import AddKoan from "./AddKoan.svelte";
    import MarkKoan from "./Master/MarkKoan.svelte";
    import ReviewGuess from "./Master/ReviewGuess.svelte";

    const pushGame = () => {
        const msg: ZendoGameMessages = {
            type: "gameReplace",
            game: JSON.stringify($game)
        }
        for (const p of $peers) {
            p.connection.send(msg);
        }
    };

    let welcomeCommitted = true;
    const handleWelcomeKeydown = (event) => {
		if (event.key === 'Enter') {
            pushGame();
            welcomeCommitted = true;
        }
    }

    const obfuscate = (txt: string = ""): string => {
        return Buffer.from(txt, "binary").toString('base64');
    };
    const clarify = (txt: string = ""): string => {
        return Buffer.from(txt, 'base64').toString('binary');
    };
    let ruleCommitted = true;
    let clearRule = "";
    game.subscribe((obj) => {clearRule = clarify(obj.rule)});
    const handleRuleKeydown = (event) => {
		if (event.key === 'Enter') {
            $game.rule = obfuscate(clearRule);
            pushGame();
            ruleCommitted = true;
        }
    };

    let selectedObserver = "";
    const admit = () => {
        if (selectedObserver.length > 0) {
            if (! $game.hasOwnProperty("students")) {
                $game.students = [];
            }
            $game.students.push({id: selectedObserver, guesses: 0});
            $game = $game;
            pushGame();
        }
    };

    let koanType = "text";
    const chooseType = () => {
        if ( (koanType === "text") || (koanType === "image") || (koanType === "math") || (koanType === "2dpyramids") ) {
            $game.koanType = koanType;
            $game = $game;
            pushGame();
        } else {
            alert(`Invalid koan type selected (${koanType}).`)
        }
    };

    let expandInstructions = true;
</script>

<div class="box">
{#if $game.hasOwnProperty("koanType")}
    <div class="card" id="instructionBox">
        <header class="card-header">
            <p class="card-header-title">Instructions</p>
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
            <input class="input {welcomeCommitted ? "is-success" : "is-warning"}" type="text" placeholder="Pinned to the top of the play area. Supports Markdown." id="WelcomeMsg" bind:value="{$game.welcome}" on:keydown="{handleWelcomeKeydown}" on:input="{() => welcomeCommitted = false}">
        </div>
    </div>
    <div class="field">
        <label class="label" for="SecretRule">Secret Rule</label>
        <div class="control">
            <input class="input {ruleCommitted ? "is-success" : "is-warning"}" type="text" id="SecretRule" bind:value="{clearRule}" on:keydown="{handleRuleKeydown}" on:input="{() => ruleCommitted = false}">
        </div>
        <p class="help">Optional and generally not needed if you're already on a voice connection with everyone. It does make it easy for someone to take over for you, but it also means determined cheaters could see the rule.</p>
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
    <AddKoan/>

    {#if $game.hasOwnProperty("koanPending")}
        <MarkKoan/>
    {:else if $game.hasOwnProperty("guessPending")}
        <ReviewGuess/>
    {/if}
{:else}
    <div class="control">
        <label class="radio">
            <input type="radio" bind:group={koanType} name="koanType" value={"text"}>
            Text koans (words, numbers, etc.)
        </label><br>
        <label class="radio">
            <input type=radio bind:group={koanType} name="koanType" value={"image"}>
            Image koans
        </label><br>
        <label class="radio">
            <input type=radio bind:group={koanType} name="koanType" value={"2dpyramids"}>
            2D pyramid koans
        </label><br>
        <label class="radio">
            <input type=radio bind:group={koanType} name="koanType" value={"math"}>
            Math koans (powered by <a href="https://katex.org/">KaTeX</a>)
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