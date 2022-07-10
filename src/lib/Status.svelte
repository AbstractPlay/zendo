<script lang="ts">
    import { myName } from "../stores/writeMyName";
    import { peer } from "../stores/writePeerObj";
    import { peers } from "../stores/writePeers";
    import type { PeerRecord } from "../stores/writePeers";
    import { chatlog } from "../stores/writeChat";
    import type { ChatRecord } from "../stores/writeChat";
    import type { DataConnection } from "peerjs";
    import type { ZendoGameMessages } from "../schemas/messages";
    import { game } from "../stores/writeGame";
    import type { ZendoGameState } from "@/schemas/game";

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
        const entry: ChatRecord = {
            time: Math.floor(Date.now() / 1000),
            msg: `Peer ${conn.peer} has connected to you.`
        };
        chatlog.update((log) => [...log, entry]);

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
            const entry: ChatRecord = {
                time: Math.floor(Date.now() / 1000),
                msg: conn.peer + " has disconnected."
            };
            chatlog.update((log) => [...log, entry]);
            peers.update((lst) => deletePeer(lst, conn.peer));
            if ($game.hasOwnProperty("students")) {
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
                return $peers[idx].alias;
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
                        lst[idx].alias = msg.name;
                    }
                    return [...lst];
                });
                const entry: ChatRecord = {
                    time: Math.floor(Date.now() / 1000),
                    msg: `Peer ${peerid} set their display name to "${msg.name}".`
                };
                chatlog.update((log) => [...log, entry]);
            } else if (msg.type === "peers") {
                for (const p of msg.peers) {
                    if (p === $peer.id) { continue; }
                    const idx = $peers.findIndex((rec) => rec.id === p);
                    if (idx === -1) {
                        joinPeer(p);
                    }
                }
            } else if (msg.type === "chat") {
                const entry: ChatRecord = {
                    source: id2name(peerid),
                    time: Math.floor(Date.now() / 1000),
                    msg: msg.msg
                };
                chatlog.update((log) => [...log, entry]);
            } else if (msg.type === "askdisplay") {
                const reply: ZendoGameMessages = {
                    type: "display",
                    name: $myName
                }
                sendDirectMsg(peerid, reply);
            } else if (msg.type === "gameReplace") {
                $game = JSON.parse(msg.game) as ZendoGameState;
            } else if (msg.type === "notifyAbandon") {
                const entry: ChatRecord = {
                    time: Math.floor(Date.now() / 1000),
                    msg: `${id2name(peerid)} is abandoning the game. They will see the secret rule.`
                };
                chatlog.update((log) => [...log, entry]);
            } else if (msg.type === "vote") {
                if ($game.hasOwnProperty("koanPending")) {
                    if (! $game.koanPending.hasOwnProperty("votes")) {
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
</script>

<svelte:window on:beforeunload={shutdown}/>

<div class="level">
    <div class="level-left">
        <div class="level-item">
        {#if id.length > 0}
            <p>Your ID is <code>{id}</code></p>
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

<style></style>
