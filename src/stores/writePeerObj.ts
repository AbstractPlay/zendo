import { writable } from "svelte/store";

import { Peer } from "peerjs";

export const peer = writable(new Peer());

