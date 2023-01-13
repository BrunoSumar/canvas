precision highp float;
uniform float Time;
uniform vec2 Resolution;
uniform vec2 Mouse;
varying vec2 Position;

#define PI 3.1415926538

void main()
{
  vec2 uv = Position;
  vec2 m = Mouse;
  vec4 yellow = vec4(vec3(1., 1., .2),1.);
  vec4 back = vec4(0.);

  uv *= 1.;
  uv += vec2(.5);

  float size = .7;

  uv = fract( uv );
  uv *= 2. / size;
  uv -= vec2( 1. / size );

  float x = 2.5 * (atan(uv.y, uv.x) / PI);
  float y = length(uv);

  float s = sign( cos((PI / 2.) + x * PI * 2.) );

  x = (s * x) + (( 1. - s ) / 2.);
  x = fract( x );

  float t = y - x;
  t = step(.0, t);

  gl_FragColor = mix( yellow, back, t );
}
