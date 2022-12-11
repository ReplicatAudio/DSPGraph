<script>
    import { onMount } from 'svelte'
	
	onMount(async () => {
        ace.config.set('basePath', 'https://cdn.jsdelivr.net/npm/ace-builds@1.13.2/src-noconflict/');
        ast.editor = ace.edit("editor");
        // ace.edit(editor, {
        //     mode: "ace/mode/javascript",
        //     selectionStyle: "text"
        // });
        //ast.editor.setTheme("ace/theme/dracula");
        //ast.editor.setTheme("ace/theme/one_dark");
        ast.editor.setTheme("ace/theme/pastel_on_dark");
        //editor.resize();
        //editor.setTheme("ace/theme/solarized");
        ast.editor.session.setMode("ace/mode/javascript");
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
        }, 333);
	})
    
    function resizeEditor()
    {
        editor.resize();
    }
    import Clipboard from "svelte-clipboard";
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
        },
        fileinput: undefined,
        editor: undefined,
        useAce: true,
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
        showParams: false,
        showGlobal:false,
        fileName: "MyDSP",
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
    function loadFromLS(showAlert=true)
    {
        if(showAlert)
        {
            if(!confirm("Lose unsaved changes?")){return;};
        }
        if($stLS.periods)
        {
            st = JSON.parse(JSON.stringify($stLS));
            ast.editor.setValue(st.userJS);
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
    function setup(skipLS=false){
        st.paramVals.length = cfg.paramCount;
        st.paramVals.fill(0.5);
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
                "rgb(200,255,255",
                "rgb(255,200,255)",
                "rgb(255,255,200)",
                
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
<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.13.2/src-noconflict/ace.min.js" on:load={setup}></script>
</svelte:head>