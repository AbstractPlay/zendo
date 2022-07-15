<script lang="ts">
    import { peers } from "@/stores/writePeers";

    type Guess = {
        student: string;
        guess: string;
    };
    export let guess: Guess;

    let guesser = "";
    peers.subscribe((lst) => {
        const idx = lst.findIndex((rec) => rec.id === guess.student);
        if (idx !== -1) {
            if (lst[idx].alias !== undefined) {
                guesser = lst[idx].alias;
            } else {
                guesser = guess.student;
            }
        } else {
            guesser = guess.student;
        }
    });

    let expandGuess = false;
</script>

<div class="card guessbox">
    <header class="card-header">
        <p class="card-header-title">Guess by {guesser}</p>
        <button class="card-header-icon" aria-label="Toggle guess" title="Toggle guess" on:click="{() => expandGuess = !expandGuess}">
        {#if expandGuess}
            <span class="icon">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
        {:else}
            <span class="icon">
                <i class="fa-solid fa-angle-left" aria-hidden="true"></i>
            </span>
        {/if}
        </button>
    </header>
{#if expandGuess}
    <div class="card-content content">
        <p>{guess.guess}</p>
    </div>
{/if}
</div>

<style>
    .guessbox {
        margin-bottom: 1em;
    }
    .card-header {
        background-color: #4a4a4a;
    }
    .card-header-title {
        color: #fff;
    }
    .card-header-icon {
        color: #fff;
    }
    .card-content {
        background-color: #f5f5f5;
    }
</style>