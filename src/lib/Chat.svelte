<script lang="ts">
    import { chatlog } from "../stores/writeChat";
    import type { ChatRecord } from "../stores/writeChat";
    import { peers } from "../stores/writePeers";
    import { myName } from "../stores/writeMyName";
    import type { ZendoGameMessages } from "@/schemas/messages";
    import { beforeUpdate, afterUpdate } from 'svelte';
    import PeerList from "./Chat/PeerList.svelte";

    const saveDisplayName = (newname: string) => {
        myName.set(newname);
        // Broadcast your display name
        const msg: ZendoGameMessages = {
            type: "display",
            name: $myName
        };
        for (const p of $peers) {
            p.connection.send(msg);
        }
    };

    const sendDirectMsg = (peerid: string, msg: ZendoGameMessages) => {
        const idx = $peers.findIndex(p => p.id === peerid);
        if (idx !== -1) {
            $peers[idx].connection.send(msg);
        }
    };

    let chatmsg: string;
    const handleMsg = () => {
        if (! chatmsg.startsWith("/")) {
            sendMsg();
        } else {
            let result = "";
            const words = chatmsg.split(/\s+/);
            switch (words[0]) {
                case "/name":
                    if (words.length < 3) {
                        result = "The /name command needs two parameters: the ID of person you wish to name (or 'self' if setting your own display name) and the name you wish to use (can include spaces)."
                    } else {
                        const newname = words.slice(2).join(" ");
                        if (words[1].toLowerCase() === "self") {
                            saveDisplayName(newname);
                            result = `You changed your display name to '${newname}''.`;
                        } else {
                            if (! $peers.map(p => p.id).includes(words[1])) {
                                result = `Could not find a peer with the id ${words[1]}.`;
                            } else {
                                peers.update((lst) => {
                                    const idx = lst.findIndex(p => p.id === words[1].toLowerCase());
                                    if (idx !== -1) {
                                        lst[idx].alias = newname;
                                        lst[idx].locked = true;
                                    }
                                    return [...lst];
                                });
                                result = `Peer ${words[1]} has been forcibly renamed to '${newname}'.`;
                            }
                        }
                    }
                    break;
                case "/unlock":
                    if (words.length !== 2) {
                        result = "The /unlock command needs one parameter: the ID of peer whose display name you wish to unlock."
                    } else {
                        if (! $peers.map(p => p.id).includes(words[1])) {
                            result = `Could not find a peer with the id ${words[1]}.`;
                        } else {
                            peers.update((lst) => {
                                const idx = lst.findIndex(p => p.id === words[1].toLowerCase());
                                if (idx !== -1) {
                                    lst[idx].locked = false;
                                }
                                return [...lst];
                            });
                            result = `Peer ${words[1]}'s display name has been unlocked.`;
                            const msg: ZendoGameMessages = {
                                type: "askdisplay"
                            };
                            sendDirectMsg(words[1].toLowerCase(), msg);
                        }
                    }
                    break;
                default:
                    result = `Unrecognized command ${words[0]}. The only recognized commands are /name and /unlock.`;
                    break;
            }
            if (result.length > 0) {
                const entry: ChatRecord = {
                    time: Math.floor(Date.now() / 1000),
                    msg: result
                };
                chatlog.update((log) => [...log, entry]);
            }
        }
        chatmsg = "";
    };
    const sendMsg = () => {
        const entry: ChatRecord = {
            source: $myName,
            time: Math.floor(Date.now() / 1000),
            msg: chatmsg
        };
        chatlog.update((log) => [...log, entry]);
        const msg: ZendoGameMessages = {
            type: "chat",
            msg: chatmsg
        };
        for (const p of $peers) {
            p.connection.send(msg);
        }
        chatmsg = "";
    };

    let div;
    let autoscroll;

    beforeUpdate(() => {
		autoscroll = div && (div.offsetHeight + div.scrollTop) > (div.scrollHeight - 20);
	});

	afterUpdate(() => {
		if (autoscroll) div.scrollTo(0, div.scrollHeight);
	});

    const handleKeydown = (event) => {
		if (event.key === 'Enter') {
            handleMsg();
        }
    }
</script>

<section class="content">
    <PeerList/>
    <h2 class="subtitle">Chat Log</h2>
    <div class="content chatlog" bind:this={div}>
        {#each $chatlog as entry}
            {#if entry.source === undefined}
                <p class="system">{entry.msg}</p>
            {:else}
                <p><span class="source">{entry.source}:</span> {entry.msg}</p>
            {/if}
        {/each}
    </div>
    <div class="field">
        <label class="label" for="chatMsg">Message</label>
        <div class="control">
          <input class="input" type="text" id="chatMsg" bind:value="{chatmsg}" on:keydown="{handleKeydown}">
        </div>
    </div>
</section>

<style>
    p.system {
        color: red;
    }
    .chatlog {
        height: 20em;
        overflow: auto;
    }
    .source {
        font-weight: bolder;
    }
</style>