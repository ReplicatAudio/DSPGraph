<script>
    const basicVariables=`x -> graph x value relative to the wave period
s -> periodic sine wave (Math.sin(x))`;
    const paraamters = `p[0->7] -> access the value of a parameter`;
    const output = `w[0->3] -> output to a specific waveform on the graph.`;
    const mathHelpers = `pi -> Math.PI
pi2 -> Math.PI * 2
halfPi -> Math.PI / 2
sin(n) -> Math.sin(n)
cos(n) -> Math.cos(n)
abs(n) -> Math.abs(n)
tan(n) -> Math.tan(n)
tanh(n) -> Math.tanh(n)
round(n) -> Math.round(n)
floor(n) -> Math.floor(n)
ceil(n) -> Math.ceil(n)
sign(n) -> Math.sign(n)
random() -> Math.random()
noise() -> (Math.random() * 2) - 1`;
    const globals = `makeGlobalNum(i) -> forces the global variable to be a number
mareGlobalArr(i) -> forces the global variable to be an array`;
</script>

<div>
    <div class="modalScroll">
    <h4>Basic Variables</h4>
        <pre>{basicVariables}</pre>
        <h4>Parameters</h4>
        Parameters range from 0 to 1 with a step size of 0.001.
        <pre>{paraamters}</pre>
        <h4>Output</h4>
        The last line of your JS code will be graphed as the first waveform.
        <br>
        You can graph up to 3 other waveforms.
        <pre>{output}</pre>
        <h4>Math Helpers</h4>
        <pre>{mathHelpers}</pre>
        <h4>Globals</h4>
        Globals allow you to store data outside the scope of your loop.
        <br>
        By default, all global variables are arrays. Which is useful for dealing with buffers.
        <pre>{globals}</pre>
    </div>
</div>