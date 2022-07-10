<script lang="ts">
    import { peers } from "@/stores/writePeers";

    type Guess = {
        student: string;
        guess: string;
    };
    export let guess: Guess;

    let guesser = "";
    peers.subscribe((lst) => {
        const idx = lst.findIndex((rec) => rec.id === guess.student);
        if (idx !== -1) {
            if (lst[idx].alias !== undefined) {
                guesser = lst[idx].alias;
            } else {
                guesser = guess.student;
            }
        } else {
            guesser = guess.student;
        }
    });
</script>

<article class="message">
    <div class="message-header">
      <p>Guess by {guesser}</p>
    </div>
    <div class="message-body">
        {guess.guess}
    </div>
</article>

<style></style>