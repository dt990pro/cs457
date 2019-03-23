#version 330 compatibility
out vec4 FragColor;

in vec3 Normal;
in vec3 Position;
in vec3 vPos;
in vec2 vST;

uniform vec3 cameraPos;
uniform vec3 light;		// light Position
uniform samplerCube skybox;
uniform bool use_b;
uniform bool use_copper;
uniform sampler2D texture1;

float uAd = 0.7;
float uBd = 0.03;
float uTol = 10.;

vec4 nv = texture( texture1, vST );

void main()
{
	vec3 I = normalize(Position - cameraPos);
    vec3 R = reflect (I, normalize(Normal));

	// get original reflect
	vec3 vColor = texture(skybox, R).rgb;

	// ambient
	vec3 ambient = 0.3 * vColor;

	// diffuse
	vec3 vLight = normalize(light - vPos);
	vec3 diffuse = max(dot(vLight, Normal), 0.0) * vColor;

	// highlight specular
	vec3 vEye = normalize(cameraPos - vPos);
	float spec;

    // use Blinn-Phong
    vec3 vHalfway = normalize(vLight + vEye);
    if (use_b) spec = pow (max (dot( Normal, vHalfway), 0.0), 16.0);		// set gloss
    else  spec = pow (max(dot(vEye, R), 0.0), 4.0);
    
    vec3 specular = spec * vColor;

	vec4 original_color = vec4(ambient + diffuse + specular, 1.0);

	// use copper
	if (use_copper) {
		// make copper
		ambient =	1.5 * vec3(ambient.r * 0.19125, ambient.g * 0.0735, ambient.b * 0.0225);
		diffuse =	1.5 * vec3(diffuse.r * 0.7038, diffuse.g * 0.27048, diffuse.b * 0.22648);
		specular =	1.5 * vec3(specular.r * 0.256777, specular.g * 0.137622, specular.b * 0.086014);
		vec4 Color = vec4(ambient + diffuse + specular, 1.0);

		// determine the color based on the noise-modified (s,t):
		float n = 0.015;
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

		vec4 Color1 = mix( Color, nv, .3 );
		FragColor = mix( Color, Color1, s );
	}
	else FragColor = original_color;
}