<script>
    const basicVariables=`x -> graph x value relative to the wave period
s -> periodic sine wave (Math.sin(x))`;
    const paraamters = `p[0->7] -> access the value of a parameter`;
    const output = `w[0->3] -> output to a specific waveform on the graph.`;
    const mathHelpers = `pi -> Math.PI
pi2 -> Math.PI * 2
halfPi -> Math.PI / 2
sin() -> Math.sin()
cos() -> Math.cos()
abs() -> Math.abs()
tan() -> Math.tan()
tanh() -> Math.tanh()
round() -> Math.round()
floor() -> Math.floor()
ceil() -> Math.ceil()
random() -> Math.random()
noise() -> (Math.random() * 2) - 1`;
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
    </div>
</div>