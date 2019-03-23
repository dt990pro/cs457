#version 330 compatibility

float e = 2.71828;
float pi = 3.14159265;

uniform float uA, uB, uC, uD, uE;

out vec3 vNs;
out vec3 vMC;
out vec3 vEC;

void main() {
	vMC = gl_Vertex.xyz;

	float r = sqrt( gl_Vertex.x * gl_Vertex.x + gl_Vertex.y * gl_Vertex.y );
	float drdx = gl_Vertex.x / r;
	float drdy = gl_Vertex.y / r;
	float dzdr = uA / pow( e, uD * r ) * cos( 2 * pi * uB * r + uC );
	float dzdx = dzdr * drdx;
	float dzdy = dzdr * drdy;

	// displace Z
	float Z = uA * cos( 2 * pi * uB * r + uC ) / pow( e, uD * r );
	vec4 vertex = vec4(gl_Vertex.x, gl_Vertex.y, Z, gl_Vertex.w);
	vec4 ECposition = gl_ModelViewMatrix * vertex;
	vEC = ECposition.xyz;

	vec3 xslope = vec3( 1., 0., dzdx);
	vec3 yslope = vec3( 0., 1., dzdy);
	vNs = normalize( gl_NormalMatrix * cross( xslope, yslope ) );		// surface normal vec

	gl_Position = gl_ModelViewProjectionMatrix * vertex;
}