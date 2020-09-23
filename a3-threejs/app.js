/*
 * WebGraphics Aufgabe 3
 * (C)opyright Martin Puse, mpuse@beuth-hochschule.de
 */

requirejs.config({
    paths: {
        // jquery library
        jquery : [
            // try content delivery network location first
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
            //If the load via CDN fails, load locally
            '../lib/jquery-1.7.2.min'
        ],
        // three.js framework
        'three' : '../lib/three.min'
    }
});


/*
 * The function defined below is the 'main' function,
 * it will be called once all prerequisites listed in the
 * define() statement are loaded.
 */

/* requireJS module definition */
define(['jquery', 'three'],
function($, THREE) {

    'use strict';

    /*
     * main program, to be called once the document has loaded
     * and the DOM has been constructed
     */
    $(document).ready(function() {

        console.log('document ready - starting!');

        // setup the renderer
        var renderer = new THREE.WebGLRenderer();
        /*parameters*/
        renderer.setSize(window.innerWidth, window.innerHeight);
        //configure clear color
        renderer.setClearColor('#000000');
        //append renderer to dom
        document.body.appendChild(renderer.domElement);



       /* //create a new ambient light
        var light = new  THREE.AmbientLight(0x888888)
        scene.add(light)
        //create a new directional light
        var light1 = new THREE.DirectionalLight(0xfdfcf0, 1)
        light.position.set(20,10,20)
        scene.add(light1)*/

        //Texture loader
        var textureLoader = new THREE.TextureLoader();

        // create a scene
        var scene = new THREE.Scene();

        var ambient = new THREE.AmbientLight(0xffffff);


        var object3D = new THREE.Object3D();

        //create a group
        var group = new THREE.Group();
      
        // we need a camera
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000);
            camera.rotation.x=90 *Math.PI/180;
            camera.position.set(0, -900,0);
            scene.add(camera);

        var seceondCamera = false;
        var activeCamera;





      var loader = new THREE.TextureLoader();

        // build some objects for the scene
        //universe
        var geometry = new THREE.SphereGeometry(3000, 32, 32);
        var texture = new THREE.TextureLoader().load('textures/eso0932a.jpg')
        var material = new THREE.MeshBasicMaterial({map: texture, side: THREE.BackSide});
        var mesh = new THREE.Mesh(geometry, material);

        // sun
        var sun = new THREE.SphereGeometry(150,32,32);
        var sunTexture = new  THREE.TextureLoader().load('textures/2k_sun.jpg')
        var sunMaterial = new THREE.MeshPhongMaterial({
            map: sunTexture,
            lightMap: sunTexture,
            flatShading: THREE.SmoothShading
        });
        var sunMesh = new THREE.Mesh(sun, sunMaterial);
        var sunLight = new THREE.PointLight(0xff0000, 1, 0, 2);
        sunLight.position.set(0,0,0);

        //mercury
        var mercury = new THREE.SphereGeometry(5, 32, 32);
        var texture5 = new THREE.TextureLoader().load('textures/2k_mercury.jpg')
        var material5 = new THREE.MeshBasicMaterial({map: texture5});
        var mercuryMesh = new THREE.Mesh(mercury, material5);
            mercuryMesh.position.set(300, 0, 0);

        //venus
        var venus = new THREE.SphereGeometry(10,32,32);
        var texture6 = new THREE.TextureLoader().load('textures/2k_venus_surface.jpg')
        var material6 = new THREE.MeshBasicMaterial({map:texture6});
        var venusMesh = new THREE.Mesh(venus, material6);
            venusMesh.position.set(400, 0, 0);

        // earth
        var earth = new THREE.SphereGeometry(15,32,32);
        var texture1 = new THREE.TextureLoader().load('textures/2k_earth_daymap.jpg')
        var material1 = new THREE.MeshBasicMaterial({map: texture1});
        var earthMesh = new THREE.Mesh(earth, material1);
            earthMesh.position.set(500, 0, 0);

        // moon
        var moon = new THREE.SphereGeometry(5,32,32);
        var texture2 = new THREE.TextureLoader().load('textures/2k_moon.jpg')
        var material2 = new THREE.MeshBasicMaterial({map: texture2});
        var moonMesh = new THREE.Mesh(moon, material2);
            moonMesh.position.set(50,0,0);

        //mars
        var mars = new THREE.SphereGeometry(6, 32, 32);
        var texture3 = new THREE.TextureLoader().load('textures/2k_mars.jpg')
        var material3 = new THREE.MeshBasicMaterial({map: texture3});
        var marsMesh = new THREE.Mesh(mars, material3);
            marsMesh.position.set(600, 0, 0);

        //jupiter
        var jupiter = new THREE.SphereGeometry(60, 32, 32);
        var texture7 = new THREE.TextureLoader().load('textures/2k_jupiter.jpg')
        var material7 = new THREE.MeshBasicMaterial({map: texture7});
        var juptierMesh = new THREE.Mesh(jupiter, material7);
            juptierMesh.position.set(800,0,0);

        //saturn
        var saturn = new THREE.SphereGeometry(50, 32, 32);
        var texture4 = new THREE.TextureLoader().load('textures/2k_saturn.jpg')
        var material4 = new THREE.MeshBasicMaterial({map: texture4});
        var saturnMesh = new THREE.Mesh(saturn, material4);
            saturnMesh.position.set(1000, 0, 0);

        //rings
        var rings = new THREE.TorusGeometry(70, 3, 32, 32);
        var texture10 = new THREE.TextureLoader().load('textures/2k_saturn_ring_alpha.png');
        var ringMaterial = new THREE.MeshBasicMaterial({map: texture10});
        var ringMesh = new THREE.Mesh(rings, ringMaterial);
            ringMesh.position.addVectors(1000, 0, 0);

        //uranus
        var uranus = new THREE.SphereGeometry(40,32,32);
        var texture8 = new THREE.TextureLoader().load('textures/2k_uranus.jpg')
        var material8 = new THREE.MeshBasicMaterial({map: texture8});
        var uranusMesh = new THREE.Mesh(uranus, material8);
            uranusMesh.position.set(1250,0,0);

        //neptune
        var neptune = new THREE.SphereGeometry(30,32,32);
        var texture9 = new THREE.TextureLoader().load('textures/2k_neptune.jpg')
        var material9 = new THREE.MeshBasicMaterial({map: texture9});
        var neptuneMesh = new THREE.Mesh(neptune, material9);
            neptuneMesh.position.set(1350,0,0);

        //second camera
        var camera2 = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000);
        camera2.position.set(500, 0,0);
        camera2.lookAt(mercuryMesh.position);




        // create the scene graph

        group.add(ambient);
        group.add(mesh);

        group.add(sunMesh);
        group.add(ambient);
        group.add(sunLight);

        sunMesh.add(camera2);

        sunMesh.add(mercuryMesh);
        sunMesh.add(venusMesh);
        sunMesh.add(earthMesh);
            earthMesh.add(moonMesh);
        sunMesh.add(marsMesh);
        sunMesh.add(juptierMesh);
        sunMesh.add(saturnMesh);
        sunMesh.add(ringMesh);
        sunMesh.add(uranusMesh);
        sunMesh.add(neptuneMesh);
        scene.add(group);



        // react on keyboard controls
        $(this).keydown(function(evt) {
            evt.preventDefault();
            
            // grab code of pressed key

            switch (evt.which) {

                case 49: seceondCamera = false; break;//1
                case 50: seceondCamera = true; break; //2
            } if (seceondCamera){
                activeCamera=camera2;
            } else activeCamera=camera;
            switch (evt.which){
                case 87: activeCamera.position.y += 10; break; // w
                case 83: activeCamera.position.y -= 10; break; // s
                case 65: activeCamera.position.x -= 10; break; // a
                case 68: activeCamera.position.x += 10; break; // d
                case 89: activeCamera.position.z += 10; break; // y
                case 88: activeCamera.position.z -= 10; break; // x
                case 67: break; // c
            }
        });

        // render with (hopefully) 60 fps
        var render = function () {
            requestAnimationFrame(render);

            // update code between frames here
            //mesh.rotation.x += 0.005;
            sunMesh.rotation.y += 0.008;
            mercuryMesh.rotation.y +=0.05;
            venusMesh.rotation.y +=0.05;
            earthMesh.rotation.y += 0.03;
            moonMesh.rotation.y +=0.01;
            marsMesh.rotation.y +=0.05;
            juptierMesh.rotation.y +=0.03;
            saturnMesh.rotation.y +=0.01;
            uranusMesh.rotation.y +=0.03;
            neptuneMesh.rotation.y +=0.03;

            // lets render the scene from the view of the camera
            if (seceondCamera){
                renderer.render(scene, camera2);
            }else {renderer.render(scene, camera);
            }

        };

        // start the render animation
        render();

    }); // $(document).ready()
}); // define module
