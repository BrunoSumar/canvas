    precision mediump float;
    uniform float Time;
    uniform vec2 Resolution;
    uniform vec2 Mouse;
    varying vec2 Position;
    void main()
    {
       vec2 uv = Position;
       vec2 m = Mouse;
       // m *= 2.;
       // m -= 1.;
       uv += cos(Time/1000.);
       gl_FragColor = vec4(vec3(length(uv)),1.);
       // gl_FragColor = vec4(vec3(step(m.y, uv.y)),1.);
    }
