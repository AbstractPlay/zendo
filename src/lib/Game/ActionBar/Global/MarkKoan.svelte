<script lang="ts">
    import { peers } from "@/stores/writePeers";
    import { game } from "@/stores/writeGame";
    import type {ZendoGameMessages} from "@/schemas/messages";
    import ViewKoan from "../../ViewKoan.svelte";

    let myVote: boolean;
    const castVote = () => {
        const msg: ZendoGameMessages = {
            type: "vote",
            vote: myVote
        };
        const idx = $peers.findIndex(p => p.id === $game.master);
        if (idx !== -1) {
            $peers[idx].connection.send(msg);
        }
    };
</script>

{#if $game.hasOwnProperty("koanPending")}
<section class="card">
    <header class="card-header">
        <p class="card-header-title">Mondo has been called!</p>
    </header>
    <div class="card-content">
        <p>Mondo has been called. Review the koan and vote whether you think it "has the Buddha nature" (matches the master's rule). You can change your vote as many times as you like until the master marks the koan.</p>

        <ViewKoan koanStr={$game.koanPending.koan}/>
    </div>
    <div class="card-footer">
        <button class="button card-footer-item {( (myVote !== undefined) && (myVote === true) ) ? "is-active is-success" : ""}" on:click="{() => {myVote = true; castVote()}}">Has</button>
        <button class="button card-footer-item {( (myVote !== undefined) && (myVote === false) ) ? "is-active is-danger" : ""}" on:click="{() => {myVote = false; castVote()}}">Has NOT</button>
    </div>
</section>
{:else}
    <p>Oops! The developer screwed up. You shouldn't see this component unless there's a koan pending review.</p>
{/if}

<style></style>
