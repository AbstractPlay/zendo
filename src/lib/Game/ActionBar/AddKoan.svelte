<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peer } from "@/stores/writePeerObj";
    import { peers } from "@/stores/writePeers";
    import type { ZendoGameMessages } from "@/schemas/messages";
    import ViewKoan from "../ViewKoan.svelte";

    let modalAdd = "";
    let koanStr = "";
    let placeholder = "Text koans are presented exactly as entered";
    if ($game.koanType === "image") {
        placeholder = "Drop your image on the field above to generate this string."
    } else if ($game.koanType === "math") {
        placeholder = "Enter in TeX or LaTeX format, without delimiters"
    }

    let files: FileList;
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

    const pushGame = () => {
        const msg: ZendoGameMessages = {
            type: "gameReplace",
            game: JSON.stringify($game)
        }
        for (const p of $peers) {
            p.connection.send(msg);
        }
    };

    let hasNature = false;
    let call: "master" | "mondo" = "master";
    const submitKoan = () => {
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
        pushGame();
        modalAdd = "";
        koanStr = "";
        files = undefined;
    };
</script>

<p class="control">
    <button class="button" on:click="{() => {modalAdd = "is-active"}}">
        Add Koan
    </button>
</p>

<div class="modal {modalAdd}" id="addKoan">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Add {$game.koanType.charAt(0).toUpperCase() + $game.koanType.slice(1)} Koan</p>
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
                <div class="control">
                    <input class="input" type="text" placeholder="{placeholder}" id="koanStr" bind:value="{koanStr}">
                </div>
                <p class="help">
                {#if $game.koanType === "math"}
                    No delimiters are needed. Just enter the formula using <a href="https://katex.org/docs/supported.html" target="_NEW">supported TeX or LaTeX notation</a>.
                {:else if $game.koanType === "image"}
                    Images must be square.
                {/if}
                </p>
            </div>
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
