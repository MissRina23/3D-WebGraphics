struct Light{
    vec4 position;
    vec3 color;

};

uniform Light light;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

attribute vec3 vertexPosition;
attribute vec3 vertexNormal;
attribute vec2 vertexTexcoords;

varying vec2 texcoords; // output to fragment shader
varying vec3 ecPosition;
varying vec3 ecNormal;
varying vec3 ecLightPosition; 



void main() {

    texcoords = vertexTexcoords; // hand over to fragment shader
	ecPosition = (modelViewMatrix * vec4(vertexPosition, 1.0)).xyz;
    ecNormal = normalize(normalMatrix * vertexNormal);
    ecLightPosition = (modelViewMatrix * light.position).xyz;

    gl_Position = projectionMatrix * vec4(ecPosition, 1.0);
} 
