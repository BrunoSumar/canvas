precision highp float;
uniform float Time;
uniform vec2 Resolution;
uniform vec2 Mouse;
varying vec2 Position;

#define PI 3.1415926538

vec2 rotatedVecNorm( float angle ){
  float rad = radians( angle );
  return vec2( cos( rad ), sin( rad ) );
}

float distVector( vec2 vector, vec2 uv ){
  return dot( vector, uv ) / length( vector ) - length( vector );
}

float rand(vec2 v){
  return fract(cos(dot(v,vec2(713.78,535.9883)))*887.25523);
}

void main()
{
  float ratio = Resolution.x/Resolution.y;
  vec2 uv = Position;
  vec2 m = Mouse;
  uv.x *= ratio;
  uv *= 2.;

  vec4 yellow = vec4(vec3(1., 1., .2),1.);
  vec4 back = vec4(0.);

  float noise = rand( floor(uv) );

  float size = .1 ;

  uv.y += noise / 3.3;
  uv = fract( uv );
  uv *= 2. / size;
  uv -= vec2( 1. / size );

  float t = 0.;
  float raio = .1 + noise * 1.2;
  vec2 v;
  float i = 0.;
  for( float i = 0.; i < 5.; i++ ){
    v = rotatedVecNorm( (noise * Time / 3000. + i) * 360. / 5. ) * raio;
    t += step( 0., -distVector( v, uv ) );
  }

  t -= 3.;
  t = step(.5, t);

  gl_FragColor = mix( back, yellow, t );
}
