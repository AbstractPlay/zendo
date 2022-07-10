<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peer } from "@/stores/writePeerObj";
    import { peers } from "@/stores/writePeers";
    import GameOver from "./ActionBar/GameOver.svelte";
    import NewGame from "./ActionBar/NewGame.svelte";
    import Master from "./ActionBar/Master.svelte";
    import Leaderless from "./ActionBar/Leaderless.svelte";
    import CurrPlayer from "./ActionBar/CurrPlayer.svelte";
    import Global from "./ActionBar/Global.svelte";
</script>

{#if $game.hasOwnProperty("winner")}
    <!-- The game is over. No further interaction is possible. -->
    <GameOver/>
{:else if (! $game.hasOwnProperty("master"))}
    <!-- This is a new game. Someone needs to become the master. -->
    <NewGame/>
{:else}
    {#if ($game.master === $peer.id)}
        <!-- The person viewing the screen is the master. -->
        <Master/>
    {:else if (! $peers.map(p => p.id).includes($game.master))}
        <!-- The game had a master, but the viewer is not connected to the master any more. -->
        <Leaderless/>
    {:else if ( ($game.hasOwnProperty("currplayer")) && ($game.currplayer === $peer.id) )}
        <!-- The game is in full swing and it's the viewer's turn. -->
        <CurrPlayer/>
    {/if}
    <!-- Any functions that are available to everybody go here. -->
    <Global/>
{/if}

<style></style>