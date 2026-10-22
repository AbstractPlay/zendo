<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peer } from "@/stores/writePeerObj";
    import { commitGame, broadcastGame } from "@/lib/gameSync";
    import { refundGuessingStone } from "@/lib/guessingStones";

    const submitGuess = () => {
        broadcastGame(`|${$peer.id}| submitted a guess.`);
    };

    const withdrawGuess = () => {
        commitGame((g) => {
            if (g.guessPending !== undefined) {
                refundGuessingStone(g, g.guessPending.student);
            }
            delete g.guessPending;
        }, `|${$peer.id}| withdrew their guess.`);
    };
</script>

{#if $game.guessPending !== undefined}
<div class="card">
    <div class="card-header">
        <p class="card-header-title">Guess Pending</p>
    </div>
    <div class="card-content">
        <div class="field">
            <div class="control">
              <textarea class="textarea" id="guessTxt" placeholder="Type your guess here" bind:value={$game.guessPending.guess}></textarea>
            </div>
        </div>
    </div>
    <div class="card-footer">
        <button class="button card-footer-item" on:click="{submitGuess}">Submit</button>
        <button class="button card-footer-item" on:click="{withdrawGuess}">Withdraw</button>
    </div>
</div>
{/if}

<style>
</style>
