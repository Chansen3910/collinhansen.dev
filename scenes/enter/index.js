import * as THREE from 'three';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { Renderer } from '/public/Renderer.js';

let containerElement = window.parent.document.getElementById(`container`);
let debugElement = window.parent.document.getElementById(`debug`);
let filterElement = window.parent.document.getElementById(`filter`);
let uiElement = window.parent.document.getElementById(`ui`);
let canvasElement = window.parent.document.getElementById(`canvas`);



let renderer = new Renderer(containerElement, debugElement, filterElement, uiElement, canvasElement);



//set up the scene
async function sc() {
    let scene = new THREE.Scene();
    scene.clock = false;
    scene.name = `enter`;
    scene.transitionIn = `fadeIn`;
    scene.transitionOut = `fadeOut`;
    let active = true;

    const pmremGenerator = new THREE.PMREMGenerator( renderer.renderer );
    const hdriLoader = new HDRLoader();
    hdriLoader.load(`/public/assets/hdri/autumn_forest_04_1k.hdr`, function(texture) {
        pmremGenerator.compileEquirectangularShader();
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        texture.dispose();
        pmremGenerator.dispose();
        scene.environment = envMap;
    });

    scene.background = new THREE.Color(0.0, 0.0, 0.0, 1.0);

    let lyre;
    let mixer;

    //ui
    let mainDiv = document.createElement('div');
    mainDiv.classList.add(`w-100`, `h-100`, `col`, `center`, `unselectable`);

    let innerDiv = document.createElement('div');
    innerDiv.style.paddingLeft = '20px';
    innerDiv.style.paddingRight = '20px';
    innerDiv.style.borderRadius = '12px';
    innerDiv.style.backgroundColor = 'rgba(12, 12, 36, 0.7)';
    innerDiv.classList.add(`col`, `center`, `between`);

    let heading = document.createElement('h2');
    heading.style.margin = '12px';
    heading.textContent = 'Audio Advisory';

    let paragraph = document.createElement('p');
    paragraph.style.fontStyle = 'italic';
    paragraph.style.width = '300px';
    paragraph.style.overflowWrap = 'break-word';
    paragraph.style.textAlign = 'center';
    paragraph.innerHTML = 'This scene requires audio to play.<br /><br />Please ensure that you have control of your audio device before continuing.';

    let button = document.createElement('input');
    button.type = 'button';
    button.style.padding = '3px 7px 3px 7px';
    button.style.margin = '20px';
    button.style.minWidth = '70px';
    button.style.textAlign = 'center';
    button.style.fontWeight = 'bold';
    button.classList.add(`col`, `center`, `finger`);
    button.value = 'Enable audio';
    button.onclick = async function() {
        if(active) {
            active = false;
            await renderer.endScene();
            window.location.href = `/brand`;
        }
    }

    innerDiv.appendChild(heading);
    innerDiv.appendChild(paragraph);
    innerDiv.appendChild(button);

    mainDiv.appendChild(innerDiv);

    lyre = await renderer.loadGlb(
        '/public/assets/glb/oak-lyre.glb',
        async function(gltf) {
            await gltf.scene.traverse(async function(child) {
                child.frustumCulled = false;

                if(child.isMesh) {
                    child.material.precision = 'highp';
                    child.material.needsUpdate = true;

                    child.material.roughnessMap = null;
                    child.material.metalnessMap = null;

                    child.material.envMap = scene.environment;

                    child.material.envMapIntensity = 1.0;

                    console.log(child.material);
                }
            });
            gltf.scene.animations = await gltf.animations;
        }
    );

    await scene.add(lyre);

    await renderer.camera.position.set(lyre.position.x + 1.5, lyre.position.y + 0.5, lyre.position.z);
    await renderer.camera.lookAt(lyre.position.x, lyre.position.y, lyre.position.z);

    scene.onBeginRender = function() {
        containerElement.classList.add('stars');
        renderer.uiElement.appendChild(mainDiv);
    }

    let i = 0.0;
    lyre.rotation.z += 0.2;
    scene.update = function() {
        lyre.rotation.y -= (0.01 * Math.sin(i += 0.03)) + 0.03;

        /*
        renderer.camera.position.y = (0.5 * Math.sin(i += 0.05)) + 0.3;
        renderer.camera.lookAt(
            lyre.position.x,
            lyre.position.y + 0.3,
            lyre.position.z
        );
        //*/
    }
    
    scene.cleanup = async function() {
        containerElement.classList.remove('stars');

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
