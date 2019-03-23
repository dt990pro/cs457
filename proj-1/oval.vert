#version 330 compatibility

#define aVertex gl_Vertex 

out vec4  vColor;
out vec3  vMCposition;
out float vLightIntensity; 
out vec2  vST;

vec3 LIGHTPOS   = vec3( -2., 0., 10. );

void
main( )
{
	vST = gl_MultiTexCoord0.st;

	vColor = gl_Color;

	vec3 tnorm			= normalize( gl_NormalMatrix * gl_Normal );
	vec3 ECposition		= vec3( gl_ModelViewMatrix * gl_Vertex );
	vLightIntensity		= abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );

	vMCposition		= gl_Vertex.xyz;
	gl_Position		= gl_ModelViewProjectionMatrix * aVertex;
}