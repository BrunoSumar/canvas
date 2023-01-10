precision mediump float;
uniform float Time;
uniform vec2 Resolution;
varying vec2 Position;


float rand(vec2 v){
  return fract(cos(dot(v,vec2(123.78,535.983)))*887.25523);
}

float noise(vec2 v){
  float i = smoothstep(0., 1., fract(v.x));
  float j = smoothstep(0., 1., fract(v.y));
  v = floor(v);
  float a = rand(v);
  float b = rand(v + vec2(1.,0.));
  float c = rand(v + vec2(0.,1.));
  float d = rand(v + vec2(1.,1.));

  float e = mix(a, b, i);
  float f = mix(c, d, i);

  return mix(e, f, j);
}

void main()
{
  vec2 uv = Position;
  // uv *= 16.*Time/10000.;
  uv *= 3.;
  // uv += Time/400.;
  // uv = floor(uv);
  // uv += cos(Time /1000.);
  // gl_FragColor = vec4(vec3(rand(uv)),1.);
  gl_FragColor = vec4(vec3(noise(uv)),1.);
}
