<script>
    import { Canvas, Layer, t } from "svelte-canvas";
	import { add_styles } from "svelte/internal";
    export let st;
    export let cfg;
    export let ast;
    // Wave runner
    function wave(x,s,g,p)
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
            const sign = Math.sign;
            const random = Math.random;
            const noise = ()=>{return (Math.random()*2)-1};
            const sampleRate = 640;

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
    $: render = ({ context, width, height }) => {

        if(ast.pauseRender){return};

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
        
        // Define a global scope / persistent variable
        let g = [];
        g.length = 16;
        g.fill([]);
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
                    ctx.moveTo(i,hc+(-wave(x,s,g, st.paramVals)[wi]*(amp*hc)));
                }
                else{
                    ctx.lineTo(i,hc+(-wave(x,s,g, st.paramVals)[wi]*(amp*hc)));
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
<div>
    <Canvas width={640} height={320} autoclear={false}>
        <Layer {render} />
    </Canvas>
</div>