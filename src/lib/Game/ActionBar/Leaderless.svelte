<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peer } from "@/stores/writePeerObj";
    import { commitGame } from "@/lib/gameSync";
    import { removeStudentFromGame } from "@/lib/roster";

    const dojoTakeover = () => {
        const id = $peer.id;
        commitGame((g) => {
            g.master = id;
            removeStudentFromGame(g, id);
        }, `|${id}| has taken over as master.`);
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
