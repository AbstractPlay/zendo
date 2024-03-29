<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peer } from "@/stores/writePeerObj";
    import { peers } from "@/stores/writePeers";
    import type { ZendoGameMessages } from "@/schemas/messages";
    import type { ZendoGameState } from "@/schemas/game";
    import { onMount } from "svelte";
    import { Buffer } from "buffer";
    import pako from "pako";

    onMount(() => {
        $peer.on("open", () => {
            const urlParams = new URLSearchParams(window.location.search);
            const hasCode = urlParams.has("import");
            if (hasCode) {
                importedCode = urlParams.get("import");
                importGame();
            }
        });
    });

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

    const becomeMaster = () => {
        $game.master = $peer.id;
        pushGame(`|${$peer.id}| has become the master.`);
    };

    let modalImport = "";
    let importedCode: string|null;
    const importGame = () => {
        if (importedCode !== null) {
            let inflated: string;
            if (importedCode.startsWith("{")) {
                inflated = importedCode;
            } else {
                const decoded = Buffer.from(importedCode, "base64");
                inflated = pako.inflate(decoded, {to: "string"});
            }
            let obj: ZendoGameState;
            try {
                obj = JSON.parse(inflated) as ZendoGameState;
            } catch {
                return;
            }
            if ( (! obj.hasOwnProperty("koanType")) || (obj.koanType === undefined) ) {
                return;
            }
            $game.master = $peer.id;
            $game.koanType = obj.koanType;
            if ( (obj.hasOwnProperty("welcome")) && (obj.welcome !== undefined) ) {
                $game.welcome = obj.welcome;
            }
            if ( (obj.hasOwnProperty("guesses")) && (obj.guesses !== undefined) ) {
                $game.guesses = [...obj.guesses];
            }
            if ( (obj.hasOwnProperty("koans")) && (obj.koans !== undefined) ) {
                $game.koans = [...obj.koans];
            }
            pushGame(`|${$peer.id}| has imported a game.`);
            modalImport = "";
        }
    };
</script>

<div class="box">
    <p class="content">
        <a href="https://www.looneylabs.com/content/zendo">Game Rules</a>
    </p>
    <div class="level">
        <div class="level-item">
            <p class="control">
                <button class="button" on:click="{becomeMaster}">
                    Become the Master
                </button>
            </p>
        </div>
        <div class="level-item">
            <p class="control">
                <button class="button" on:click="{() => modalImport = "is-active"}">
                    Import Saved Game
                </button>
            </p>
        </div>
    </div>
</div>

<div class="modal {modalImport}">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Import Game</p>
        </header>
        <section class="modal-card-body">
            <p class="content">Paste the code you saved or downloaded previously. You will automatically become the master of the renewed dojo.</p>
            <div class="control">
                <textarea class="textarea" rows="5" placeholder="Paste code here" id="pastedCode" bind:value="{importedCode}"></textarea>
            </div>
        </section>
        <footer class="modal-card-foot">
            <button class="button is-primary" on:click="{importGame}">Import</button>
            <button class="button is-success" on:click="{() => modalImport = ""}">Close</button>
        </footer>
    </div>
</div>
