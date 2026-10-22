<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peer } from "@/stores/writePeerObj";
    import { commitGame } from "@/lib/gameSync";
    import { trySpendGuessingStone, studentStoneCount } from "@/lib/guessingStones";
    import { toast } from "@zerodevx/svelte-toast";

    let modalGuess = "";
    let guessTxt: string;
    const submitGuess = () => {
        const text = (guessTxt ?? "").trim();
        if (text.length === 0) {
            toast.push("Enter a guess before submitting.");
            return;
        }
        if ($game.hasOwnProperty("guessPending") && $game.guessPending !== undefined) {
            toast.push("A guess is already pending review.");
            return;
        }
        if (studentStoneCount($game, $peer.id) < 1) {
            toast.push("You need a guessing stone to submit a guess.");
            return;
        }
        const id = $peer.id;
        const synced = commitGame((g) => {
            if (!trySpendGuessingStone(g, id)) {
                return false;
            }
            g.guessPending = {
                student: id,
                guess: text,
            };
        }, `|${id}| has submitted a guess.`);
        if (!synced) {
            toast.push("You need a guessing stone to submit a guess.");
            return;
        }
        modalGuess = "";
        guessTxt = "";
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
