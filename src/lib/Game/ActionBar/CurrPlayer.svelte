<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peer } from "@/stores/writePeerObj";
    import { commitGame } from "@/lib/gameSync";
    import AddKoan from "./AddKoan.svelte";
    import MakeGuess from "./MakeGuess.svelte";
    import PendingGuess from "./CurrPlayer/PendingGuess.svelte";

    const passTurn = () => {
        const myId = $peer.id;
        commitGame((g) => {
            if (!g.students?.length) {
                return;
            }
            const idx = g.students.findIndex((s) => s.id === myId);
            if (idx !== -1) {
                const newidx = idx + 1;
                g.currplayer =
                    newidx < g.students.length ? g.students[newidx].id : g.students[0].id;
            } else {
                g.currplayer = g.students[0].id;
            }
        }, `|${myId}| ended their turn.`);
    };

    let myGuesses = 0;
    game.subscribe((obj) => {
        if ( (obj.hasOwnProperty("students")) && (obj.students !== undefined) ) {
            const idx = obj.students.findIndex(s => s.id === $peer.id);
            if (idx !== -1) {
                myGuesses = obj.students[idx].guesses;
            }
        }
    });
</script>

<div class="box">
    <p class="content">
        It is your turn. You must add a koan and then may optionally make a guess if you have any guessing stones. When you're done, click "End Turn."
    </p>
{#if (! $game.hasOwnProperty("koanPending"))}
    <AddKoan/>
{/if}

{#if ( (myGuesses > 0) && (! $game.hasOwnProperty("guessPending")) ) }
    <MakeGuess/>
{:else if ($game.hasOwnProperty("guessPending"))}
    <PendingGuess/>
{/if}

    <p class="control">
        <button class="button" on:click="{passTurn}">
            End Turn
        </button>
    </p>
</div>
