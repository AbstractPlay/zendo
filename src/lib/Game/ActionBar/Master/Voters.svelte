<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peers } from "@/stores/writePeers";
    import { myName } from "@/stores/writeMyName";
    import { peer } from "@/stores/writePeerObj";

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

    let voted: string[] = [];
    game.subscribe((obj) => {
        if ( (obj.hasOwnProperty("koanPending")) && (obj.koanPending.hasOwnProperty("votes")) ) {
            voted = [...obj.koanPending.votes.map(v => v.student)];
        } else {
            voted = [];
        }
    });
</script>

<table>
    <thead>
        <tr>
            <th>Student</th>
            <th>Voted?</th>
        </tr>
    </thead>
    <tbody>
    {#each $game.students as student}
        <tr>
        {#key $peers}
            <td>{id2name(student.id)}</td>
        {/key}
            <td>
            {#if voted.includes(student.id)}
                <button class="button">
                    <span class="icon">
                        <i class="fa-solid fa-check" aria-hidden="true"></i>
                    </span>
                </button>
            {:else}
                <button class="button is-loading"></button>
            {/if}
            </td>
        </tr>
    {/each}
    </tbody>
</table>

<style>
    .fa-check {
        color: green;
    }
</style>
