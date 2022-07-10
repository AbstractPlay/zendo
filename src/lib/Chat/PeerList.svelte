<script lang="ts">
    import { peers } from "../../stores/writePeers"

    // From StackOverflow: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
    const fallbackCopyTextToClipboard = (text: string) => {
        var textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            // console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            // console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    };

    const copyTextToClipboard = (text: string) => {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    };
</script>

<div class="panel">
    <p class="panel-heading">Connected Peers</p>
    <p class="panel-block">
        Click to copy the ID to the clipboard.
    </p>
    {#each $peers as p}
        <a class="panel-block" href={"#"} data-tooltip="{p.id}" on:click="{() => copyTextToClipboard(p.id)}">
        {#if p.locked}
            <span class="panel-icon">
                <i class="fa-solid fa-lock" aria-hidden="true"></i>
            </span>
        {/if}
            {p.alias !== undefined ? p.alias : "(UNNAMED)"}
        </a>
    {/each}
</div>

<style>
    [data-tooltip]:hover {
        position: relative;
    }
    [data-tooltip]:hover::before {
        all: initial;
        font-family: Arial, Helvetica, sans-serif;
        display: inline-block;
        border-radius: 5px;
        padding: 10px;
        background-color: #1a1a1a;
        content: attr(data-tooltip);
        color: #f9f9f9;
        position: absolute;
        bottom: 100%;
        width: 100px;
        left: 50%;
        transform: translate(-50%, 0);
        margin-bottom: 15px;
        text-align: center;
        font-size: 14px;
    }
    [data-tooltip]:hover::after {
        all: initial;
        display: inline-block;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid #1a1a1a;
        position: absolute;
        bottom: 100%;
        content: '';
        left: 50%;
        transform: translate(-50%, 0);
        margin-bottom: 5px;
    }
</style>