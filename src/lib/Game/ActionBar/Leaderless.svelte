<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peer } from "@/stores/writePeerObj";
    import { peers } from "@/stores/writePeers";
    import type { ZendoGameMessages } from "@/schemas/messages";

    const pushGame = (description?: string) => {
        const msg: ZendoGameMessages = {
            type: "gameReplace",
            game: JSON.stringify($game),
            description,
        }
        for (const p of $peers) {
            p.connection.send(msg);
        }
    };

    const dojoTakeover = () => {
        $game.master = $peer.id;
        if ( ($game.hasOwnProperty("students")) && ($game.students !== undefined) ) {
            const idx = $game.students.findIndex(s => s.id === $game.master);
            if (idx !== -1) {
                $game.students.splice(idx, 1);
            }
        }
        $game = $game;
        pushGame(`|${$peer.id}| has taken over as master.`);
    };


</script>

<div class="box">
    <p>The master has left the building. You can wait for them to return, or someone can click the following button to take over the dojo.</p>
    <p class="control">
        <button class="button" on:click="{dojoTakeover}">
            Take Over the Dojo
        </button>
    </p>
</div>
