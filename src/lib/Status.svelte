<script lang="ts">
    import { myName } from "../stores/writeMyName";
    import { peer } from "../stores/writePeerObj";
    import { peers } from "../stores/writePeers";
    import type { PeerRecord } from "../stores/writePeers";
    import type { DataConnection } from "peerjs";
    import type { ZendoGameMessages } from "../schemas/messages";
    import { game } from "../stores/writeGame";
    import type { ZendoGameState } from "@/schemas/game";
    import { toast } from '@zerodevx/svelte-toast';

    let remotePeer: string;
    const joinClick = () => {
        joinPeer(remotePeer);
        remotePeer = "";
    };
    const joinPeer = (peerid: string) => {
        const conn = $peer.connect(peerid);
        conn.on("open", () => peers.update((lst) => updatePeers(lst, conn)));
    };

    const updatePeers = (lst: PeerRecord[], conn: DataConnection): PeerRecord[] => {
        // Update the actual list of peers
        const idx = lst.findIndex((rec) => rec.id === conn.peer);
        const newlst = [...lst];
        if (idx < 0) {
            const newrec: PeerRecord = {
                id: conn.peer,
                connection: conn,
                locked: false
            };
            newlst.push(newrec)
        }

        // Add handlers
        conn.on("data", (data) => handleMsg(data as ZendoGameMessages, conn.peer));
        conn.on("close", () => {
            const rec = $peers.find(p => p.id === conn.peer);
            if (rec !== undefined) {
                toast.push(`${rec.alias} is leaving.`)
            }
            peers.update((lst) => deletePeer(lst, conn.peer));
            if ( ($game.hasOwnProperty("students")) && ($game.students !== undefined) ) {
                const idx = $game.students.findIndex(s => s.id === conn.peer);
                if (idx !== -1) {
                    $game.students.splice(idx, 1);
                    $game = $game;
                }
            }
        });

        // Now broadcast your display name
        let msg: ZendoGameMessages = {
            type: "display",
            name: $myName
        };
        for (const p of newlst) {
            p.connection.send(msg);
        }

        // Share list of peers
        const idlst = newlst.map(rec => rec.id);
        msg = {
            type: "peers",
            peers: [...idlst]
        };
        for (const p of newlst) {
            p.connection.send(msg);
        }

        // Share game object in certain circumstances only with connecting player
        // - If the master is disconnected
        // - If I am the master
        // You can't share if there is no master otherwise newly joining players will clober existing games.
        if (
            ($game.hasOwnProperty("master")) &&
            ($game.master !== undefined) &&
            (
                (! idlst.includes($game.master)) ||
                ($game.master === $peer.id)
            )
        ) {
            msg = {
                type: "gameReplace",
                game: JSON.stringify($game)
            }
            conn.send(msg);
        }

        return newlst;
    }

    const deletePeer = (lst: PeerRecord[], peerid: string): PeerRecord[] => {
        const idx = lst.findIndex((rec) => rec.id === peerid);
        if (idx !== -1) {
            lst.splice(idx, 1);
        }
        return [...lst];
    };

    let id = ""
    $peer.on("error", (err) => {
        console.error(err);
    });
    $peer.on("open", (givenid) => {id = givenid});
    $peer.on("close", () => {id = ""});
    $peer.on("disconnected", () => {id = ""});
    $peer.on("connection", (conn) => conn.on("open", () => peers.update((lst) => updatePeers(lst, conn))));

    const id2name = (id: string): string => {
        const idx = $peers.findIndex((rec) => rec.id === id);
        if (idx !== -1) {
            if ($peers[idx].alias !== undefined) {
                return $peers[idx].alias!;
            } else {
                return id;
            }
        } else {
            return id;
        }
    };

    const sendDirectMsg = (peerid: string, msg: ZendoGameMessages) => {
        const idx = $peers.findIndex(p => p.id === peerid);
        if (idx !== -1) {
            $peers[idx].connection.send(msg);
        }
    };

    const handleMsg = (msg: ZendoGameMessages, peerid: string) => {
        if (! msg.hasOwnProperty("type")) {
            console.error("Malformed message!\nPeer ID: " + peerid + "\nMsg: " + JSON.stringify(msg));
        } else {
            if (msg.type === "display") {
                peers.update((lst) => {
                    const idx = lst.findIndex((rec) => rec.id === peerid);
                    if ( (idx !== -1) && (! lst[idx].locked) ) {
                        if ( (msg.name.length === 0) || (/^\s+$/.test(msg.name)) ) {
                            msg.name = "Random" + Math.floor((Math.random() * 9000) + 1000).toString();
                        }
                        const oldname = lst[idx].alias;
                        lst[idx].alias = msg.name;
                        if (oldname === undefined) {
                            toast.push(`${msg.name} just joined the room.`);
                        } else {
                            toast.push(`${oldname} changed their display name to ${msg.name}`);
                        }
                    }
                    return [...lst];
                });
            } else if (msg.type === "peers") {
                for (const p of msg.peers) {
                    if (p === $peer.id) { continue; }
                    const idx = $peers.findIndex((rec) => rec.id === p);
                    if (idx === -1) {
                        joinPeer(p);
                    }
                }
            } else if (msg.type === "askdisplay") {
                const reply: ZendoGameMessages = {
                    type: "display",
                    name: $myName
                }
                sendDirectMsg(peerid, reply);
            } else if (msg.type === "gameReplace") {
                if (msg.description !== undefined) {
                    const matches = msg.description.matchAll(/\|\S+\|/g);
                    let str = msg.description;
                    for (const [m] of matches) {
                        const id = m.substring(1, m.length - 1);
                        let p = $peers.find(p => p.id === id);
                        let name = "UNKNOWN"
                        if ( (p !== undefined) && (p.alias !== undefined) ) {
                            name = p.alias;
                        } else if ( (p === undefined) && ($peer.id === id) ) {
                            name = $myName;
                        }
                        str = str.replaceAll(m, name);
                    }
                    toast.push(str);
                }
                $game = JSON.parse(msg.game) as ZendoGameState;
            } else if (msg.type === "vote") {
                if ( ($game.hasOwnProperty("koanPending")) && ($game.koanPending !== undefined) ) {
                    if ( (! $game.koanPending.hasOwnProperty("votes")) || ($game.koanPending.votes === undefined) ) {
                        $game.koanPending.votes = [];
                    }
                    const idx = $game.koanPending.votes.findIndex(v => v.student === peerid);
                    if (idx !== -1) {
                        $game.koanPending.votes[idx].vote = msg.vote;
                    } else {
                        $game.koanPending.votes.push({
                            student: peerid,
                            vote: msg.vote
                        });
                    }
                    $game = $game;
                }
            } else {
                console.error("Unrecognized command!\nPeer ID: " + peerid + "\nMsg: " + JSON.stringify(msg));
            }
        }
    };

    const shutdown = () => {
        for (const p of $peers) {
            p.connection.close();
        }
        $peer.destroy();
    };

    let showCode = false;
    let modalShow = "";
    // From StackOverflow: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
    const fallbackCopyTextToClipboard = (text: string) => {
        var textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            // console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            // console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    };

    const copyTextToClipboard = (text: string) => {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    };
</script>

<svelte:window on:beforeunload={shutdown}/>

<div class="level">
    <div class="level-left">
        <div class="level-item">
        {#if id.length > 0}
            {#if showCode}
                <p>Your ID is <code>{id}</code> <a href="{'#'}" target="_self" on:click={() => showCode = false}><span class="clickTarget">(click to hide)</span></a></p>
            {:else}
                <p>Connection established <a href="{'#'}" target="_self" on:click={() => copyTextToClipboard(id)}><span class="clickTarget">(click to copy ID)</span></a> <a href="{'#'}" target="_self" on:click={() => modalShow = "is-active"}><span class="clickTarget">(click to show ID)</span></a></p>
            {/if}
        {:else}
            <p>Connecting to brokering server. Refresh to retry.</p>
        {/if}
        </div>
    </div>
    <div class="level-right">
        {#if ( (id.length > 0) && (! $game.hasOwnProperty("master")) )}
        <div class="level-item">
            <input class="input" type="text" id="remotePeer" placeholder="ID of remote peer" bind:value="{remotePeer}">
            <button class="button is-link" on:click="{joinClick}">Connect to remote peer</button>
        </div>
    {/if}
    </div>
</div>

<div class="modal {modalShow}" id="confirmDelete">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Show Code?</p>
        </header>
        <section class="modal-card-body">
            <p>Do not show your code if you are streaming. Once the code is revealed, anyone on the Internet can then connect to your lobby. Use the "copy to clipboard" link instead to share your code with friends.</p>
        </section>
        <footer class="modal-card-foot">
            <button class="button is-success" on:click="{() => {showCode = true; modalShow = "";}}">Show Code</button>
            <button class="button" on:click="{() => {modalShow = ""}}">Cancel</button>
        </footer>
    </div>
</div>

<style>
    .clickTarget {
        font-size: smaller;
    }
</style>
