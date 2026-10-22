import { get } from "svelte/store";
import type { DataConnection } from "peerjs";
import { game } from "@/stores/writeGame";
import { peers } from "@/stores/writePeers";
import type { ZendoGameMessages } from "@/schemas/messages";
import type { ZendoGameState } from "@/schemas/game";

function gameReplaceMessage(description?: string): ZendoGameMessages {
    const msg: ZendoGameMessages = {
        type: "gameReplace",
        game: JSON.stringify(get(game)),
    };
    if (description !== undefined) {
        msg.description = description;
    }
    return msg;
}

/** Fan out current game JSON to every connected peer. */
export function broadcastGame(description?: string): void {
    const msg = gameReplaceMessage(description);
    for (const p of get(peers)) {
        p.connection.send(msg);
    }
}

/** Send current game JSON on a single connection (e.g. late joiner). */
export function sendGameReplace(conn: DataConnection, description?: string): void {
    conn.send(gameReplaceMessage(description));
}

/**
 * Mutate in-memory game state, notify local subscribers, then broadcast.
 * Return `false` from `mutate` to skip the broadcast (state still updates).
 * Shallow-clones the root object so the store always notifies.
 */
export function commitGame(
    mutate: (state: ZendoGameState) => void | false,
    description?: string,
): boolean {
    let shouldBroadcast = true;
    game.update((g) => {
        const result = mutate(g);
        if (result === false) {
            shouldBroadcast = false;
        }
        return { ...g };
    });
    if (shouldBroadcast) {
        broadcastGame(description);
        return true;
    }
    return false;
}

const BUFFER_POLL_MS = 16;

/** Best-effort wait for PeerJS outbound queue (abandon / leave). */
export function flushPeerSendBuffers(maxWaitMs = 400): Promise<void> {
    const deadline = Date.now() + maxWaitMs;
    return new Promise((resolve) => {
        const tick = () => {
            const pending = get(peers).some((p) => {
                const conn = p.connection as { bufferSize?: number };
                return (conn.bufferSize ?? 0) > 0;
            });
            if (!pending || Date.now() >= deadline) {
                resolve();
                return;
            }
            setTimeout(tick, BUFFER_POLL_MS);
        };
        tick();
    });
}
