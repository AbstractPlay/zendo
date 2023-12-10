import { derived } from "svelte/store";
import type { PeerRecord } from "./writePeers";
import { peers } from "./writePeers";
import { game } from "./writeGame";

export const observers = derived([peers, game], ([ps, g]): PeerRecord[] => {
    const lst: PeerRecord[] = [];
    for (const p of ps) {
        let ingame = false;
        if ( (g.hasOwnProperty("students")) && (g.students !== undefined) ) {
            for (const s of g.students) {
                if (s.id === p.id) {
                    ingame = true;
                    break;
                }
            }
        }
        if (! ingame) {
            lst.push(p);
        }
    }
    return lst;
});
