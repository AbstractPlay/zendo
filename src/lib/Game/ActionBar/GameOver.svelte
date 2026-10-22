<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peers } from "@/stores/writePeers";
    import { peer } from "@/stores/writePeerObj";
    import { myName } from "@/stores/writeMyName";
    import { buildExportGameSnapshot } from "@/lib/exportGame";
    import type { ZendoGameState } from "@/schemas/game";
    import pako from "pako";
    import { Buffer } from "buffer";

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

    const exportedGame = buildExportGameSnapshot($game, id2name);
    const compressed = pako.deflate(JSON.stringify(exportedGame));
    const encoded = Buffer.from(compressed).toString("base64");
    let exportDataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportedGame));
</script>

<div class="box">
    <div class="content">
        <p>The game is over.</p>
        {#if $game.winner !== null && $game.winner !== undefined}
            <p>The winner was {id2name($game.winner)} ({$game.winner}).</p>
        {:else}
            <p>There was no winner.</p>
        {/if}
        <p>To start a new game, refresh this window and join/host a new game.</p>
    </div>
    <hr>
    <div class="content">
        <p>The following code is a record of the game that can be reloaded into the client at a later time for review.</p>
        <ul>
            <li>You can <a href="{exportDataStr}" download="ZendoGame_{(new Date()).toISOString()}.json">click here to download it</a> as a file.</li>
            <li>You can copy and paste it:<br><code>{encoded}</code></li>
            <li>You can save/share this URL for quick access:<br><a href="https://www.perlkonig.com/zendo/?import={encodeURIComponent(encoded)}"><code>https://www.perlkonig.com/zendo/?import={encodeURIComponent(encoded)}</code></a></li>
        </ul>
    </div>
</div>
