<script lang="ts">
  import Status from "./lib/Status.svelte";
  import Chat from "./lib/Chat.svelte";
  import Game from "./lib/Game.svelte";
  import Footer from "./lib/Footer.svelte";
  import Header from "./lib/Header.svelte";
</script>

<main class="container p-6">
  <Header/>
  <Status/>
  <div class="columns">
    <div class="column is-two-thirds">
      <Game/>
    </div>
    <div class="column">
      <Chat/>
    </div>
  </div>
  <Footer/>
</main>

<style>
</style>
