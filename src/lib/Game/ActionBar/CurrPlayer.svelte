<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peer } from "@/stores/writePeerObj";
    import { peers } from "@/stores/writePeers";
    import type { ZendoGameMessages } from "@/schemas/messages";
    import AddKoan from "./AddKoan.svelte";
    import MakeGuess from "./MakeGuess.svelte";
    import PendingGuess from "./CurrPlayer/PendingGuess.svelte";

    const pushGame = () => {
        const msg: ZendoGameMessages = {
            type: "gameReplace",
            game: JSON.stringify($game)
        }
        for (const p of $peers) {
            p.connection.send(msg);
        }
    };

    const passTurn = () => {
        const idx = $game.students.findIndex(s => s.id === $peer.id);
        if (idx !== -1) {
            const newidx = idx + 1;
            if (newidx < $game.students.length) {
                $game.currplayer = $game.students[newidx].id;
            } else {
                $game.currplayer = $game.students[0].id;
            }
        } else {
            if ( ($game.hasOwnProperty("students")) && ($game.students.length > 0) ) {
                $game.currplayer = $game.students[0].id;
            }
        }
        $game = $game;
        pushGame();
    };

    let myGuesses = 0;
    game.subscribe((obj) => {
        if (obj.hasOwnProperty("students")) {
            const idx = obj.students.findIndex(s => s.id === $peer.id);
            if (idx !== -1) {
                myGuesses = obj.students[idx].guesses;
            }
        }
    });
</script>

<div class="box">
    <p class="content">
        It is your turn. You must add a koan and then may optionally make a guess if you have any guessing stones. When you're done, click "End Turn"
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
