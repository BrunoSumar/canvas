precision highp float;
uniform float Time;
uniform vec2 Resolution;
uniform vec2 Mouse;
varying vec2 Position;
void main()
{
  vec2 uv = Position;
  vec2 m = Mouse;
  vec4 yellow = vec4(vec3(1., 1., .2),1.);
  vec4 back = vec4(0.);

  float x = 0.;
  float y = length(uv);

  float p = step(.0, uv.x);

  gl_FragColor = mix(yellow, back, p);
  // gl_FragColor = vec4(vec3(step(m.y, uv.y)),1.);
}
