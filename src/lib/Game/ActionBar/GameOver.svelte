<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peers } from "@/stores/writePeers";
    import { peer } from "@/stores/writePeerObj";
    import { myName } from "@/stores/writeMyName";
    import type { ZendoGameState } from "@/schemas/game";

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

    let exportedGame = {} as ZendoGameState;
    if ($game.hasOwnProperty("koanType")) {
        exportedGame.koanType = $game.koanType;
    }
    if ($game.hasOwnProperty("welcome")) {
        exportedGame.welcome = $game.welcome;
    }
    if ($game.hasOwnProperty("guesses")) {
        exportedGame.guesses = [...$game.guesses];
        exportedGame.guesses.map(g => g.student = id2name(g.student));
    }
    if ($game.hasOwnProperty("koans")) {
        exportedGame.koans = [...$game.koans];
    }
    let exportDataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportedGame));

</script>

<div class="box">
    <div class="content">
        <p>The game is over.</p>
        {#if $game.winner !== null}
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
            <li>You can copy and paste it:<br><code>{JSON.stringify(exportedGame)}</code></li>
            <li>You can save/share this URL for quick access:<br><a href="https://www.perlkonig.com/zendo/?import={encodeURIComponent(JSON.stringify(exportedGame))}"><code>https://www.perlkonig.com/zendo/?import={encodeURIComponent(JSON.stringify(exportedGame))}</code></a></li>
        </ul>
    </div>
</div>
