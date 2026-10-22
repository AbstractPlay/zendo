<script lang="ts">
    import { colours } from "@/stores/writeColours";
    import { sortHSV, rgbToHsv, rgbToInts } from "@/lib/ViewKoanSupport/Colours";
    import { defaultColours } from "@/lib/ViewKoanSupport/Pyramids";
    import { toast } from "@zerodevx/svelte-toast";
    import ColorPicker from "svelte-awesome-color-picker";
    import { commitGame } from "@/lib/gameSync";
    import { get } from "svelte/store";

    const pyramidColoursPayload = (lst: Map<string, string>) =>
        [...lst.entries()].map(([abbreviation, hex]) => ({ abbreviation, hex })) as [
            { abbreviation: string; hex: string },
            ...{ abbreviation: string; hex: string }[],
        ];

    const syncColoursToGame = (description: string) => {
        const snapshot = new Map(get(colours));
        commitGame((g) => {
            g.colours = pyramidColoursPayload(snapshot);
        }, description);
    };

    const saveColour = () => {
        const abbrev = newAbbrev;
        let rgb = hex;
        let valid = true;
        if (abbrev.length !== 2) {
            toast.push(`The colour abbreviation may only be 2 characters long.`);
            valid = false;
        }
        rgb = rgb.toLowerCase();
        if (!/^#[0-9a-f]{3}$/.test(rgb) && !/^#[0-9a-f]{6}$/.test(rgb)) {
            toast.push(
                `The RGB value must start with a pound sign and must be followed by 3 or 6 hexadecimal digits.`,
            );
            valid = false;
        }
        if ([...$colours.values()].includes(rgb)) {
            toast.push(`A colour with that RGB value already exists.`);
            valid = false;
        }
        if (valid) {
            $colours.set(abbrev, rgb);
            $colours = $colours;
            syncColoursToGame(`The master has updated the available pyramid colours.`);
        }
    };

    const delColour = (abbrev: string) => {
        $colours.delete(abbrev);
        $colours = $colours;
        syncColoursToGame(`The master has updated the available pyramid colours.`);
    };

    const reset = () => {
        colours.set(new Map(defaultColours));
        syncColoursToGame(`The master has updated the available pyramid colours.`);
    };

    let modalShow = "";
    let newAbbrev = "";
    let hex = "#e41a1c";
</script>

<div class="control">
    <button class="button is-warning" on:click={() => (modalShow = "is-active")}>Customize colours</button>
</div>

<div class="modal {modalShow}" id="customColours">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Customize Colours</p>
        </header>
        <section class="modal-card-body">
            <p>
                <b>For most people, the default colours are sufficient!</b> If you really want to customize, use the
                form below. You can change the colours at any time, but deleting colours already in play will screw up
                the rendering.
            </p>
            <div class="field is-grouped">
                <div class="control">
                    <input class="input" type="text" placeholder="Abbreviation" bind:value={newAbbrev} />
                </div>
                <div class="control">
                    <ColorPicker bind:hex isAlpha={false} />
                </div>
                <div class="control">
                    <button class="button" on:click={saveColour}>Add</button>
                </div>
            </div>
            <p>
                The following colours are available (click to delete):
                {#each [...$colours.entries()].sort((a, b) => sortHSV(rgbToHsv(...rgbToInts(a[1])), rgbToHsv(...rgbToInts(b[1])))) as [abbrev, rgb]}
                    <span on:click={() => delColour(abbrev)}
                        ><code style="background-color: {rgb}; color: black;">{abbrev}</code></span
                    >&ensp;
                {/each}
            </p>
            <div class="control">
                <button class="button" on:click={reset}>Reset to defaults</button>
            </div>
        </section>
        <footer class="modal-card-foot">
            <button class="button" on:click={() => (modalShow = "")}>Close</button>
        </footer>
    </div>
</div>
