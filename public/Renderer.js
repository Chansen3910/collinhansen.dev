import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Transitioner from './Transitioner.js';
import ControlsManager from './ControlsManager.js';
import { Clock } from '/public/Clock.js';
import {
    CURRENT_SCENE_RENDERER_REFERENCE,
    CURRENT_SCENE_IS_ACTIVE,
    CURRENT_SCENE_CAMERA_REFERENCE,
    CURRENT_SCENE_CONTROLS_REFERENCE
} from './store.js';

export class Renderer {

    containerElement;
    debugElement;
    filterElement;
    uiElement;
    canvasElement;

    //height;
    //aspectRatio;

    //portraitMode;

    transitioner;
    controls;

    renderer;
    camera;
    loader;

    clock;

    currentScene;
    active = false;



    constructor(containerElement, debugElement, filterElement, uiElement, canvasElement) {
        this.loadGlb = this.loadGlb.bind(this);
        this.renderScene = this.renderScene.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.isActive = this.isActive.bind(this);

        //set element references for each context.
        this.containerElement = containerElement;
        this.debugElement = debugElement;
        this.filterElement = filterElement;
        this.uiElement = uiElement;
        this.canvasElement = canvasElement;

        //create helper class members.
        this.transitioner = new Transitioner(filterElement);
        this.controls = new ControlsManager(this);
        this.loader = new GLTFLoader();

        //set up and configure the renderer.
        this.renderer = new THREE.WebGLRenderer({
            alpha: false,
            antialias: true,
            gammaInput: true,
            gammaOutput: true
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.toneMappingExposure = 2.3;
        this.renderer.autoClear = true;
        this.renderer.autoClearColor = true;
        this.renderer.autoClearDepth = true;
        this.renderer.autoClearStencil = true;
        this.renderer.autoClearTarget = true;
        //this.renderer.physicallyCorrectLights = true;
        this.renderer.debug = false;

        //initialize the screen and renderer size and renderer resolution.
        this.canvasElement.appendChild(this.renderer.domElement);
        this.renderer.setSize(this.containerElement.clientWidth, this.containerElement.clientHeight);
        this.camera = new THREE.PerspectiveCamera(45, this.containerElement.clientWidth / this.containerElement.clientHeight, 0.01, 9000);
        window.parent.onresize = this.onWindowResize;

        CURRENT_SCENE_CONTROLS_REFERENCE.set(this.controls);
        CURRENT_SCENE_CAMERA_REFERENCE.set(this.camera);
        CURRENT_SCENE_RENDERER_REFERENCE.set(this);
    }



    async renderScene(scene) {
        //console.log(scene.name);
        //stop controls and i/o propagations by setting the active flag to false.
        CURRENT_SCENE_IS_ACTIVE.set(false);
        this.active = false;
        this.clock = null;
        //this.userInterface.log(`Active = false.`);

        //if there's a scene running, tear it down and clean it up.
        if(this.currentScene) {
            console.log(`CLEANUP renderer.js`);
            this.controls.flush();
    
            //play the currentScene's specified transitionOut property on the filter element.
            //fall back to fadeOut if the currentScene's transitionOut property value is invalid / not found in TNS.
            await (this.transitioner[`${this.currentScene.transitionOut}`] ?? this.transitioner.fadeOut)();
            
            //clear the rendering interval.
            clearInterval(this.currentScene.interval);
            //this.userInterface.log(`Interval id ${ this.currentScene.interval } canceled.`);
    
            //clean up using the methods attached to the currentScene, as well as the APIs provided by three.js.
            //https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects
            await this.currentScene.cleanup();

            //these api calls may only be requested to the renderer, and aren't sure to succeed.
            //the calls can only be made if the associated automatic default clear calls are explicitly set to false.
            this.renderer.clear();
            this.renderer.clearColor();
            this.renderer.clearDepth();
            this.renderer.clearStencil();
            this.renderer.dispose();
            this.renderer.renderLists.dispose();
        }
    
        //if the currentScene interval is somehow still not cleared, clear it.
        if(this.currentScene?.interval) {
            clearInterval(this.currentScene.interval);
            //this.userInterface.log(`Interval id ${ await this.currentScene.interval } canceled.`);
        }
    
        //S T A R T   L O A D I N G
        //console.log("LOADING");
        this.uiElement.innerHTML = `<div></div><h3>Loading scene: ${ scene.name }...</h3><div></div>`;
    
        //construct the new currentScene. await async loading and fetching of all assets.
        this.currentScene = await scene();
        //console.log("LOADING OFF");
        if(this.currentScene.clock == true) this.clock = new Clock(this, this.currentScene);
        
        //S T O P   L O A D I N G
        this.uiElement.innerHTML = ``;
    
        //Render the currentScene on a setInterval requesting a frame every 40ms (25fps).
        //Only do so if the tab is active and browser is not minimized.
        //console.log(`ONBEGINRENDER START`);
        if(this.currentScene.onBeginRender) this.currentScene.onBeginRender();
        //console.log(`ONBEGINRENDER END`);
        this.currentScene.interval = setInterval(function() {
            //if(!document.hidden) {
                this.currentScene.update();
                this.controls.update();
                this.renderer.render(this.currentScene, this.camera);
            //}
            if(this.clock)this.clock.tick(40);
        }.bind(this), 40);//40
        //this.userInterface.log(`Interval id ${ this.currentScene.interval } reserved.`);
        
        //play the currentScene's specified transitionIn property on the filter element.
        //fall back to fadeIn if the currentScene's transitionIn property value is invalid / not found in TNS.
        //console.log(`TRANSITION START`);
        await (this.transitioner[`${ this.currentScene.transitionIn }`] ?? this.transitioner.fadeIn)();
        //console.log(`TRANSITION END`);
    
        //after the transition-in is fully complete, resume controls specified in controls manager by setting the active flag to true.
        CURRENT_SCENE_IS_ACTIVE.set(true);
        this.active = true;
        //this.userInterface.log(`Active = true.`);
        
        //set currentScene to reference the currently running scene as a preliminary setup to render the next scene.
        //currentScene = scene;
    }



    async endScene() {
        this.controls.flush();

        await (this.transitioner[`${this.currentScene.transitionOut}`] ?? this.transitioner.fadeOut)();

        //clear the rendering interval.
        clearInterval(this.currentScene.interval);
        //this.userInterface.log(`Interval id ${ this.currentScene.interval } canceled.`);

        //clean up using the methods attached to the currentScene, as well as the APIs provided by three.js.
        //https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects
        await this.currentScene.cleanup();

        //these api calls may only be requested to the renderer, and aren't sure to succeed.
        //the calls can only be made if the associated automatic default clear calls are explicitly set to false.
        this.renderer.clear();
        this.renderer.clearColor();
        this.renderer.clearDepth();
        this.renderer.clearStencil();
        this.renderer.dispose();
        this.renderer.renderLists.dispose();
    }



    async loadGlb(url, processCallback = function() {}) {
        return new Promise(async function(resolve, reject) {
            await this.loader.load(url, async function(gltf) {
                await processCallback(gltf);
                resolve(await gltf.scene);
            }, undefined, async function(error) {
                console.error(error);
                reject(error);
            });
        }.bind(this));
    }



    onWindowResize(e) {
        this.renderer.setSize(this.containerElement.offsetWidth, this.containerElement.offsetHeight);
        this.camera.aspect = this.containerElement.offsetWidth / this.containerElement.offsetHeight;
        this.camera.updateProjectionMatrix();
        /*
        //get the current computed style.
        let style = getComputedStyle(this.screenElement);
        //the aspectratio is a string, so we must split the string value using '/' as delimiter to receive a tuple of string integers.
        let aspectRatio = style.aspectRatio.split(`/`);
        //if the result is not two integers, we did not receive a valid aspect ratio value.
        if(aspectRatio.length != 2) {
            console.warn(`INVALID ASPECT RATIO. Reverting to 4 / 3.`);
            aspectRatio = [ 4, 3 ];
        }
        //The width must be set as so; otherwise, the renderer DOM element will block the screen div from being shrunken back down from 100% width in Firefox.
        //Get the min of the viewport and the screen element's rendered width.
        //Set the width to the max of the min and the screen element's computed style min-width property.
        let width = Math.max(Math.min(window.innerWidth, this.screenElement.clientWidth), parseInt(style.minWidth));
        //Set the height in accordance with the screen element's computed style aspect ratio property, falling back to 4 / 3 aspect ratio.
        let height = (width / aspectRatio[0]) * aspectRatio[1];
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        */
    }



    isActive() {
        return(this.active);
    }
};
