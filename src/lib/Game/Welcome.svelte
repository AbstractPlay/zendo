<script lang="ts">
    import { game } from "../../stores/writeGame";
    import { peers } from "../../stores/writePeers";
    import SvelteMarkdown from 'svelte-markdown';

    let masterName = "";
    peers.subscribe((lst) => {
        if ($game.hasOwnProperty("master")) {
            const idx = lst.findIndex((rec) => rec.id === $game.master);
            if (idx !== -1) {
                if (lst[idx].alias !== undefined) {
                    masterName = lst[idx].alias;
                } else {
                    masterName = $game.master;
                }
            } else {
                masterName = $game.master;
            }
        }
    });
    game.subscribe((state) => {
        if (state.hasOwnProperty("master")) {
            const idx = $peers.findIndex((rec) => rec.id === state.master);
            if (idx !== -1) {
                if ($peers[idx].alias !== undefined) {
                    masterName = $peers[idx].alias;
                } else {
                    masterName = state.master;
                }
            } else {
                masterName = state.master;
            }
        }
    });
</script>

<section class="message">
    <header class="message-header">
        <p>Welcome to {masterName}'s dojo!</p>
    </header>
    <p class="message-body">
    {#if $game.hasOwnProperty("koanType")}
        {#if $game.koanType === "image"}
            <p>This is an image dojo.</p>
        {:else if $game.koanType === "math"}
            <p>This is a math dojo (powered by <a href="https://katex.org/">KaTeX</a>).</p>
        {:else if $game.koanType === "1dpyramids"}
            <p>This is a 1D pyramid dojo.</p>
        {:else if $game.koanType === "2dpyramids"}
            <p>This is a 2D pyramid dojo.</p>
        {:else if $game.koanType === "dotmatrix"}
            <p>This is a dot matrix dojo.</p>
        {:else if $game.koanType === "graphviz"}
            <p>This is a <a href="https://graphviz.org/">GraphViz</a> dojo (rendered by <a href="https://graphviz.org/docs/layouts/dot/">dot</a>).</p>
        {:else}
            <p>This is a text dojo.</p>
        {/if}
    {/if}
    {#if $game.hasOwnProperty("welcome")}
        <SvelteMarkdown source = {$game.welcome} />
    {/if}
    </p>
</section>