<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peers } from "@/stores/writePeers";
    import { peer } from "@/stores/writePeerObj";
    import { myName } from "@/stores/writeMyName";
    import type { ZendoGameMessages } from "@/schemas/messages";

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

    const isTurn = (id: string): boolean => {
        if ($game.hasOwnProperty("currplayer")) {
            if ($game.currplayer === id) {
                return true;
            }
        }
        return false;
    };

    const pushGame = () => {
        const msg: ZendoGameMessages = {
            type: "gameReplace",
            game: JSON.stringify($game)
        }
        for (const p of $peers) {
            p.connection.send(msg);
        }
    };

    const giveGuess = (id: string) => {
        if ($game.hasOwnProperty("students")) {
            const idx = $game.students.findIndex(s => s.id === id);
            if (idx !== -1) {
                $game.students[idx].guesses++;
                $game = $game;
                pushGame();
            }
        }
    };

    const takeGuess = (id: string) => {
        if ($game.hasOwnProperty("students")) {
            const idx = $game.students.findIndex(s => s.id === id);
            if (idx !== -1) {
                $game.students[idx].guesses--;
                if ($game.students[idx].guesses < 0) {
                    $game.students[idx].guesses = 0;
                }
                $game = $game;
                pushGame();
            }
        }
    };

    const removeStudent = (id: string) => {
        if ($game.hasOwnProperty("students")) {
            const idx = $game.students.findIndex(s => s.id === id);
            if (idx !== -1) {
                $game.students.splice(idx, 1);
                if ($game.students.length === 0) {
                    delete $game.students;
                }
                $game = $game;
                pushGame();
            }
        }
    };

    const makeTurn = (id: string) => {
        $game.currplayer = id;
        $game = $game;
        pushGame();
    }
</script>

{#if $game.hasOwnProperty("students")}
<div class="box">
    <table class="table">
        <thead>
            <tr>
                <!-- Turn indicator -->
                <th>&ZeroWidthSpace;</th>
                <th>Student</th>
                <th>Guesses</th>
                <!-- Admin functions -->
                <th>&ZeroWidthSpace;</th>
            </tr>
        </thead>
        <tbody>
        {#key $peers}
        {#each $game.students as student}
            <tr>
                <td>
                {#if isTurn(student.id)}
                    <span class="icon">
                        <i class="fa-solid fa-chalkboard-user" aria-hidden="true"></i>
                    </span>
                {:else}
                    &ZeroWidthSpace;
                {/if}
                </td>
                <td>{id2name(student.id)}</td>
                <td>{student.guesses}</td>
                <td>
                {#if ($game.master === $peer.id)}
                    <p class="buttons">
                        <button class="button is-normal is-responsive" on:click="{() => giveGuess(student.id)}">
                            <span class="icon" aria-label="Grant guessing stone" title="Grant guessing stone">
                                <i class="fa-solid fa-circle-plus" aria-hidden="true"></i>
                            </span>
                        </button>
                        <button class="button is-normal is-responsive" on:click="{() => takeGuess(student.id)}">
                            <span class="icon" aria-label="Remove guessing stone" title="Remove guessing stone">
                            <i class="fa-solid fa-circle-minus" aria-hidden="true"></i>
                            </span>
                        </button>
                    {#if (! isTurn(student.id))}
                        <button class="button is-normal is-responsive" on:click="{() => makeTurn(student.id)}">
                            <span class="icon" aria-label="Make it this player's turn" title="Make it this player's turn">
                                <i class="fa-solid fa-chalkboard-user" aria-hidden="true"></i>
                            </span>
                        </button>
                    {/if}
                        <button class="button is-normal is-responsive" on:click="{() => removeStudent(student.id)}">
                            <span class="icon" aria-label="Remove student from dojo" title="Remove student from dojo">
                                <i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>
                            </span>
                        </button>
                    </p>
                {/if}
                </td>
            </tr>
        {/each}
        {/key}
        </tbody>
    </table>
</div>
{/if}

<style>
    .button {
        border: none;
    }
</style>
