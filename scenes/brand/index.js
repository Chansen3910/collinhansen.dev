import * as THREE from 'three';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { Renderer } from '/public/Renderer.js';

let containerElement = window.document.getElementById(`container`);
let debugElement = window.document.getElementById(`debug`);
let filterElement = window.document.getElementById(`filter`);
let uiElement = window.document.getElementById(`ui`);
let canvasElement = window.document.getElementById(`canvas`);



let renderer = new Renderer(containerElement, debugElement, filterElement, uiElement, canvasElement);



//set up the scene
async function sc() {
    let scene = new THREE.Scene();
    scene.clock = false;
    scene.name = `brand`;
    scene.transitionIn = `fadeIn`;
    scene.transitionOut = `fadeOut`;
/*
    const pmremGenerator = new THREE.PMREMGenerator( renderer.renderer );
    const hdriLoader = new HDRLoader();
    hdriLoader.load(`/public/assets/hdri/autumn_forest_04_1k.hdr`, function(texture) {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        texture.dispose();
        scene.environment = envMap;
    });
*/
    scene.background = new THREE.Color('rgba(0, 0, 120, 1.0)');

    let brand, tickerMesh, sun, point, mixer, lookPosition = {
        x: 0,
        y: 0,
        z: 0
    };
    let returnInterval = false;

    [
        brand,
        sun,
        point
    ] = [
        await renderer.loadGlb(
            '/public/assets/glb/eclectic-brand.glb',
            async function(gltf) {
                await gltf.scene.traverse(async function(child) {
                    if(child.isMesh) {
                        if(child.name.includes("Plane")) child.castShadow = true;
                        if(child.name.includes("corridor")) child.receiveShadow = true;
                        if(child.name.includes("ticker")) tickerMesh = child;
                    }
                });
                gltf.scene.animations = await gltf.animations;
            }
        ),
        await new THREE.HemisphereLight(`rgb(255, 255, 255)`, `rgb(255, 255, 255)`, 0.3),
        await new THREE.PointLight("rgb(255, 255, 255)", 3.0, 12.0)
    ];
    point.castShadow = true;
    await point.position.set(0, 0, 2.5);
    await scene.add(brand, sun, point);

    //Play all animations.
    mixer = await new THREE.AnimationMixer(brand);
    brand.animations.forEach(function(clip) {
        mixer.clipAction(clip).play();
    });

    await renderer.camera.position.set(brand.position.x, brand.position.y, brand.position.z + 15);
    await renderer.camera.lookAt(brand.position.x, brand.position.y, brand.position.z);

    renderer.controls.setOnMouseMove(function(e) {
        //Mouse is active, clear the lookPosition return interval.
        if(returnInterval) clearInterval(returnInterval);

        //Get mouse position as coordinates in 3D space (pixel position in element / element pixel size).
        let xt = (e.offsetX / window.innerWidth);
        let yt = (e.offsetY / window.innerHeight);
        //The resulting coordinates should be positively skewed, ranging from 0.0 to 1.0.
        //Subtract by 0.5 to distribute the positive skew symmetrically (range of -0.5 to 0.5).
        lookPosition = {
            x: (xt - 0.5) * 2,
            y: (-(yt) + 0.5) * 2,
            z: 3
        };
    });
    
    //onMouseOut callback = lookPosition object slowly return to origin.
    renderer.controls.setOnMouseOut(function(e) {
        //If, for whatever reason, the scene is active and lookPosition is undefined, blindly clear the interval and return.
        if(typeof lookPosition == "undefined") {
            clearInterval(returnInterval);
            lookPosition = {
                x: 0,
                y: 0,
                z: 0
            };
            return;
        }

        //If there is an interval running, clear it for the new interval.
        if(returnInterval) clearInterval(returnInterval);

        //Set a new interval to slowly return the lookPosition to the origin.
        returnInterval = setInterval(function() {
            if(typeof lookPosition == "undefined") return;
            //Round to the nearest 10th and if the resulting decimal is 0, look back to origin and clear the interval.
            if(((~~(lookPosition.x * 10)) == 0) && ((~~(lookPosition.y * 10)) == 0)) {
                lookPosition.x = 0;
                lookPosition.y = 0;
                clearInterval(returnInterval);
            }
            
            //Move the lookPosition x and y members back to the origin in 12 steps (1 per 20ms).
            if(lookPosition.x) lookPosition.x -= lookPosition.x / 12;
            else lookPosition.x += lookPosition.x / 12;

            if(lookPosition.y) lookPosition.y -= lookPosition.y / 12;
            else lookPosition.y += lookPosition.y / 12;
        }, 20);
    });

    scene.onBeginRender = function() {
        setTimeout(
            async function() {
                await renderer.endScene();
                window.location.replace(`/home/`);
            }, 7000
        );
    };

    scene.update = function() {
        tickerMesh.material.map.offset.x += 0.007;
        if(mixer) mixer.update(0.03);
        if(typeof brand != 'undefined' && typeof lookPosition != 'undefined') brand.lookAt(lookPosition.x, lookPosition.y, lookPosition.z);
    }

    scene.cleanup = async function() {
        let element;
        while(element = renderer.uiElement.firstChild) {
            renderer.uiElement.removeChild(element);
        }
        await scene.traverse(async function(obj) {
            if(obj instanceof THREE.Mesh) {
                await obj.geometry.dispose();
                await obj.material.dispose();
                await scene.remove(obj);
            }
        });
    }

    return(scene);
}


renderer.renderScene(sc);
