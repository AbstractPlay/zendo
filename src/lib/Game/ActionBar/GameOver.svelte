<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peers } from "@/stores/writePeers";
    import { peer } from "@/stores/writePeerObj";
    import { myName } from "@/stores/writeMyName";

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
</script>

<div class="box">
    <p>The game is over</p>
    {#if $game.winner !== null}
        <p>The winner was {id2name($game.winner)} ({$game.winner}).</p>
    {:else}
        <p>There was no winner.</p>
    {/if}
    <p>To start a new game, refresh this window and join/host a new game.</p>
</div>
