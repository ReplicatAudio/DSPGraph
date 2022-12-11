<script>
    import Clipboard from "svelte-clipboard";
    export let st;
    export let downloadFile;
    export let saveToLS;
</script>
<center>
    <br>
    <input bind:value={st.fileName} type="text" id="fileName">
    <button on:click={downloadFile}>save to file</button>
    <button on:click={saveToLS}>save to browser</button>
    <Clipboard
        text={JSON.stringify(st, null, 2)}
        let:copy
        on:copy={() => {
            alert('Has Copied to Clipboard👏');
        }}>
        <button on:click={copy}>save to clipboard</button>
    </Clipboard>
</center>