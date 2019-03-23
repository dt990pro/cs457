#version 330 compatibility
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;
layout (location = 2) in vec2 aTexCoords;

out vec3 Position;
out vec3 Normal;
out vec3 vPos;
out vec2 vST;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform float Timer;

const float PI = 3.14159265;

void main()
{
	vST = aTexCoords;

    Normal = mat3 (transpose(inverse(model))) * aNormal;
	Position = vec3(model * vec4(aPos, 1.0));	// world pos of camera

	vec3 vNormal = aNormal;
	vec3 vPos = aPos;

    gl_Position = projection * view * model * vec4(aPos, 1.0);
}