precision mediump float;
uniform float Time;
uniform vec2 Resolution;
varying vec2 Position;


float rand( vec2 v ){
  return fract(cos(dot(v,vec2(123.78,535.983)))*887.25523);
}

// vec2 rand2( vec2 v ){
//   return vec2( sin( dot(v, vec2(97.97,3.65)) ), cos( dot(v, vec2(46.98,39.525)) ) );
// }

float noise(vec2 v){
  float i = smoothstep(0., 1., fract(v.x));
  float j = smoothstep(0., 1., fract(v.y));

  // for( int i = 0; i < 1; i++ ){
  //   v = rand2( v );
  // }
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
  uv *= 3.;


  gl_FragColor = vec4(vec3(noise(uv)),1.);
}
