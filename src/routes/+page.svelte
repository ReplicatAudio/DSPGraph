<script>
    import { onMount } from 'svelte'
    import Plot from "../comps/plot.svelte";
	import ModalApp from '../comps/modalApp.svelte';
	import ModalExamples from '../comps/modalExamples.svelte';
	import ModalLoad from '../comps/modalLoad.svelte';
	import ModalHelp from '../comps/modalHelp.svelte';
	import ModalSave from '../comps/modalSave.svelte';
    import { stLS } from "../store.js";
    import {examples} from "../examples";
    import defaultJS from '../default';
    
    const cfg = {
        maxWaves: 4,
        paramCount: 8
    }
    let ast = {
        modal: {
            show: false,
            type: 'none',
        },
        fileinput: undefined,
        editor: undefined,
        useAce: true,
        pauseRender: false
    };
    let st = {
        paramVals: [],
        periods: 2,
        amplitude: 1,
        errStr: "",
        hasErr: false,
        showRefSine: true,
        showGrid:true,
        gridSize:4,
        showParams: true,
        showGlobal:false,
        fileName: "MyDSP",
        userJS: defaultJS,
    };
    // Create a deep copy of the st object for restoring
    const stb = JSON.parse(JSON.stringify(st));

    onMount(async () => {
        ace.config.set('basePath', 'https://cdn.jsdelivr.net/npm/ace-builds@1.13.2/src-noconflict/');
        ast.editor = ace.edit("editor");
        ast.editor.setTheme("ace/theme/pastel_on_dark");
        ast.editor.session.setMode("ace/mode/javascript");
        // https://github.com/ajaxorg/ace/wiki/Configuring-Ace
        ast.editor.setOptions({
            selectionStyle: "text",
            //autoScrollEditorIntoView: true,
            //copyWithEmptySelection: true,
            //animatedScroll: false,
            //showPrintMargin: false,
            //scrollPastEnd: false,
            //minLines: 10,
            //dragEnabled: false,
            //hScrollBarAlwaysVisible: true,
            //vScrollBarAlwaysVisible: true,
        });
        ast.editor.setValue(st.userJS);
        setInterval(function(){
            if(ast.useAce)
            {
                st.userJS = ast.editor.getValue();
            }
        }, 500);
	})
    
    function resizeEditor()
    {
        editor.resize();
    }

    function resetState(){
        if(confirm("Reset all code and paramters?"))
        {
            st = JSON.parse(JSON.stringify(stb));
            ast.editor.setValue(st.userJS);
            setup(true);
        }
    }
    function saveToLS()
    {
        if(!confirm("Overwrite existing local storage?")){return;};
        $stLS = JSON.parse(JSON.stringify(st));
        console.log(JSON.stringify($stLS, null, 2));
    }
    function loadFromLS()
    {
        if(showAlert)
        {
            if(!confirm("Lose unsaved changes?")){return;};
        }
        if($stLS.periods)
        {
            st = JSON.parse(JSON.stringify($stLS));
            ast.editor.setValue(st.userJS);
        }
        else{
            alert('No Data To Load!');
        }
    }
    function loadExample(json)
    {
        st = JSON.parse(JSON.stringify(json));
        ast.editor.setValue(st.userJS);
        closeModal();
    }
    function downloadFile()
    {
        // Chat GTP
        // write front-end js code to save a json object to a file on the users hard drive
        // Edited

        // Create a new Blob object containing the file object 
        let fileBlob = new Blob([JSON.stringify(st)], { type: 'application/json' });

        // Create a link element
        let a = document.createElement('a');

        // Set the href and download attributes of the link element
        a.href = URL.createObjectURL(fileBlob);
        a.download = st.fileName+".dsp.json";

        // Append the link element to the DOM
        document.body.appendChild(a);

        // Simulate a click on the link element
        a.click();

        // Remove the link element from the DOM
        document.body.removeChild(a);
    }
    function loadFile(e)
    {
        let file = e.target.files[0];
        let reader = new FileReader();
        //reader.readAsDataURL(file);
        reader.readAsText(file);
        reader.onload = e => {
            try{
                st = JSON.parse(e.target.result);
                ast.editor.setValue(st.userJS);
                alert('Loaded!');
                closeModal();
            }    
            catch(err){
                console.log(err);
                alert('Could not load that file!');
            }
        };
    }
    //
    function showModal(type){
        ast.modal.type = type;
        ast.modal.show = true;
    }
    function closeModal()
    {
        ast.modal.show = false;
    }
    //
    function setup(skipLS=false){
        st.paramVals.length = cfg.paramCount;
        st.paramVals.fill(0.5);
    }
    setup();
</script>
<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.13.2/src-noconflict/ace.min.js" on:load={setup}></script>
</svelte:head>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>DSPGraphJS - ReplicatAudio</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/ace-builds@1.13.2/src-noconflict/ace.min.js"></script>
  </head>
  <body>
    <div class="mobileWarning">
        Hi, thanks for checking out DSPGraphJS. 
        <br><br>
        We're still working on responsive design.
        <br><br>
        Please try using this tool on a full screen desktop browser or check back later for mobile support!
        <br><br>
        This tool currently only supports browser windows that are at least 1200px wide.
    </div>
    {#if ast.modal.show}
    <div class="modalShade" on:click={closeModal}></div>
    <div class="modal">
        <button class="modalCloseBtn" on:click={closeModal}>x</button>
        <h3>{ast.modal.type.toUpperCase()}</h3>
        {#if ast.modal.type === "app"}
        <ModalApp ast={ast} />
        {/if}
        {#if ast.modal.type === "examples"}
        <ModalExamples examples={examples} loadExample={loadExample} />
        {/if}
        {#if ast.modal.type === "help"}
        <ModalHelp />
        {/if}
        {#if ast.modal.type === "save"}
        <ModalSave st={st} downloadFile={downloadFile} saveToLS={saveToLS} />
        {/if}
        {#if ast.modal.type === "load"}
        <ModalLoad loadFile={loadFile} loadFromLS={loadFromLS} ast={ast} />
        {/if}
    </div>
    {/if}
    <div class="codeArea">
        <div class="menu">
            <button class="menuItem" on:click={()=>{showModal("app")}}>App</button>
            <button class="menuItem" on:click={()=>{showModal("save")}}>Save</button>
            <button class="menuItem" on:click={()=>{showModal("load")}}>Load</button>
            <button class="menuItem" on:click={resetState}>Reset</button>
            <button class="menuItem" on:click={()=>{showModal("examples")}}>Examples</button>
            <button class="menuItem" on:click={()=>{showModal("help")}}>Help</button>
        </div>
        {#if st.hasErr}
        <div class="errMsg">
            {st.errStr}
            <br>
            See the JS Console for more info.
        </div>
        {/if}
        <textarea bind:value={st.userJS} id="userJS" spellcheck="false" class:hidden={ast.useAce}></textarea>
        <div id="editor" bind:this={ast.editor} on:click={resizeEditor} class:hidden={!ast.useAce}>Loading Editor...</div>
        
    </div>
    <div class="plotArea">
        <div class="headerImg">
            <a href="https://replicataudio.com" target="_blank" rel="noreferrer">
                <img src="ra_logo.png" alt="ReplicatAudio Logo">
            </a>
        </div>
        <br>
        <Plot st={st} ast={ast} cfg={cfg} />
        <br>
        <div class="scrollArea">
            
            <div class="sliderGroup">
                <button on:click={st.showParams = !st.showParams} class="controlBtn"><h3>Parameter Controls</h3></button>
                {#if st.showParams}
                {#each st.paramVals as param, i}
                <div class="sliderWrapper"> 
                    <input type="number" bind:value={param} class="sliderText" min="0" max="1" step="0.01">
                    <br>
                    <input bind:value={param} type="range" min="0" max="1" step="0.001">
                    <div class="tag">{i}</div>
                </div>
                {/each}
                {/if}
            </div>
            <div class="sliderGroup">
                <button on:click={st.showGlobal = !st.showGlobal} class="controlBtn"><h3>Global Controls</h3></button>
                {#if st.showGlobal}
                <div class="sliderWrapper"> 
                    <input type="number" bind:value={st.amplitude} class="sliderText" min="0" max="1" step="0.01">
                    <br>
                    <input bind:value={st.amplitude} type="range" min="-2" max="2" step="0.001">
                    <div class="tag">amplitude</div>
                </div>
                <div class="sliderWrapper"> 
                    <input type="number" bind:value={st.periods} class="sliderText" min="1" max="32">
                    <br>
                    <input bind:value={st.periods} type="range" min="1" max="32">
                    <div class="tag">periods</div>
                </div>
                <div class="sliderWrapper"> 
                    <input type="number" bind:value={st.gridSize} class="sliderText" min="1" max="16">
                    <br>
                    <input bind:value={st.gridSize} type="range" min="1" max="16">
                    <div class="tag">grid size</div>
                </div>
                <br>
                <div class="sliderWrapper"> 
                    <div class="tag">show</div>
                    <input type=checkbox bind:checked={st.showRefSine}>
                    <div class="tag">ref sine</div>
                </div>
                <div class="sliderWrapper"> 
                    <div class="tag">show</div>
                    <input type=checkbox bind:checked={st.showGrid}>
                    <div class="tag">grid</div>
                </div>
                <div class="sliderWrapper"> 
                    <div class="tag">pause</div>
                    <input type=checkbox bind:checked={ast.pauseRender}>
                    <div class="tag">render</div>
                </div>
                {/if}
            </div>
            <br><br>
        </div>
    </div>
  </body>
</html>