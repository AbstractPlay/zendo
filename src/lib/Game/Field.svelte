<script lang="ts">
    import { game } from "@/stores/writeGame";
    import Koans from "./Field/Koans.svelte";
    import Guess from "./Field/Guess.svelte";

    type Guess = {
        student: string;
        guess: string;
    };
    const koans: Array<[number[], Guess | undefined]> = [];
    if ($game.hasOwnProperty("koans")) {
        if (! $game.hasOwnProperty("guesses")) {
            // Just return a list of all the koans
            const lst: number[] = [];
            for (let i = 0; i < $game.koans.length; i++) {
                lst.push(i);
            }
            koans.push([lst, undefined]);
        } else {
            // Break the koans into chunks based on guess indexes
            for (const g of $game.guesses) {
                let startIdx = 0;
                if (koans.length > 0) {
                    const last = koans[koans.length - 1];
                    const lastLst = last[0];
                    startIdx = lastLst[lastLst.length - 1] + 1;
                }
                const lst: number[] = [];
                for (let i = startIdx; i < g.index; i++) {
                    lst.push(i);
                }
                koans.push([lst, {student: g.student, guess: g.guess}]);
            }
            // Now clean up the final koans
            const last = koans[koans.length - 1];
            const lastLst = last[0];
            const startIdx = lastLst[lastLst.length - 1] + 1;

            const lst: number[] = [];
            for (let i = startIdx; i < $game.koans.length; i++) {
                lst.push(i);
            }
            koans.push([lst, undefined]);
        }
    }
</script>

{#each koans as klst}
    {#if klst[0].length > 0}
    <Koans idxLst={klst[0]}/>
    {/if}
{#if (klst[1] !== undefined)}
    <Guess guess={klst[1]}/>
{/if}
{/each}

<style></style>
