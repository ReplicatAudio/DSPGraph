<script>
    import { stLS } from "./store.js";
    import {examples} from "../examples";
    const cfg = {
        maxWaves: 4,
        paramCount: 8
    }
    let ast = {
        modal: {
            show: false,
            type: 'none',
        }
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
        userJS: `// Write your JS code here
// x -> graph x
// s -> sine (Math.sin(x))
// p[index] -> param controls (sliders)
// graph shows last expression 
// or value of 'w[index]'

// Make a square wave
s > 0 ? 1 : -1;`,
    };
    // Create a deep copy of the st object for restoring
    const stb = JSON.parse(JSON.stringify(st));
    function resetState(){
        if(confirm("Reset all code and paramters?"))
        {
            st = JSON.parse(JSON.stringify(stb));
            setup(true);
        }
    }
    function saveToLS()
    {
        if(!confirm("Overwrite existing local storage?")){return;};
        $stLS = JSON.parse(JSON.stringify(st));
        console.log(JSON.stringify($stLS, null, 2));
    }
    function loadFromLS(showAlert=true)
    {
        if(showAlert)
        {
            if(!confirm("Lose unsaved changes?")){return;};
        }
        if($stLS.periods)
        {
            st = JSON.parse(JSON.stringify($stLS));
            //if(showAlert){alert('loaded!');};
        }
        else{
            alert('No Data To Load!');
        }
    }
    function showModal(type){
        ast.modal.type = type;
        ast.modal.show = true;
    }
    function closeModal()
    {
        ast.modal.show = false;
    }
    function loadExample(json)
    {
        st = JSON.parse(JSON.stringify(json));
        closeModal();
    }

    function setup(skipLS=false){
        st.paramVals.length = cfg.paramCount;
        st.paramVals.fill(0.5);
        // if(!skipLS)
        // {
        //     loadFromLS(false);
        // }
    }
    setup();

    // Wave runner
    function wave(x,s,p)
    {
        const js = st.userJS;
        try{
            st.errStr = "";
            st.hasErr = false;
            let w = [];
            w.length = cfg.maxWaves;
            // Math vars
            const pi = Math.PI;
            const pi2 = Math.PI*2;
            const halfPi = Math.PI/2;
            const sin = Math.sin;
            const cos = Math.cos;
            const abs = Math.abs;
            const tan = Math.tan;
            const tanh = Math.tanh;
            const round = Math.round;
            const floor = Math.floor;
            const ceil = Math.ceil;
            const random = Math.random;

            const xr = x/pi2;

            const we = eval(js);
            w[0] = w[0] === undefined ? we : w[0];
            return w;
        }
        catch(err)
        {
            if(st.errStr !== err)
            {
                //console.log(err);
            }
            st.errStr = err;
            st.hasErr = true;
            return 0;
        }
    }

    // Canvas
    import { Canvas, Layer, t } from "svelte-canvas";

    $: render = ({ context, width, height }) => {
        const ctx = context;// cant rename in render func
        const w = 640;
        const h = 320;
        const hc = h/2;

        const amp = st.amplitude/2;

        const gs = st.gridSize*2;
        const gx = w/(st.periods*gs);
        const gy = h/gs;

        ctx.clearRect(0,0,w,h);

        if(st.showGrid)
        {
            for (let i =0; i < st.periods*gs; i++)
            {
                ctx.beginPath();
                ctx.setLineDash([]);
                ctx.moveTo(gx*(i+1),0);
                ctx.lineTo(gx*(i+1),h);
                ctx.strokeStyle = "rgb(55,50,55)";
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.closePath();
            }
            for (let i =0; i < gs; i++)
            {
                ctx.beginPath();
                ctx.setLineDash([]);
                ctx.moveTo(0,gy*(i+1));
                ctx.lineTo(w,gy*(i+1));
                ctx.strokeStyle = "rgb(55,50,55)";
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.closePath();
            }
        }
        

        // Could add an optimization to only run active waves
        for(let wi = 0; wi < cfg.maxWaves; wi++)
        {
            ctx.beginPath();
            ctx.setLineDash([]);
            ctx.lineWidth = 2;
            ctx.moveTo(0, hc);
            for(let i = 0; i < w; i++)
            {
                const x = i/(w/(Math.PI*(st.periods*2)));
                const s = Math.sin(x);
                if(i===0)
                {
                    // Dont draw a line on first move
                    ctx.moveTo(i,hc+(-wave(x,s, st.paramVals)[wi]*(amp*hc)));
                }
                else{
                    ctx.lineTo(i,hc+(-wave(x,s, st.paramVals)[wi]*(amp*hc)));
                }
            }
            const strokeStyles = [
                "rgb(255,200,255)",
                "rgb(255,255,200)",
                "rgb(200,255,255",
                "rgb(255,255,255)",

                "rgb(255,200,255)",
                "rgb(255,255,200)",
                "rgb(200,255,255",
                "rgb(255,255,255)",

                "rgb(255,200,255)",
                "rgb(255,255,200)",
                "rgb(200,255,255",
                "rgb(255,255,255)",

                "rgb(255,200,255)",
                "rgb(255,255,200)",
                "rgb(200,255,255",
                "rgb(255,255,255)"
            ];
            ctx.strokeStyle = strokeStyles[wi];           
            ctx.stroke();
            ctx.closePath();
        }
        if(st.showRefSine)
        {
            ctx.beginPath();
            ctx.setLineDash([5, 15]);
            ctx.lineWidth = 1;
            // ref sine
            for(let i = 0; i < w; i++)
            {
                const x = i/(w/(Math.PI*(st.periods*2)));
                const s = Math.sin(x);
                ctx.lineTo(i,hc+(-s*(amp*hc)));
            }
            ctx.strokeStyle = "rgb(255,225,255)";
            ctx.stroke();
        }
    };
</script>

<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>ReplicatAudio DSP Tool</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    {#if ast.modal.show}
    <div class="modalShade" on:click={closeModal}></div>
    <div class="modal">
        <button class="modalCloseBtn" on:click={closeModal}>x</button>
        <h3>{ast.modal.type.toUpperCase()}</h3>
        {#if ast.modal.type === "settings"}
        <pre style="max-width:100; overflow:scroll;background:var(--bgSub)">
{JSON.stringify(st, null, 2)}
        </pre>
        {/if}
        {#if ast.modal.type === "examples"}
        <center>
            <br>
            {#each Object.entries(examples) as [key, val]}
            <button on:click={()=>{loadExample(val)}} class="loadItem">{key}</button>
            {/each}
        </center>
        {/if}
    </div>
    {/if}
    <div class="codeArea">
        <div class="menu">
            <button class="menuItem" on:click={saveToLS}>Save</button>
            <button class="menuItem" on:click={loadFromLS}>Load</button>
            <button class="menuItem" on:click={resetState}>Reset</button>
            <button class="menuItem" on:click={()=>{showModal("examples")}}>Examples</button>
            <button class="menuItem" on:click={()=>{showModal("settings")}}>Settings</button>
            <button class="menuItem" on:click={()=>{showModal("settings")}}>Help</button>
        </div>
        {#if st.hasErr}
        <div class="errMsg">
            {st.errStr}
            <br>
            See the JS Console for more info.
        </div>
        {/if}
        <textarea bind:value={st.userJS} id="userJS" spellcheck="false"></textarea>
    </div>
    <div class="plotArea">
        <div class="headerImg">
            <img src="/ra_logo.png" alt="ReplicatAudio Logo">
        </div>
        <br>
        <Canvas width={640} height={320}>
            <Layer {render} />
        </Canvas>
        <div class="sliderGroup">
            <h3>Parameter Controls</h3>
            {#each st.paramVals as param, i}
            <div class="sliderWrapper"> 
                <input type="number" bind:value={param} class="sliderText" min="0" max="1" step="0.01">
                <br>
                <input bind:value={param} type="range" min="0" max="1" step="0.001">
                <div class="tag">p[{i}]</div>
            </div>
            {/each}
        </div>
        <div class="sliderGroup">
            <h3>Global Controls</h3>
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
            
        </div>
    </div>
  </body>
</html>