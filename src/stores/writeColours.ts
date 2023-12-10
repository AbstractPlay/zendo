import { writable } from "svelte/store";
import { defaultColours } from "@/lib/ViewKoanSupport/Pyramids";

export const replacer = (key: any, value: any) => {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else if (value instanceof Set) {
        return {
            dataType: "Set",
            value: Array.from(value)
        };
    } else {
        return value;
    }
}

export const reviver = (key: any, value: any) => {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        } else if (value.dataType === 'Set') {
            return new Set(value.value);
        }
    }
    return value;
}

let starting = new Map(defaultColours);
if (localStorage.getItem("colours") !== null) {
    starting = JSON.parse(localStorage.getItem("colours")!, reviver);
}

export const colours = writable(starting);

colours.subscribe((val) => localStorage.setItem("colours", JSON.stringify(val, replacer)));

