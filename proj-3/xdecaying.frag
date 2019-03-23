#version 330 compatibility

uniform float uNoiseAmp, uNoiseFreq, uKa, uKd, uKs, uShininess;
uniform vec4 uColor, uSpecularColor;
uniform sampler3D Noise3;

// smooth light
in vec3 vNs;
in vec3 vLs;
in vec3 vEs;

in vec3 vMC;

vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}

void main(){
	// Use the glman noise capability to get two noise values
	// These will be treated as an angle to rotate the normal about x and an angle to rotate the normal about y
	vec4 nvx = texture( Noise3, uNoiseFreq*vMC );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= uNoiseAmp;
    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;

	vec3 Normal = RotateNormal( angx, angy, vNs );
	vec3 Light = normalize(vLs);
	vec3 Eye = normalize(vEs);

	vec3 ambient = uColor.rgb;
	vec3 diffuse = uColor.rgb * max( dot( Light, Normal ), 0. );
	vec3 Light_Reflection = normalize( reflect( -Light, Normal) );
	vec3 spec = uSpecularColor.rgb * pow( max( dot( Light_Reflection, Eye ), 0. ), uShininess );

	gl_FragColor = vec4(uKa*ambient + uKd*diffuse + uKs*spec, 1.);
}