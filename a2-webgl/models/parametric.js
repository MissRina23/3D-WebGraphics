/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 * changes by Martin Puse, mpuse@beuth-hochschule.de
 *
 * Module: ParametricSurface
 *
 * This function creates an object to draw any parametric surface.
 */

/* requireJS module definition */
define(['vbo'], 
function(vbo) {
       
    'use strict';
    
    /* constructor for Parametric Surface objects
     * gl:  WebGL context object
     * posFunc: function taking two arguments (u,v) and returning coordinates [x,y,z]
     * config: configuration object defining attributes uMin, uMax, vMin, vMax, 
     *         and drawStyle (i.e. 'points', 'wireframe', or 'surface')
     */ 
    function ParametricSurface(gl, posFunc, config) {

        // read the configuration parameters
        config = config || {};
        var uSegments = config.uSegments || 40;
        var vSegments = config.vSegments || 20;
        this.drawStyle = config.drawStyle || 'points';
        var uMin = config.uMin || -Math.PI;
        var uMax = config.uMax || Math.PI;
        var vMin = config.vMin || -Math.PI;
        var vMax = config.vMax || Math.PI;

        //console.log('ParametricSurface() constructor not implemented yet.');

        // generate vertex coordinates and store in an array

        var coords = [];

        for (var i = 0; i <= uSegments; i++){
            for (var j = 0; j <= vSegments; j++) {
                var uStep = (uMax - uMin) / uSegments;
                var vStep = (vMax - vMin) / vSegments;
                var u = uMin + i * uStep;
                var v = vMin + j * vStep;
                var pos = posFunc(u, v);
                coords.push(pos[0], pos[1], pos[2]);
            }
        }

        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new  vbo.Attribute(gl, {
            numComponents: 3,
            dataType: gl.FLOAT,
            data: coords
        });


    }

    // draw method: activate buffers and issue WebGL draw() method
    ParametricSurface.prototype.draw = function(gl, program) {
        // bind the attribute buffers
        program.use();
        this.coordsBuffer.bind(gl, program, 'vertexPosition');

        // draw the vertices
        switch (this.drawStyle){
            case 'points' :
                gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices());
                break;
            // other draw styles here
        }

        console.log('ParametricSurface.draw() not implemented yet.');
    };
        
    // this module only returns the Band constructor function    
    return ParametricSurface;
}); // define
