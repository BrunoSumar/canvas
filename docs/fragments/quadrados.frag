precision highp float;
uniform float Time;
uniform vec2 Resolution;
varying vec2 Position;

float rand(vec2 v){
  return fract(cos(dot(v,vec2(123.78,535.983)))*887.25523);
}





float sdf(vec2 v, float r){
  return length(v) - r;
}

float sdfCaixa(vec2 p, float b){
  vec2 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,q.y),0.0);
}

float inside(vec2 v){
  if(sdfCaixa(v, .1) <= 0.)
    return 1.0;
  return 0.0;
}

void main()
{
  vec2 uv = Position;

  float ratio = Resolution.y/Resolution.x;
  uv.y *= ratio;
  // uv *= 16.*Time/10000.;
  // uv *= 45.;
  // uv *= 120.;
  uv *= 40.;
  vec2 i = floor(uv);
  vec2 d = fract(uv);

  d *= 2.;
  d -= 1.;
  // d += cos(rand(i)) * .9;
  // d.y += cos(i.x) * .9;
  // d.x += sin(i.y) * .2;

  vec4 a = vec4(1., .2, .8, 1.);
  vec4 b = vec4(1., .9, 0.0, 1.);
  b = vec4(vec3(0.08),1.);

  vec4 col = mix(a, b, step( .0, sdfCaixa(d, uv.y/400.)));
  col = mix(a, b, step( .0, sdf(d, 2.1*(.04 - uv.y/400.))));
  // col = mix(a, b, step( .0, sdfCaixa(d, smoothstep( 0.01, 2.2, length(uv/40.)) )));
  // col = mix(a, b, step( .0, sdfCaixa(d, smoothstep( 0.0, 2., abs(uv.y/40. + sin(uv.x/20.)/5.) ))));

  // usar o sen de y e n o len


  // uv += Time/400.;
  // uv = floor(uv);
  // uv += cos(Time /1000.);
  // gl_FragColor = vec4(vec3(rand(uv)),1.);
  gl_FragColor = col;
}
