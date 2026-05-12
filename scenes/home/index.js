import * as THREE from 'three';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { Renderer } from '/public/Renderer.js';

import { CURRENT_SCENE_RENDERER_REFERENCE } from '/public/store.js';

let containerElement = window.parent.document.getElementById(`container`);
let debugElement = window.parent.document.getElementById(`debug`);
let filterElement = window.parent.document.getElementById(`filter`);
let uiElement = window.parent.document.getElementById(`ui`);
let canvasElement = window.parent.document.getElementById(`canvas`);



let renderer = new Renderer(containerElement, debugElement, filterElement, uiElement, canvasElement);
CURRENT_SCENE_RENDERER_REFERENCE.set(renderer);



let stick, color;



async function sc() {
    let scene = new THREE.Scene();
    scene.name = `home`;
    scene.clock = false;
    scene.transitionIn = `fadeIn`;
    scene.transitionOut = `fadeOut`;

    const pmremGenerator = new THREE.PMREMGenerator( renderer.renderer );
    const hdriLoader = new HDRLoader();
    hdriLoader.load(`/public/assets/hdri/autumn_forest_04_1k.hdr`, function(texture) {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        texture.dispose();
        scene.environment = envMap;
    });

    stick = await renderer.loadGlb(
        '/public/assets/glb/cursor-start.glb',
        async function(gltf) {
            await gltf.scene.traverse(async function(child) {
                if(child.isMesh) {
                    console.log(child.name);
                    if(child.name == `stick-character`) color = child;
                }
            });
            
            const clips = await gltf.animations;
            
            //Create an animation mixer for the mesh upon itself.
            gltf.scene.mixer = new THREE.AnimationMixer(gltf.scene);

            //Create empty actions object and load with all animation clips
            gltf.scene.actions = {};
            for(let i = 0; i < clips.length; i++) {
                gltf.scene.actions[clips[i].name] = gltf.scene.mixer.clipAction(clips[i]);
            }

            //Set the default action.
            //gltf.scene.actions.currentAction = `idle`;
            //gltf.scene.actions[`idle`].play();

            //Create helper upon the mesh itself.
            gltf.scene.actions.setAction = function(actionName) {
                //if the action name doesnt exist, return.
                if(!gltf.scene.actions[actionName]) return;

                //if the action isnt already playing, play it.
                if(gltf.scene.actions.currentAction != actionName) {
                    gltf.scene.actions[gltf.scene.actions.currentAction].fadeOut(0.05);
                    gltf.scene.actions.currentAction = actionName;
                    gltf.scene.actions[actionName].reset().fadeIn(0.05).play();
                }
            };
        }
    );

    /*
    const tl = new THREE.TextureLoader();
    const steelMatcapTexture = tl.load('/public/assets/images/sm64-steel-matcap.jpg');
    color.material = new THREE.MeshMatcapMaterial({
        matcap: steelMatcapTexture
    });

    stick.actions.setAction(`run`);
    */
    await scene.add(stick);



    await renderer.camera.position.set(stick.position.x + 3, stick.position.y + 1, stick.position.z - 0.5);
    await renderer.camera.lookAt(stick.position.x, stick.position.y, stick.position.z);



    scene.onBeginRender = function() {
        //uiElement.appendChild(document.createElement(`title-element`));
    };



    let i = 0, j = 0, k = 0;
    scene.update = function() {
        if(stick) {
            stick.mixer.update(0.05);
            stick.rotation.y -= 0.05;
        }
        /*
        if(titleScreen.mixer) titleScreen.mixer.update(0.03);
        if(cave) cave.rotation.y -= 0.02;

        renderer.camera.position.x = Math.cos(i += 0.07) + 4;
        renderer.camera.position.y = Math.sin(j += 0.03) + 1;
        renderer.camera.position.z = 2 * Math.cos(k += 0.03);
        renderer.camera.lookAt(titleText.position.x, titleText.position.y + 0.5, titleText.position.z);
        */
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
