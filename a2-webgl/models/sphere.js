/*
 * WebGL core teaching framwork 
 * changes by Martin Puse, mpuse@beuth-hochschule.de
 *
 * Module: Sphere
 *
 * This function creates an object to draw a sphere.
 */

/* requireJS module definition */
define(['vbo'], 
function(vbo) {
       
    'use strict';
    
    // constructor, takes WebGL context object as argument
    function Sphere(gl, config) {
        console.log('Creating a unit Sphere.'); 
    
        config = config || {};
        this._numLatitudes  = config.numLatitudes  || 32;
        this._numLongitudes = config.numLongitudes || 32;
        this._radius        = config.radius || 1;
        this.mat            = config.mat;
        
        // generate the attributes
        var coords    = [];
        var normals   = [];
        var texcoords = [];
        for (var latitude = 0; latitude <= this._numLatitudes; latitude++) {
            var theta = latitude * Math.PI / this._numLatitudes;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (var longitude = 0; longitude <= this._numLongitudes; longitude++) {
                var phi = longitude * 2 * Math.PI / this._numLongitudes;
                var cosPhi = Math.cos(phi);
                var sinPhi = Math.sin(phi);
                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;
                normals.push(x);
                normals.push(y);
                normals.push(z);
                texcoords.push(1 - longitude / this._numLongitudes); // u
                texcoords.push(1 - latitude  / this._numLatitudes);  // v
                coords.push(this._radius * x);
                coords.push(this._radius * y);
                coords.push(this._radius * z);
            }
        }

        // generate the indices
        var indices = [];
        for (var latitude  = 0; latitude  < this._numLatitudes;  latitude++)
        for (var longitude = 0; longitude < this._numLongitudes; longitude++) {
            
            var first  = latitude * (this._numLongitudes + 1) + longitude;
            var second = first + this._numLongitudes + 1;
            indices.push(first);
            indices.push(second);
            indices.push(first + 1);

            indices.push(second);
            indices.push(second + 1);
            indices.push(first + 1);
        }

        // create the attribute vbos
        this.coordsBuffer = new vbo.Attribute(gl, {
            numComponents : 3,
            dataType      : gl.FLOAT,
            data          : coords 
        });
        this.normalsBuffer = new vbo.Attribute(gl, {
            numComponents : 3,
            dataType      : gl.FLOAT,
            data          : normals 
        });
        this.texcoordsBuffer = new vbo.Attribute(gl, {
            numComponents : 2,
            dataType      : gl.FLOAT,
            data          : texcoords 
        });
        // create the index vbo
        this.indicesBuffer = new vbo.Indices(gl, {
            indices : indices
        });
    }

    // draw method: activate buffers and issue WebGL draw() method
    Sphere.prototype.draw = function(gl, program, modelViewMatrix) {
        // bind the attribute buffers
        this.coordsBuffer.bind(gl, program, 'vertexPosition');
        this.normalsBuffer.bind(gl, program, 'vertexNormal');
        this.indicesBuffer.bind(gl);
        this.texcoordsBuffer.bind(gl, program, 'vertexTexcoords');

        program.use();
        program.setUniform("material.ambient", "vec3", this.mat.ambient);
        program.setUniform("material.diffuse", "vec3", this.mat.diffuse);
        program.setUniform("material.specular", "vec3", this.mat.specular);
        program.setUniform("material.shininess", "float", this.mat.shininess);
        program.setUniform("light.position", "vec4", [10,10,10,1]);
        program.setUniform("light.color", "vec3", [1,1,1]);
        program.setUniform("modelViewMatrix", "mat4", modelViewMatrix);
        this.normalMatrix = mat3.create();
        mat4.toInverseMat3(modelViewMatrix, this.normalMatrix);
        mat3.transpose(this.normalMatrix);
        program.setUniform("normalMatrix", "mat3", this.normalMatrix);
        gl.drawElements(gl.TRIANGLES, this.indicesBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
        this.coordsBuffer.unbind(gl, program, 'vertexPosition');
        this.normalsBuffer.unbind(gl, program, 'vertexNormal');
        this.texcoordsBuffer.unbind(gl, program, 'vertexTexcoords');
        this.indicesBuffer.unbind(gl);
    };
        
    // this module only returns the constructor function    
    return Sphere;
}); // define
