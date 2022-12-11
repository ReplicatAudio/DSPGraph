<script>
    export let examples;
    export let loadExample;
</script>
<center>
    <br>
    {#each Object.entries(examples) as [key, val]}
    <button on:click={()=>{loadExample(val)}} class="loadItem">{key}</button>
    {/each}
</center>