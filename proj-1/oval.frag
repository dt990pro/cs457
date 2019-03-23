#version 330 compatibility

uniform float uAd;
uniform float uBd;
uniform float uTol;

in vec4  vColor;
in vec3  vMCposition;
in float vLightIntensity;
in vec2  vST;

const vec4 WHITE = vec4( 1., 1., 1., 1.);

void
main()
{
	float Ar = uAd/2.;
	float Br = uBd/2.;
	int numins = int( vST.s / uAd );
	int numint = int( vST.t / uBd );

	float sc = numins *uAd + Ar;
	float tc = numint *uBd + Br;

	float x = ((vST.s - sc) / Ar) * ((vST.s - sc) / Ar) + ((vST.t - tc) / Br) * ((vST.t - tc) / Br);

	float d = smoothstep( 1. - uTol, 1. + uTol, x );
	gl_FragColor = mix( vColor, WHITE, d );
	gl_FragColor.rgb *= vLightIntensity;
}