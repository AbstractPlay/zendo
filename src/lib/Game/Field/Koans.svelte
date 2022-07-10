<script lang="ts">
    import { game } from "@/stores/writeGame";
    import ViewKoan from "../ViewKoan.svelte";

    export let idxLst: number[];
</script>

<div class="columns">
    <div class="column">
        <p class="subtitle">Has</p>
    {#each idxLst as idx}
        {#if $game.koans[idx].htbn}
            <ViewKoan koanNum={idx}/>
        {/if}
    {/each}
    </div>
    <div class="column">
        <p class="subtitle">Has NOT</p>
    {#each idxLst as idx}
        {#if ! $game.koans[idx].htbn}
            <ViewKoan koanNum={idx}/>
        {/if}
    {/each}
    </div>
</div>
