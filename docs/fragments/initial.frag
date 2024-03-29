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
  dist = step(.8, dist);

  uv *= 1.2;
  uv.y *= 2.;
  uv.x += cos(uv.y)+uv.y/1.7;
  uv += Time/3000.;

  vec4 background = vec4(0.0);
  vec4 cor = vec4(vec3(.1, .6, 1.),1.); // azul
  // cor = vec4(vec3(1., .0, .1),1.); // vermelho

  vec2 f = fract(uv);
  float t = step(.5, f.x );
  t = t * (1. - dist);

  gl_FragColor = mix(background, cor, t);
}
