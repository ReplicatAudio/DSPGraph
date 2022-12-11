<script>
    export let loadFile;
    export let loadFromLS;
    export let ast;
</script>
<center>
    <br>
    <input style="display:none" type="file" accept=".dsp.json" on:change={(e)=>loadFile(e)} bind:this={ast.fileinput} >
    <button on:click={()=>{ast.fileinput.click()}}>load from file</button>
    <button on:click={loadFromLS}>load from browser</button>
</center>