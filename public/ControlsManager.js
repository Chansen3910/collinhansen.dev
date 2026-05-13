import { CURRENT_SCENE_IS_ACTIVE } from "./store.js";
//this module catches io events for controls across all scenes in an F3 application.
//each scene implements per-key functions, which are flushed when the scene ends.

/*
    The use case for this class as opposed to handling controls in each respective scene is to implement them programmatically in such a way
    that the controls have access to the appropriate contexts and prevent destroying a scene while it is running. The renderer also uses these 
    methods to enable and disable controls automatically at just the right time, as well as keep the eventlisteners managed efficiently.

    NOTE: All of the individual actions are located in the keyUps and keyDowns objects
*/

//This class is instantiated as a member of Renderer.
//The controls are set and cleaned per scene, allowing controls class constructor methods to be passed in as well as dynamic switching between controls.
export default class ControlsManager {

    engine;

    //The callback references attached to eventlisteners must be stored at the time they are attached so they can be properly matched and removed at the end of the scene.
    #clickCallbackReference;
    #mouseUpCallbackReference;
    #mouseDownCallbackReference;
    #mouseMoveCallbackReference;
    #mouseOutCallbackReference;
    #touchStartCallbackReference;
    #touchMoveCallbackReference;
    #touchEndCallbackReference;
    #wheelCallbackReference;
    #keyDownCallbackReference;
    #keyUpCallbackReference;
    #resizeCallbackReference;

    //The individual keyup and keydown functions are stored in json to save performance with O(1) bracket notation key value retrieval.
    keyDowns = {};
    keyUps = {};

    //The keyStates Set should only be used to coalesce the states of keys. This is to keep event actions consistent and prevent the
    //idiosyncrasies and any possible inconsistent event loop implementations across browsers.
    keyStates = new Set();

    lastMouse;
    mouse;
    rect;

    constructor(engine) {
        this.engine = engine;

        //add option, mousemove, drag, drop, etc
        window.parent.document.addEventListener('click', this.#clickCallbackReference = this.onClick.bind(this), false);
        window.parent.document.addEventListener('mouseup', this.#mouseUpCallbackReference = this.onMouseUp.bind(this), false);
        window.parent.document.addEventListener('mousedown', this.#mouseDownCallbackReference = this.onMouseDown.bind(this), false);
        window.parent.document.addEventListener('mousemove', this.#mouseMoveCallbackReference = this.onMouseMove.bind(this), false);
        window.parent.document.addEventListener('mouseout', this.#mouseOutCallbackReference = this.onMouseOut.bind(this), false);
        window.parent.document.addEventListener('touchstart', this.#touchStartCallbackReference = this.onTouchStart.bind(this), false);
        window.parent.document.addEventListener('touchmove', this.#touchMoveCallbackReference = this.onTouchMove.bind(this), false);
        window.parent.document.addEventListener('touchend', this.#touchEndCallbackReference = this.onTouchEnd.bind(this), false);
        window.parent.document.addEventListener('wheel', this.#wheelCallbackReference = this.onMouseWheel.bind(this), { passive: true });
        window.parent.document.addEventListener('keydown', this.#keyDownCallbackReference = this.onKeyDown.bind(this), false);
        window.parent.document.addEventListener('keyup', this.#keyUpCallbackReference = this.onKeyUp.bind(this), false);
        window.parent.addEventListener('resize', this.#resizeCallbackReference = this.onResize.bind(this), false);

        this.lastMouse = {
            x: 0.0,
            y: 0.0
        };
        this.mouse = {
            x: 0.0,
            y: 0.5
        };
        this.rect = this.engine.canvasElement.getBoundingClientRect();
    }

    nullishKey(e) {
        //console.log(`NULLISH KEY ${e.key} (key does not appear in this context's set)`);
    }

    //this function flushes all the exported functions called by controls.
    flush() {
        console.log(`FLUSH`);
        //Set these functions to the default of accepting and returning the event parameter.
        this.setOnClick((e) => e);
        this.setOnMouseUp((e) => e);
        this.setOnMouseDown((e) => e);
        this.setOnMouseMove((e) => e);
        this.setOnMouseOut((e) => e);
        this.setOnTouchStart((e) => e);
        this.setOnTouchMove((e) => e);
        this.setOnTouchEnd((e) => e);
        this.setOnWheelUp((e) => e);
        this.setOnWheelDown((e) => e);
        this.setUpdateOnPressed((e) => e);
        this.setOnResize((e) => e);
        //Empty the keyUps and keyDowns objects.
        this.keyUps = {};
        this.keyDowns = {};
    }

    //These functions are the setter hooks for implementing per-scene controls dynamically.
    //THESE functions actually implement the ACTIONS of the keys. NOT THE KEYSTATES SET.
    setOnClick(fxn) {
        this.click = fxn;
    }
    setOnMouseUp(fxn) {
        this.mouseUp = fxn;
    }
    setOnMouseDown(fxn) {
        this.mouseDown = fxn;
    }
    setOnMouseMove(fxn) {
        this.mouseMove = fxn;
    }
    setOnMouseOut(fxn) {
        this.mouseOut = fxn;
    }
    setOnTouchStart(fxn) {
        this.touchStart = fxn;
    }
    setOnTouchMove(fxn) {
        this.touchMove = fxn;
    }
    setOnTouchEnd(fxn) {
        this.touchEnd = fxn;
    }
    setOnWheelUp(fxn) {
        this.wheelUp = fxn;
    }
    setOnWheelDown(fxn) {
        this.wheelDown = fxn;
    }
    setUpdateOnPressed(fxn) {
        this.updateOnPressed = fxn;
    }
    setKeyUp(key, fxn) {
        this.keyUps[`${key}`] = fxn;
    }
    setKeyUps(object) {
        this.keyUps = object;
    }
    setKeyDown(key, fxn) {
        this.keyDowns[`${key}`] = fxn;
    }
    setKeyDowns(object) {
        this.keyDowns = object;
    }
    setOnResize(fxn) {
        this.resize = fxn;
    }
    //updateOnPressed is unique in that it allows you to, for example, set cascading controls at the cost of some performance.
    //Such a use case as this given example is for character movement. Each key becomes hierarchal and certain keys may cancel the action or combine actions.
    updateOnPressed() {}

    //the following functions are overridden in each scene using exported setter functions.
    click(e) {}
    mouseUp(e) {}
    mouseDown(e) {}
    mouseMove(e) {}
    mouseOut(e) {}
    touchStart(e) {}
    touchMove(e) {}
    touchEnd(e) {}
    wheelUp(e) {}
    wheelDown(e) {}
    resize(e) {}
    
    //These functions may seem needless at first glance, but they exist to refine the handling of events in an efficient and optimizable way.
    //We also gain the ability to set "parent" events, coalesce specific event types, or preventDefaults / etc if we please.
    //We are separating the actions that individuals keys may take from the events themselves.
    //This is essentially an event callback proxy.
    onClick(e) {
        if(!CURRENT_SCENE_IS_ACTIVE.get()) return;
        this.click(e);
    }
    onMouseUp(e) {
        if(!CURRENT_SCENE_IS_ACTIVE.get()) return;
        this.mouseUp(e);
    }
    onMouseDown(e) {
        if(!CURRENT_SCENE_IS_ACTIVE.get()) return;
        this.mouseDown(e);
    }
    onMouseMove(e) {
        if(!CURRENT_SCENE_IS_ACTIVE.get()) return;
        this.lastMouse.x = e.clientX;
        this.lastMouse.y = e.clientY;
        this.mouse.x = ((this.lastMouse.x - this.rect.left) / this.rect.width) * 2 - 1;
        this.mouse.y = ((this.lastMouse.y - this.rect.top)  / this.rect.height) * -2 + 1;
        this.mouseMove(e);
    }
    onMouseOut(e) {
        if(!CURRENT_SCENE_IS_ACTIVE.get()) return;
        this.mouseOut(e);
    }
    onTouchStart(e) {
        if(!CURRENT_SCENE_IS_ACTIVE.get()) return;
        this.touchStart(e);
    }
    onTouchMove(e) {
        if(!CURRENT_SCENE_IS_ACTIVE.get()) return;
        this.touchMove(e);
    }
    onTouchEnd(e) {
        if(!CURRENT_SCENE_IS_ACTIVE.get()) return;
        this.touchEnd(e);
    }
    onMouseWheel(e) {
        if(!CURRENT_SCENE_IS_ACTIVE.get()) return;
        (e.deltaY < 0)? (this.wheelUp(e)): (this.wheelDown(e));
    }
    onKeyUp(e) {
        e.preventDefault();
        //If the key is currently pressed down (present in the keyStates set), remove it from the set (indicating that it is no longer pressed).
        if(this.keyStates.has(`${e.keyCode}`)) this.keyStates.delete(`${e.keyCode}`);
        
        //If there is a callback set to handle this particular keyUp event (on this key), call it; otherwise, defer the action to the nullishKey function of this context.
        if(CURRENT_SCENE_IS_ACTIVE.get()) (this.keyUps[`${e.keyCode}`] ?? this.nullishKey)(e);
    }
    onKeyDown(e) {
        e.preventDefault();
        //If the key is not present in the keyStates set (indicating that it is not pressed), add it to the set (indicating that it is being pressed).
        if(!this.keyStates.has(`${e.keyCode}`)) this.keyStates.add(`${e.keyCode}`);
        
        //If there is a callback set to handle this particular keyDown event (on this key), call it; otherwise, defer the action to the nullishKey function of this context.
        if(CURRENT_SCENE_IS_ACTIVE.get()) (this.keyDowns[`${e.keyCode}`] ?? this.nullishKey)(e);
    }
    onResize(e) {
        if(!CURRENT_SCENE_IS_ACTIVE.get()) return;
        //e.preventDefault();
        this.lastMouse = {
            x: 0.0,
            y: 0.0
        };
        this.mouse = {
            x: 0.0,
            y: 0.5
        };
        this.rect = this.engine.canvasElement.getBoundingClientRect();
        this.resize(e);
    }
    update() {
        if(!CURRENT_SCENE_IS_ACTIVE.get()) return;
        this.updateOnPressed();
    }
    destroy() {
        window.parent.document.removeEventListener('click', this.#clickCallbackReference);
        window.parent.document.removeEventListener('mouseup', this.#mouseUpCallbackReference);
        window.parent.document.removeEventListener('mousedown', this.#mouseDownCallbackReference);
        window.parent.document.removeEventListener('mousemove', this.#mouseMoveCallbackReference);
        window.parent.document.removeEventListener('mouseout', this.#mouseOutCallbackReference);
        window.parent.document.removeEventListener('touchstart', this.#touchStartCallbackReference);
        window.parent.document.removeEventListener('touchmove', this.#touchMoveCallbackReference);
        window.parent.document.removeEventListener('touchend', this.#touchEndCallbackReference);
        window.parent.document.removeEventListener('wheel', this.#wheelCallbackReference);
        window.parent.document.removeEventListener('keydown', this.#keyDownCallbackReference);
        window.parent.document.removeEventListener('keyup', this.#keyUpCallbackReference);
        window.parent.document.removeEventListener('resize', this.#resizeCallbackReference);
    }
};
