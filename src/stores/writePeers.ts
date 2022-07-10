import { writable } from "svelte/store";
import type { DataConnection } from "peerjs";

export type PeerRecord = {
    id: string;
    connection: DataConnection;
    alias?: string;
    locked: boolean;
};

export const peers = writable([] as PeerRecord[]);
