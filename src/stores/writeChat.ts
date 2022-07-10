import { writable } from "svelte/store";

export type ChatRecord = {
    source?: string;
    time: number;
    msg: string;
};

export const chatlog = writable([] as ChatRecord[]);
