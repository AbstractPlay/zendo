<script lang="ts">
    import { myName } from "../stores/writeMyName";
    import { peers } from "../stores/writePeers";
    import type { ZendoGameMessages } from "../schemas/messages";

    const saveDisplayName = () => {
        // Broadcast your display name
        const msg: ZendoGameMessages = {
            type: "display",
            name: $myName
        };
        for (const p of $peers) {
            p.connection.send(msg);
        }
        $peers = $peers;
    };
</script>

<div class="level">
    <div class="level-left">
        <div class="level-item">
            <div>
                <h1 class="title">Zendo Online</h1>
                <!-- svelte-ignore missing-declaration -->
                <p class="version">Version: {__APP_VERSION__}</p>
            </div>
        </div>
        <div class="level-item">
        </div>
    </div>
    <div class="level-right">
        <div class="level-item">
            <input class="input" type="text" id="displayName" bind:value="{$myName}">
            <button class="button is-link" on:click="{saveDisplayName}">Update display name</button>
        </div>
    </div>
</div>
