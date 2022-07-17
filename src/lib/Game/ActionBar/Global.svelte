<script lang="ts">
    import type { ZendoGameMessages } from "@/schemas/messages";
    import { peers } from "@/stores/writePeers";
    import { game } from "@/stores/writeGame";
    import { peer } from "@/stores/writePeerObj";
    import { myName } from "@/stores/writeMyName";
    import type { ZendoGameState } from "@/schemas/game";
    import MarkKoan from "./Global/MarkKoan.svelte";
    import PendingGuess from "./Global/PendingGuess.svelte";

    const id2name = (id: string): string => {
        const idx = $peers.findIndex((rec) => rec.id === id);
        if (idx !== -1) {
            if ($peers[idx].alias !== undefined) {
                return $peers[idx].alias;
            } else {
                return id;
            }
        } else if (id === $peer.id) {
            return $myName;
        } else {
            return id;
        }
    };

    let modalAbandon = "";
    const abandonGame = () => {
        modalAbandon = "";
        // Tell everyone that you're leaving
        const msg: ZendoGameMessages = {
            type: "notifyAbandon"
        };
        for (const p of $peers) {
            p.connection.send(msg);
            while (p.connection.bufferSize > 0) {}
        }

        // Mark the game as terminated so you can see the final state
        $game.winner = null;

        // Disconnect
        $peer.destroy();
    };

    let isStudent = false;
    game.subscribe((obj) => {
        if (obj.hasOwnProperty("students")) {
            const idx = obj.students.findIndex(s => s.id === $peer.id);
            if (idx !== -1) {
                isStudent = true;
            }
        }
    });

    let modalExport = "";
    let exportedGame: ZendoGameState;
    let exportDataStr: string;
    game.subscribe((obj) => {
        exportedGame = {} as ZendoGameState;
        if (obj.hasOwnProperty("koanType")) {
            exportedGame.koanType = obj.koanType;
        }
        if (obj.hasOwnProperty("welcome")) {
            exportedGame.welcome = obj.welcome;
        }
        if (obj.hasOwnProperty("guesses")) {
            exportedGame.guesses = [...obj.guesses];
            exportedGame.guesses.map(g => g.student = id2name(g.student));
        }
        if (obj.hasOwnProperty("koans")) {
            exportedGame.koans = [...obj.koans];
        }
        exportDataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportedGame));
    });
</script>

<div class="box">
    <div class="level">
        <div class="level-item">
            <p class="content">
                <a href="https://www.looneylabs.com/content/zendo">Game Rules</a>
            </p>
        </div>
    {#if ( ($game.hasOwnProperty("koanType")) && ($game.koanType === "image") )}
        <div class="level-item">
            <p class="content">
                <a href="https://drive.google.com/drive/folders/0Bw8J0V9P_9hMMzNfQ3E1bFY2REE?resourcekey=0-5Dfs8omE96Run7WgnE5axw&usp=sharing">Archive of Povray koans</a>
            </p>
        </div>
    {/if}
    </div>
    <div class="content">
    {#if ( (isStudent) && ($game.currplayer !== $peer.id) )}
        <p>It's not your turn yet. Please wait.</p>
    {/if}
    </div>
{#if ( (isStudent) && ($game.hasOwnProperty("koanPending")) && ($game.koanPending.call === "mondo") )}
    <MarkKoan/>
{/if}

{#if $game.hasOwnProperty("guessPending")}
    <PendingGuess/>
{/if}

    <div class="level">
        <div class="level-item">
            <p class="control">
                <button class="button" on:click="{() => {modalExport = "is-active"}}">
                    Export Game
                </button>
            </p>
        </div>
        <div class="level-item">
            <p class="control">
                <button class="button" on:click="{() => {modalAbandon = "is-active"}}">
                    Abandon Game
                </button>
            </p>
        </div>
    </div>
</div>

<div class="modal {modalAbandon}" id="confirmAbandon">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Are you sure you want to abandon the game?</p>
        </header>
        <section class="modal-card-body">
            <p>Abandoning the game will cause you to disconnect from all peers. Your version of the game will be marked as terminated, but the game will continue for everybody else.</p>
        </section>
        <footer class="modal-card-foot">
            <button class="button is-success" on:click="{abandonGame}">Abandon Game</button>
            <button class="button" on:click="{() => {modalAbandon = ""}}">Cancel</button>
        </footer>
    </div>
</div>

<div class="modal {modalExport}" id="viewExport">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Export Game</p>
        </header>
        <section class="modal-card-body">
            <div class="content">
                <p>The following code is a record of the game's current state that can be reloaded into the client at a later time for review.</p>
                <ul>
                    <li>You can <a href="{exportDataStr}" download="ZendoGame_{(new Date()).toISOString()}.json">click here to download it</a> as a file.</li>
                    <li>You can copy and paste it:<br><code>{JSON.stringify(exportedGame)}</code></li>
                    <li>You can save/share this URL for quick access:<br><a href="https://www.perlkonig.com/zendo/?import={encodeURIComponent(JSON.stringify(exportedGame))}"><code>https://www.perlkonig.com/zendo/?import={encodeURIComponent(JSON.stringify(exportedGame))}</code></a></li>
                </ul>
            </div>
        </section>
        <footer class="modal-card-foot">
            <button class="button is-success" on:click="{() => modalExport = ""}">Close</button>
        </footer>
    </div>
</div>

<style>
</style>