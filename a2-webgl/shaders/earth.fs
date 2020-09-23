//precision mediump float;   // doesnt work on some machines
precision highp float;

struct Light{
    vec4 position;
    vec3 color;
};

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

uniform Material material;
uniform Light light;
uniform vec3 ambientLight;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
//uniform mat3 normalMatrix;
uniform sampler2D uSamplerDay;
uniform sampler2D uSamplerNight; // global
uniform sampler2D uSamplerWater;
uniform sampler2D uSamplerCloud;

varying vec2 texcoords; // input from vertex shader
varying vec3 ecPosition;
varying vec3 ecNormal;
varying vec3 ecLightPosition;
varying vec3 color;



vec3 phong(vec3 p, vec3 v, vec3 n, vec3 lp, vec3 lc) {

	// derived vectors
    vec3 toLight = normalize(lp - p);
    vec3 reflectLight = reflect(-toLight, n);


    // scalar products
    float ndots = max(dot(toLight, n), 0.0);
    float rdotv = max(dot(reflectLight, v), 0.0);


    // phong sum
    vec3 ambi = material.ambient * ambientLight;
    vec3 diff = material.diffuse * ndots * lc;
    vec3 spec = material.specular *
     pow(rdotv, material.shininess) * lc;

    return ambi + diff + spec;

    //return vec3(1, 0, 0);
}

void main() {

        vec3 toLight = normalize(ecLightPosition - ecPosition);
        float doti = dot(toLight,ecNormal);

        // fetch texel
        vec3 texColor = texture2D(uSamplerDay, texcoords).rgb*max(0.0,doti);
        texColor += texture2D(uSamplerNight, texcoords).rgb*-min(doti,0.0);


		vec3 viewDir = projectionMatrix[2][3] == 0.0 ? vec3(0, 0, 1) : normalize(-ecPosition);


        gl_FragColor = vec4(texColor,1);
}
