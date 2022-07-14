<script lang="ts">
    import { myName } from "../stores/writeMyName";
    import { PeerRecord, peers } from "../stores/writePeers";
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

    const sendDirectMsg = (peerid: string, msg: ZendoGameMessages) => {
        const idx = $peers.findIndex(p => p.id === peerid);
        if (idx !== -1) {
            $peers[idx].connection.send(msg);
        }
    };

    let expandPeers = true;
    let newName: string;
    let clickedPeer: PeerRecord;
    let modalRename = "";
    const renamePeer = () => {
        peers.update((lst) => {
            const idx = lst.findIndex(p => p.id === clickedPeer.id);
            if (idx !== -1) {
                lst[idx].alias = newName;
                lst[idx].locked = true;
            }
            return [...lst];
        });
        newName = undefined;
        clickedPeer = undefined;
        modalRename = "";
    };

    const unlockPeer = () => {
        peers.update((lst) => {
            const idx = lst.findIndex(p => p.id === clickedPeer.id);
            if (idx !== -1) {
                lst[idx].locked = false;
            }
            return [...lst];
        });
        const msg: ZendoGameMessages = {
            type: "askdisplay"
        };
        sendDirectMsg(clickedPeer.id, msg);
        newName = undefined;
        clickedPeer = undefined;
        modalRename = "";
    };
</script>

<div class="card" id="peerBox">
    <header class="card-header">
        <p class="card-header-title">Connected Peers</p>
        <button class="card-header-icon" aria-label="toggle peers" title="toggle peers" on:click="{() => expandPeers = !expandPeers}">
        {#if expandPeers}
            <span class="icon">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
        {:else}
            <span class="icon">
                <i class="fa-solid fa-angle-left" aria-hidden="true"></i>
            </span>
        {/if}
        </button>
    </header>
{#if expandPeers}
    <div class="card-content">
        <div class="field">
            <input class="input" type="text" id="displayName" bind:value="{$myName}">
            <button class="button is-primary" on:click="{saveDisplayName}">Update your display name</button>
        </div>
        <p class="content">Click on a peer to rename them.</p>
        <div class="panel">
            {#each $peers as p}
                <a target="_self" class="panel-block" href={"#"} data-tooltip="{p.id}" on:click="{() => {clickedPeer = p; newName = clickedPeer.alias; modalRename = "is-active"}}">
                {#if p.locked}
                    <span class="panel-icon">
                        <i class="fa-solid fa-lock" aria-hidden="true"></i>
                    </span>
                {/if}
                    {p.alias !== undefined ? p.alias : "(UNNAMED)"}
                </a>
            {/each}
        </div>
    </div>
{/if}
</div>

<div class="modal {modalRename}" id="expandKoan">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Rename Individual</p>
        </header>
        <section class="modal-card-body">
            <p>You can forcibly rename any connected peer to a name of your choosing, only visible to yourself.</p>
            <div class="field">
                <input class="input" type="text" id="newName" bind:value="{newName}">
                <button class="button is-primary" on:click="{renamePeer}">Forcibly rename peer</button>
                <button class="button is-info" on:click="{unlockPeer}">Revert to peer's preferred name</button>
            </div>
        </section>
        <footer class="modal-card-foot">
            <button class="button" on:click="{() => {clickedPeer = undefined; modalRename = ""}}">Cancel</button>
        </footer>
    </div>
</div>

<style>
    [data-tooltip]:hover {
        position: relative;
    }
    [data-tooltip]:hover::before {
        all: initial;
        font-family: Arial, Helvetica, sans-serif;
        display: inline-block;
        border-radius: 5px;
        padding: 10px;
        background-color: #1a1a1a;
        content: attr(data-tooltip);
        color: #f9f9f9;
        position: absolute;
        bottom: 100%;
        width: 100px;
        left: 50%;
        transform: translate(-50%, 0);
        margin-bottom: 15px;
        text-align: center;
        font-size: 14px;
    }
    [data-tooltip]:hover::after {
        all: initial;
        display: inline-block;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid #1a1a1a;
        position: absolute;
        bottom: 100%;
        content: '';
        left: 50%;
        transform: translate(-50%, 0);
        margin-bottom: 5px;
    }
</style>