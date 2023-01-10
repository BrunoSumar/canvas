const VERTEX_SHADER_TEXT = `
    precision mediump float;
    attribute vec4 vertPosition;
    varying vec2 Position;
    void main()
    {
        Position = vertPosition.xy;
        gl_Position = vertPosition;
    }
`;

const INITIAL_FRAGMENT_SHADER_TEXT = `
    precision mediump float;
    uniform float Time;
    uniform vec2 Resolution;
    uniform vec2 Mouse;
    varying vec2 Position;

    void main()
    {
        gl_FragColor = vec4(.0);
    }
`;
