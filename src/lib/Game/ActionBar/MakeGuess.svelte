<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peer } from "@/stores/writePeerObj";
    import { peers } from "@/stores/writePeers";
    import { myName } from "@/stores/writeMyName";
    import type { ZendoGameMessages } from "@/schemas/messages";

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

    let modalGuess = "";
    let guessTxt: string;
    const submitGuess = () => {
        $game.guessPending = {
            student: $peer.id,
            guess: guessTxt
        };
        $game = $game;
        pushGame(`|${$peer.id}| has submitted a guess.`);
        modalGuess = "";
    };
</script>

<p class="control">
    <button class="button" on:click="{() => {modalGuess = "is-active"}}">
        Make a Guess
    </button>
</p>

<div class="modal {modalGuess}" id="addGuess">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Make a Guess</p>
        </header>
        <section class="modal-card-body">
            <div class="field">
                <div class="control">
                  <textarea class="textarea" id="guessTxt" placeholder="Type your guess here" bind:value="{guessTxt}"></textarea>
                </div>
            </div>
        </section>
        <footer class="modal-card-foot">
            <button class="button is-success" on:click="{submitGuess}">Submit Guess</button>
            <button class="button" on:click="{() => modalGuess = ""}">Cancel</button>
        </footer>
    </div>
</div>

<style></style>
