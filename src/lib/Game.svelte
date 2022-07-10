<script lang="ts">
    import { game } from "@/stores/writeGame";
    import { peer } from "@/stores/writePeerObj";
    import ActionBar from "./Game/ActionBar.svelte";
    import Field from "./Game/Field.svelte";
    import Students from "./Game/Students.svelte";
    import Welcome from "./Game/Welcome.svelte";
</script>

<section class="content">
    <ActionBar/>
{#if ( ($game.hasOwnProperty("master")) && ($game.master !== $peer.id) )}
    <Welcome/>
{/if}
    <Students/>
{#key $game}
    <Field/>
{/key}
</section>

<style></style>