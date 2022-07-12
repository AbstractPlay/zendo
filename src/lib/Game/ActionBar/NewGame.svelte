<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peer } from "@/stores/writePeerObj";
    import { peers } from "@/stores/writePeers";
    import type { ZendoGameMessages } from "@/schemas/messages";

    const pushGame = () => {
        const msg: ZendoGameMessages = {
            type: "gameReplace",
            game: JSON.stringify($game)
        }
        for (const p of $peers) {
            p.connection.send(msg);
        }
    };

    const becomeMaster = () => {
        $game.master = $peer.id;
        pushGame();
    };


</script>

<div class="box">
    <p class="content">
        <a href="https://www.looneylabs.com/content/zendo">Game Rules</a>
    </p>
    <p class="control">
        <button class="button" on:click="{becomeMaster}">
            Become the Master
        </button>
    </p>
</div>
