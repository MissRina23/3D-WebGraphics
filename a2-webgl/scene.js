/*
 *
 * Module scene
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Martin Puse, mpuse@beuth-hochschule.de
 */

/* requireJS module definition */
define(['glmatrix', 'program', 'shaders', 'texture', 'Band', 'Triangle', 'ParametricSurface', 'Cube', 'Sphere'],
function(glmatrix, Program, shaders, Texture, Band, Triangle, ParametricSurface, Cube, Sphere) {

    'use strict';
    
    // simple scene: create some scene objects in the constructor, and
    // draw them in the draw() method
    function Scene(gl) {

        // store the WebGL rendering context 
        this.gl = gl;

        var self = this;
        var onLoaded = function () {
            console.log("loaded")
            self.draw();
        };
        this.textures = {
            earthDay : new Texture(gl,{
                name    : 'earthDay',
                path    : './textures/earth_day.jpg',
                onLoaded
            }),
            earthNight : new Texture(gl, {
                name    : 'nightEarth',
                path    : './textures/earth_night.jpg',
                onLoaded
            }),
            earthWater : new Texture(gl, {
                name    : 'earthWater',
                path    : './textures/earth_water.jpg',
                onLoaded
            }),
            earthClouds: new Texture(gl,{
                name: 'earthClouds',
                path: './textures/earth_cloud.jpg',
                onLoaded
            }),
        }


        // create all required GPU programs from vertex and fragment shaders
        this.programs = {
            red : new Program(gl, 
                shaders.getVertexShader('red'), 
                shaders.getFragmentShader('red')
            ),
            vertexColor : new Program(gl, 
                shaders.getVertexShader('vertex_color'), 
                shaders.getFragmentShader('vertex_color')
            ),
            uni : new Program(gl,
                shaders.getVertexShader('unicolor'),
                shaders.getFragmentShader('unicolor')
            ),
            phongPervertex : new Program(gl,
                shaders.getVertexShader('phong_pervertex'),
                shaders.getFragmentShader('phong_pervertex')
            ),
            phongPerpixel: new Program(gl,
                shaders.getVertexShader('phong_perpixel'),
                shaders.getFragmentShader('phong_perpixel')
            ),
            earth: new Program(gl,
                shaders.getVertexShader('earth'),
                shaders.getFragmentShader('earth')
            )

        };


        // create a camera mathematically
        this.camera = {
            eye : [0, 0.5, 10],  // position in scene
            pov : [0, 0, 0],     // focus point
            up  : [0, 1, 0]      // head orientation
        };

        // setup some matrices for mvp
        this.modelviewMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.rotationMatrix = mat4.create();
        mat4.identity(this.rotationMatrix);
        this.projectionMatrix = mat4.create();
        this.normalMatrix = mat3.create();
        mat4.toInverseMat3(this.modelviewMatrix, this.normalMatrix);
        mat3.transpose(this.normalMatrix);
        
        // the scene has an attribute 'drawOptions' that is used by 
        // the HtmlController. Each attribute in this.drawOptions 
        // automatically generates a corresponding checkbox in the UI.
        this.drawOptions = {
            'Perspective Projection': false, 
            'Show Band'             : false,
            'Show Solid Band'       : false,
            'Show Wireframe Band'   : false,
            'Show Ellipsoid'        : false,
            'Show Triangle'         : false,
            'Show Cube'             : false,
            'Show Sphere'           : false,
            'Show Sphere 1'         : false,
            'Show Earth'            : false
        };

        /*
         * create objects for the scene
         */

        // create a Band object to be drawn in this scene
        this.band = new Band(gl, { height : 0.4, drawStyle : 'points' });
        this.triangleBand = new Band(gl, {height: 0.4, drawStyle:'triangles'});
        this.wireBand = new Band(gl, {height: 0.4, drawStyle:'wireframe'});

        // create a parametric surface function
        var ellipsoidFunc = function(u, v) {
            return [
                0.5 * Math.cos(u) * Math.cos(v),
                0.3 * Math.cos(u) * Math.sin(v),
                0.9 * Math.sin(u)
            ];
        };

         // create a parametric surface to be drawn in this scene
        this.ellipsoid = new ParametricSurface(gl, ellipsoidFunc, {
            uMin : -0.5 * Math.PI, uMax : 0.5 * Math.PI, uSegments : 50, //<-
            vMin : -Math.PI, vMax : Math.PI, vSegments : 50,
            drawStyle: 'points'
        });

        // create a triangle to be drawn in this scene
        this.triangle = new Triangle(gl);

        // create a cube to be drawn in this scene
        this.cube = new Cube(gl);

        // create a sphere to be drawn in this scene
        this.sphere = new Sphere(gl, {
            radius: 0.5,
            mat: {ambient: [1,1,0],
                  diffuse: [1,1,0],
                  specular: [1,1,0],
                  shininess: 1.0}
        });
        // create another sphere to be drawn in this scene
        this.sphere1 = new Sphere(gl, {
            radius: 0.5,
            mat: {ambient: [2,1,2],
                  diffuse: [2,1,2],
                  specular:[2,1,2],
                  shininess: 1.0}
        });

        // create a earth to be drawn in this scene
        this.sphereE = new Sphere(gl, {
            radius: 0.7,
            mat: {ambient: [1,1,1],
                  diffuse:[1,1,1],
                  specular:[1,1,1],
                  shininess: 1.0}
        });
    }
    var proto = Scene.prototype;

    // the scene's draw method draws whatever the scene wants to draw
    proto.draw = function() {
        // just a shortcut
        var gl = this.gl;


        // clear color and depth buffers
        gl.clearColor(0.3, 0.3, 0.3, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);     
        // set up depth test to discard occluded fragments
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);  
            
        // set up the projection matrix, depending on the canvas size
        var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        this.projectionMatrix = this.drawOptions['Perspective Projection'] ?
            mat4.perspective(45, aspectRatio, 0.01, 100) : 
            mat4.ortho(-aspectRatio, aspectRatio, -1,1, 0.01, 100);

        // lets look through the camera
        this.viewMatrix = mat4.lookAt(
            this.camera.eye,
            this.camera.pov,
            this.camera.up
        );
        // add external rotation from animation flag
        mat4.multiply(this.viewMatrix, this.rotationMatrix);
        // modelview of the scene, to be changed by e.g. animation
        this.modelviewMatrix = mat4.create(this.viewMatrix);

        // set the uniform variables for all used programs
        for (var prog in this.programs) {


            this.programs[prog].use();
            this.programs[prog].setUniform('projectionMatrix', 'mat4', this.projectionMatrix);
            this.programs[prog].setUniform('modelViewMatrix',  'mat4', this.modelviewMatrix);
            this.programs[prog].setUniform('normalMatrix', 'mat3', this.normalMatrix);
            //this.programs[prog].setUniform('uniColor', 'vec4', [1,1,0,1]);
            if(prog == 'earth'){
                this.programs[prog].setTexture('uSamplerDay',   0, this.textures.earthDay);
                this.programs[prog].setTexture('uSamplerNight', 1, this.textures.earthNight);
                this.programs[prog].setTexture('uSamplerWater', 2, this.textures.earthWater);
                this.programs[prog].setTexture('uSamplerCloud', 3, this.textures.earthClouds);
            }
        }

        var setMaterial=function (prog, mat) {
            prog.use();
            prog.setUniform('material.ambient', 'vec3', mat.ambient);
            prog.setUniform('material.diffuse', 'vec3', mat.diffuse);
            prog.setUniform('material.specular', 'vec3', mat.specular);
            prog.setUniform('material.shininess', 'float', mat.shininess);
        };


        /*
         * draw the scene objects
         */
        if (this.drawOptions['Show Band']) {
            this.band.draw(gl, this.programs.red);
        }
        if (this.drawOptions['Show Ellipsoid']) {
            this.ellipsoid.draw(gl, this.programs.red);
        }
        if (this.drawOptions['Show Solid Band']){
            this.triangleBand.draw(gl, this.programs.uni);
        }
        if (this.drawOptions['Show Wireframe Band']){
            this.wireBand.draw(gl, this.programs.vertexColor);
        }
        if (this.drawOptions['Show Triangle']){
            //this.triangle.draw(gl, this.programs.red);
            this.triangle.draw(gl, this.programs.vertexColor);
        }
        if (this.drawOptions['Show Cube']){
            this.cube.draw(gl, this.programs.vertexColor);
        }
        if (this.drawOptions['Show Sphere']){

            this.sphere.draw(gl, this.programs.phongPervertex, mat4.translate(this.modelviewMatrix, [0, 0, 0]), mat4.create());
        }
        if (this.drawOptions['Show Sphere 1']){
            this.sphere1.draw(gl, this.programs.phongPerpixel, mat4.translate(this.modelviewMatrix, [0.5,0,0]), mat4.create());
        }
        if (this.drawOptions['Show Earth']){
            this.sphereE.draw(gl, this.programs.earth, this.modelviewMatrix);
        }
    };

    // the scene's rotate method is called from HtmlController, when certain
    // keyboard keys are pressed. Try Y and Shift-Y, for example.
    proto.rotate = function(axis, angle) {
        // degrees to radians
        angle *= Math.PI / 180;
       
        // manipulate the corresponding matrix
        switch (axis) {
            case 'worldX': mat4.rotate(this.rotationMatrix, angle, [1,0,0]); break;
            case 'worldY': mat4.rotate(this.rotationMatrix, angle, [0,1,0]); break;
            default:
                console.log('axis ' + axis + ' not implemented.');
        }
    };

    return Scene;
}); // define module
