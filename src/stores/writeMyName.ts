import { writable } from "svelte/store";

export const myName = writable(localStorage.getItem("myName") || "Random" + Math.floor((Math.random() * 9000) + 1000).toString());

myName.subscribe((val) => localStorage.setItem("myName", val));
