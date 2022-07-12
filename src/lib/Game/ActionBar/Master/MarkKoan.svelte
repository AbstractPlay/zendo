<script lang="ts">
    import { peers } from "@/stores/writePeers";
    import { game } from "@/stores/writeGame";
    import type {ZendoGameMessages} from "@/schemas/messages";
    import ViewKoan from "../../ViewKoan.svelte";
    import Voters from "./Voters.svelte";

    const pushGame = () => {
        const msg: ZendoGameMessages = {
            type: "gameReplace",
            game: JSON.stringify($game)
        }
        for (const p of $peers) {
            p.connection.send(msg);
        }
    };

    const markKoan = (htbn: boolean) => {
        // If mondo, distribute guessing stones
        if ($game.koanPending.call === "mondo") {
            for (const v of $game.koanPending.votes) {
                if (v.vote === htbn) {
                    const idx = $game.students.findIndex(s => s.id === v.student);
                    if (idx !== -1) {
                        $game.students[idx].guesses++;
                    }
                }
            }
        }
        // Add the koan to the list
        if (! $game.hasOwnProperty("koans")) {
            $game.koans = [];
        }
        $game.koans.push({
            string: $game.koanPending.koan,
            htbn: htbn
        });
        // Purge the pending koan
        delete $game.koanPending;
        // Push the game
        $game = $game;
        pushGame();
    };

    const rejectKoan = () => {
        delete $game.koanPending;
        $game = $game;
        pushGame();
    };
</script>

{#if $game.hasOwnProperty("koanPending")}
<section class="card">
    <header class="card-header">
        <p class="card-header-title">Mark Koan</p>
    </header>
    <div class="card-content">
        <ViewKoan koanStr={$game.koanPending.koan}/>

    {#if $game.koanPending.call === "mondo"}
        <p>Mondo has been called! <strong>Don't mark the koan until all the votes have come in.</strong> Once you mark it, no more voting is possible. The marking buttons will not appear until at least half of the students have voted.</p>

        <Voters/>
    {:else}
        <p>Master has been called! Please mark the koan.</p>
    {/if}
    </div>
    {#if ( ($game.koanPending.call === "master") || ( ($game.koanPending.hasOwnProperty("votes")) && ($game.koanPending.votes.length * 2 >= $game.students.length) ) )}
        <div class="card-footer">
            <button class="button is-success card-footer-item" on:click="{() => markKoan(true)}">Has</button>
            <button class="button is-danger card-footer-item" on:click="{() => markKoan(false)}">Has NOT</button>
            <button class="button card-footer-item" on:click="{rejectKoan}">Reject Koan</button>
        </div>
    {/if}
</section>
{:else}
    <p>Oops! The developer screwed up. You shouldn't see this component unless there's a koan pending review.</p>
{/if}

<style></style>
