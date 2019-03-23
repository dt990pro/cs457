#version 330 compatibility

uniform float uAd;
uniform float uBd;
uniform float uTol;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uAlpha;
uniform bool uUseChromaDepth;
uniform float uChromaBlue;
uniform float uChromaRed;
uniform sampler3D Noise3;

in vec4  vColor;
in vec3  vMCposition;
in vec3  vECposition;
in float vLightIntensity;
in vec2  vST;

vec4 WHITE = vec4( 1., 1., 1., uAlpha );


vec4
Rainbow( float t )
{
	t = clamp( t, 0., 1. );

	float r = 1.;
	float g = 0.0;
	float b = 1.  -  6. * ( t - (5./6.) );

        if( t <= (5./6.) )
        {
                r = 6. * ( t - (4./6.) );
                g = 0.;
                b = 1.;
        }

        if( t <= (4./6.) )
        {
                r = 0.;
                g = 1.  -  6. * ( t - (3./6.) );
                b = 1.;
        }

        if( t <= (3./6.) )
        {
                r = 0.;
                g = 1.;
                b = 6. * ( t - (2./6.) );
        }

        if( t <= (2./6.) )
        {
                r = 1.  -  6. * ( t - (1./6.) );
                g = 1.;
                b = 0.;
        }

        if( t <= (1./6.) )
        {
                r = 1.;
                g = 6. * t;
        }

	return vec4( r, g, b, 1. );
}


void
main()
{
	// read the glman noise texture and convert it to a range of [-1.,+1.]:
	
	vec4 nv  = texture3D( Noise3, uNoiseFreq*vMCposition );
	float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
	n = n - 2.;                             // -1. -> 1.
	n *= uNoiseAmp;



	// determine the color based on the noise-modified (s,t):

	float Ar = uAd/2.;
	float Br = uBd/2.;

	int numins = int( vST.s / uAd );
	int numint = int( vST.t / uBd );

	float sc = float(numins) * uAd  +  Ar;
	float ds = vST.s - sc;                   // wrt ellipse center
	float tc = float(numint) * uBd  +  Br;
	float dt = vST.t - tc;                   // wrt ellipse center
	
	float oldDist = sqrt( ds*ds + dt*dt );
	float newDist = oldDist + n;
	float scale = newDist / oldDist;        // this could be < 1., = 1., or > 1.
	
	ds *= scale;                            // scale by noise factor
	ds /= Ar;                               // ellipse equation
	
	dt *= scale;                            // scale by noise factor
	dt /= Br;                               // ellipse equation
	
	float d = ds*ds + dt*dt;
	float s = smoothstep( 1. - uTol, 1. + uTol, d );

	
	if ( uUseChromaDepth )
	{
		float t = (2./3.) * ( vECposition.z - uChromaRed ) / ( uChromaBlue - uChromaRed );
		t = clamp( t, 0., 2./3. );
		gl_FragColor = mix( Rainbow( t ), WHITE, s );
	}
	else gl_FragColor = mix( vColor, WHITE, s );


	// uAlpha
	if (uAlpha == 0. && gl_FragColor == WHITE) {
		discard;
	}

	gl_FragColor.rgb *= vLightIntensity;
}