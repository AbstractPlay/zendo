<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peers } from "@/stores/writePeers";
    import { myName } from "@/stores/writeMyName";
    import { peer } from "@/stores/writePeerObj";
    import type {ZendoGameMessages} from "@/schemas/messages";

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

    const id2name = (id: string): string => {
        const idx = $peers.findIndex((rec) => rec.id === id);
        if (idx !== -1) {
            if ($peers[idx].alias !== undefined) {
                return $peers[idx].alias || "UNKNOWN";
            } else {
                return id;
            }
        } else if (id === $peer.id) {
            return $myName;
        } else {
            return id;
        }
    };

    let guesser = "";
    if ( ($game.hasOwnProperty("guessPending")) && ($game.guessPending !== undefined) ) {
        guesser = id2name($game.guessPending.student);
    }
    peers.subscribe((lst) => {
        if ( ($game.hasOwnProperty("guessPending")) && ($game.guessPending !== undefined) ) {
            const id = $game.guessPending.student;
            const idx = lst.findIndex((rec) => rec.id === id);
            if (idx !== -1) {
                if (lst[idx].alias !== undefined) {
                    return lst[idx].alias;
                } else {
                    guesser= id;
                }
            } else if (id === $peer.id) {
                guesser = $myName;
            } else {
                guesser = id;
            }
        }
    });

    const rejectGuess = () => {
        delete $game.guessPending;
        $game = $game;
        pushGame(`The master rejected the guess.`);
    };

    const acceptGuess = (incorrect = true) => {
        const idx = $game.students!.findIndex(s => s.id === $game.guessPending!.student);
        if (idx !== -1) {
            $game.students![idx].guesses--;
        }
        if (! $game.hasOwnProperty("guesses")) {
            $game.guesses = [];
        }
        $game.guesses!.push({
            student: $game.guessPending!.student,
            guess: $game.guessPending!.guess,
            index: $game.koans!.length
        });
        delete $game.guessPending;
        $game = $game;
        pushGame(`The master accepted the guess${incorrect ? " as incorrect" : ""}.`);
    };

    let modalWin = "";
    const winningGuess = () => {
        const winner = $game.guessPending!.student;
        acceptGuess(false);
        $game.winner = winner;
        $game = $game;
        pushGame(`|${winner}| has won!!`);
    };
</script>

{#if $game.hasOwnProperty("guessPending") && $game.guessPending !== undefined}
<div class="card">
    <div class="card-header">
        <p class="card-header-title">
            {guesser} has made a guess
        </p>
    </div>
    <div class="card-content content">
        <blockquote>{$game.guessPending.guess}</blockquote>
        <p>The player can update the guess if requested. Otherwise you can simply accept or reject it.</p>
    </div>
    <div class="card-footer">
        <button class="button card-footer-item is-danger" on:click="{() => acceptGuess()}">Accept as wrong</button>
        <button class="button card-footer-item is-warning" on:click="{rejectGuess}">Reject</button>
        <button class="button card-footer-item is-success" on:click="{() => modalWin = "is-active"}">Enlightenment Achieved!!</button>
    </div>
</div>
{:else}
    <p>Oops! The developer screwed up. You shouldn't see this component unless there's a guess to review.</p>
{/if}

<div class="modal {modalWin}" id="confirmWin">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Is this a winning guess?</p>
        </header>
        <section class="modal-card-body">
            <p><strong>This action cannot be undone!</strong> You are about to mark this player as the winner. Are you sure?</p>
        </section>
        <footer class="modal-card-foot">
            <button class="button is-success" on:click="{winningGuess}">Yes! They Win!</button>
            <button class="button" on:click="{() => {modalWin = ""}}">Cancel</button>
        </footer>
    </div>
</div>
