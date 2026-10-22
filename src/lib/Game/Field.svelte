<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { buildFieldSegments } from "@/lib/fieldSegments";
    import Koans from "./Field/Koans.svelte";
    import Guess from "./Field/Guess.svelte";

    $: segments = buildFieldSegments($game);
</script>

{#each segments as klst}
    {#if klst[0].length > 0}
    <Koans idxLst={klst[0]}/>
    {/if}
{#if (klst[1] !== undefined)}
    <Guess guess={klst[1]}/>
{/if}
{/each}

<style></style>
