<script lang="ts">
    import type { ZendoGameMessages } from "@/schemas/messages";
    import { peers } from "@/stores/writePeers";
    import { game } from "@/stores/writeGame";
    import { peer } from "@/stores/writePeerObj";
    import MarkKoan from "./Global/MarkKoan.svelte";
import PendingGuess from "./Global/PendingGuess.svelte";

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
</script>

<div class="box">
    <div class="content">
        <p>
            <a href="https://www.looneylabs.com/content/zendo" target="_NEW">Game Rules</a>
        </p>
    {#if isStudent}
        <p>It's not your turn yet. Please wait.</p>
    {/if}
    </div>
{#if ( (isStudent) && ($game.hasOwnProperty("koanPending")) && ($game.koanPending.call === "mondo") )}
    <MarkKoan/>
{/if}

{#if $game.hasOwnProperty("guessPending")}
    <PendingGuess/>
{/if}

    <div class="content space-above">
        <p class="control">
            <button class="button" on:click="{() => {modalAbandon = "is-active"}}">
                Abandon Game
            </button>
        </p>
    </div>
</div>

<div class="modal {modalAbandon}" id="confirmAbandon">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Are you sure you want to abandon the game?</p>
        </header>
        <section class="modal-card-body">
            <p>Abandoning the game will cause you to disconnect from all peers. Your version of the game will be marked as terminated so you can see the final game state, including the secret rule if the master entered it. The game will continue for everybody else.</p>
        </section>
        <footer class="modal-card-foot">
            <button class="button is-success" on:click="{abandonGame}">Abandon Game</button>
            <button class="button" on:click="{() => {modalAbandon = ""}}">Cancel</button>
        </footer>
    </div>
</div>

<style>
    .space-above {
        margin-top: 1em;
    }
</style>