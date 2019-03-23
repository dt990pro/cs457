#version 330 compatibility

out vec3 vNormal;

void main() {
	vNormal = normalize( gl_NormalMatrix * gl_Normal );
	vec4 vertex = gl_Vertex;
	vertex.x -= 1.;
	vertex.y -= 1.;
	vertex.z += 2.6;
	gl_Position = vertex;
}