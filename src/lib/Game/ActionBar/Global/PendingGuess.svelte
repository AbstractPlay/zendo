<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peers } from "@/stores/writePeers";
    import { myName } from "@/stores/writeMyName";
    import { peer } from "@/stores/writePeerObj";
    import type {ZendoGameMessages} from "@/schemas/messages";

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

    let guesser = "";
    if ($game.hasOwnProperty("guessPending")) {
        guesser = id2name($game.guessPending.student);
    }
    peers.subscribe((lst) => {
        if ($game.hasOwnProperty("guessPending")) {
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

</script>

{#if $game.hasOwnProperty("guessPending")}
<div class="card">
    <div class="card-header">
        <p class="card-header-title">
            {guesser} has made a guess
        </p>
    </div>
    <div class="card-content content">
        <blockquote>{$game.guessPending.guess}</blockquote>
        <p>Awaiting the master's decision.</p>
    </div>
</div>
{:else}
    <p>Oops! The developer screwed up. You shouldn't see this component unless there's a guess to review.</p>
{/if}
