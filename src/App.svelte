<script lang="ts">
  import Status from "./lib/Status.svelte";
  import Game from "./lib/Game.svelte";
  import Footer from "./lib/Footer.svelte";
  import Header from "./lib/Header.svelte";
  import PeerList from "./lib/PeerList.svelte";
  import { SvelteToast } from '@zerodevx/svelte-toast';

  const svelteOptions = {};
</script>

<main class="container p-6">
  <Header/>
  <Status/>
  <PeerList/>
  <Game/>
  <Footer/>
  <SvelteToast options={svelteOptions} />
</main>

<style>
</style>
