<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peers } from "@/stores/writePeers";
    import type { ZendoGameMessages } from "@/schemas/messages";

    const pushGame = () => {
        const msg: ZendoGameMessages = {
            type: "gameReplace",
            game: JSON.stringify($game)
        }
        for (const p of $peers) {
            p.connection.send(msg);
        }
    };

    const submitGuess = () => {
        $game = $game;
        pushGame();
    };

    const withdrawGuess = () => {
        delete $game.guessPending;
        $game = $game;
        pushGame();
    };
</script>

<div class="card">
    <div class="card-header">
        <p class="card-header-title">Guess Pending</p>
    </div>
    <div class="card-content">
        <div class="field">
            <div class="control">
              <textarea class="textarea" id="guessTxt" placeholder="Type your guess here" bind:value="{$game.guessPending.guess}"></textarea>
            </div>
        </div>
    </div>
    <footer class="card-footer">
        <button class="button card-footer-item is-success" on:click="{submitGuess}">Submit Revised Guess</button>
        <button class="button card-footer-item" on:click="{withdrawGuess}">Withdraw Guess</button>
    </footer>
</div>

<style>
    .card {
        margin-bottom: 1em;
    }
</style>
