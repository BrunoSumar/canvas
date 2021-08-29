precision mediump float;
uniform float Time;
uniform vec2 Resolution;
uniform vec2 Mouse;
varying vec2 Position;

void main()
{
  vec2 uv = Position;
  vec2 m = Mouse;

  float ratio = Resolution.x/Resolution.y;
  uv.x *= ratio;
  m.x *= ratio;

  float dist = length(uv-m);
  dist = step(.75, dist);

  uv *= 4.;
  uv.x += cos(uv.y)+uv.y/2.;
  uv += Time/3000.;

  vec2 i = floor(uv);
  vec2 f = fract(uv);

  vec4 a = vec4(vec3(.1, .6, 1.),1.);
  vec4 b = vec4(0.0);


  float t = step(0., cos(length(uv-m)*25.*(Time/100.)));
  t = step(.5, f.x);
  // t = step(.3, dist) * t;
  // t = 1. - t;
  t = mix(t, 1.-t, dist);

  gl_FragColor = mix(a, b, t);
}
