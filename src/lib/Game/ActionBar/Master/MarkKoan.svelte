<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { commitGame } from "@/lib/gameSync";
    import ViewKoan from "../../ViewKoan.svelte";
    import Voters from "./Voters.svelte";

    const markKoan = (htbn: boolean) => {
        commitGame((g) => {
            const pending = g.koanPending;
            if (pending === undefined) {
                return;
            }
            if (pending.call === "mondo") {
                for (const v of pending.votes ?? []) {
                    if (v.vote === htbn) {
                        const idx = g.students?.findIndex((s) => s.id === v.student) ?? -1;
                        if (idx !== -1 && g.students) {
                            g.students[idx].guesses++;
                        }
                    }
                }
            }
            if (!g.koans) {
                g.koans = [];
            }
            g.koans.push({
                string: pending.koan,
                htbn,
            });
            delete g.koanPending;
        }, `The master marked the pending koan as ${htbn ? "having" : "not having"} the Buddha nature.`);
    };

    const rejectKoan = () => {
        commitGame((g) => {
            delete g.koanPending;
        }, `The master rejected the pending koan.`);
    };
</script>

{#if $game.hasOwnProperty("koanPending") && $game.koanPending !== undefined}
<section class="card">
    <header class="card-header">
        <p class="card-header-title">Mark Koan</p>
    </header>
    <div class="card-content">
        <ViewKoan koanStr={$game.koanPending.koan}/>

    {#if $game.koanPending.call === "mondo"}
        <p>Mondo has been called! <strong>Don't mark the koan until all the votes have come in.</strong> Once you mark it, no more voting is possible. The marking buttons will not appear until at least half of the students have voted.</p>

        <Voters/>
    {:else}
        <p>Master has been called! Please mark the koan.</p>
    {/if}
    </div>
    {#if ( ($game.koanPending.call === "master") || ( ($game.koanPending.hasOwnProperty("votes")) && ($game.koanPending.votes !== undefined) && ($game.students !== undefined) && ($game.koanPending.votes.length * 2 >= $game.students.length) ) )}
        <div class="card-footer">
            <button class="button is-success card-footer-item" on:click="{() => markKoan(true)}">Has</button>
            <button class="button is-danger card-footer-item" on:click="{() => markKoan(false)}">Has NOT</button>
            <button class="button card-footer-item" on:click="{rejectKoan}">Reject Koan</button>
        </div>
    {/if}
</section>
{:else}
    <p>Oops! The developer screwed up. You shouldn't see this component unless there's a koan pending review.</p>
{/if}

<style></style>
