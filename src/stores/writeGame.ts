import { writable } from "svelte/store";
import type { ZendoGameState } from "@/schemas/game";

export const game = writable({} as ZendoGameState);
