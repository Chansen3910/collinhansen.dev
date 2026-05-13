import * as THREE from 'three';
import { Renderer } from '/public/Renderer.js';



let containerElement = document.getElementById(`container`);
let debugElement = document.getElementById(`debug`);
let filterElement = document.getElementById(`filter`);
let uiElement = document.getElementById(`ui`);
let canvasElement = document.getElementById(`canvas`);



let renderer = new Renderer(containerElement, debugElement, filterElement, uiElement, canvasElement);
//CURRENT_SCENE_RENDERER_REFERENCE.set(renderer);
let controls = renderer.controls;
let camera = renderer.camera;



let touchStartY;
let touchPrevY;
let touchNextY;

let raycaster = new THREE.Raycaster();
let tower;
let header_room_1,
    many_colors_scroller;
let projects_carousel_left,
    projects_carousel_right;
let projectsArmature,
    projectsFinalPosition = 0.0;
const CAROUSEL_ROTATION_SPEED = 0.2;

let skill_slot_1,
    skill_slot_2,
    skill_slot_3;
let java,
    cpp,
    cs;



function setCameraZ() {
    let aspectRatio = (window.innerWidth / window.innerHeight);
    if(window.innerHeight > window.innerWidth) {
        camera.position.z = (-17 * aspectRatio) + 25.2;
    }else {
        camera.position.z = (-3.07 * aspectRatio) + 11.07;
    }
    camera.position.z += 1;
}



async function sc() {
    let scene = new THREE.Scene();
    scene.name = `enter`;
    scene.transitionIn = `fadeIn`;
    scene.transitionOut = `fadeOut`;
    scene.clock = true;
    let active = true;



    tower = await renderer.loadGlb(
        '/public/assets/glb/page-rough.glb',
        async function(gltf) {
            await gltf.scene.traverse(async function(child) {
                child.frustumCulled = false;
                if(child.isLight) {
                    child.castShadow = true;
                }
                if(child.isMesh) {
                    //console.log(child.name);
                    if(child.name == `header-room_1`) header_room_1 = child;
                    if(child.name == `many-colors-scroller`) many_colors_scroller = child;
                    if(child.name == `projects-carousel-left`) projects_carousel_left = child;
                    if(child.name == `projects-carousel-right`) projects_carousel_right = child;
                    //console.log(child.name);
                    /*
                    child.material.side = THREE.DoubleSide;
                    child.geometry.computeBoundingBox();
                    child.geometry.computeBoundingSphere();
                    child.geometry.computeVertexNormals();
                    */
                }else {
                    if(child.name == `project-armature`) projectsArmature = child;
                    if(child.name == `skill-slot-1`) skill_slot_1 = child;
                    if(child.name == `skill-slot-2`) skill_slot_2 = child;
                    if(child.name == `skill-slot-3`) skill_slot_3 = child;
                }
            });

            //Get all animation clips.
            const clips = await gltf.animations;

            gltf.scene.mixer = new THREE.AnimationMixer(gltf.scene);
            gltf.scene.actions = {};
            for(let i = 0; i < clips.length; i++) {
                gltf.scene.actions[clips[i].name] = gltf.scene.mixer.clipAction(clips[i]);
            }
            gltf.scene.actions.currentAction = `none`;
            gltf.scene.actions.setAction = function(actionName) {
                if(!gltf.scene.actions[actionName]) return;

                if(gltf.scene.actions.currentAction != actionName) {
                    if(gltf.scene.actions[gltf.scene.actions.currentAction]) gltf.scene.actions[gltf.scene.actions.currentAction].fadeOut(0.05);
                    gltf.scene.actions.currentAction = actionName;
                    gltf.scene.actions[actionName].reset().play();
                }
            };
            gltf.scene.actions.appendAction = function(actionName) {
                if(!gltf.scene.actions[actionName]) return;

                gltf.scene.actions[actionName].reset().play();
            }
            gltf.scene.actions.setAction(`continuous-fire`);
            gltf.scene.actions.appendAction(`continuous-fire-me`);
        }
    );
    await scene.add(tower);

    setCameraZ();



    //skills logos
    cpp = await renderer.loadGlb(
        '/public/assets/glb/cpp-logo.glb',
        async function(gltf) {
            await gltf.scene.traverse(async function(child) {
                /*
                child.frustumCulled = false;
                if(child.isLight) {
                    child.castShadow = true;
                }
                */
            });
        }
    );
    
    cs = await renderer.loadGlb(
        '/public/assets/glb/cs-logo.glb',
        async function(gltf) {
            await gltf.scene.traverse(async function(child) {
                /*
                child.frustumCulled = false;
                if(child.isLight) {
                    child.castShadow = true;
                }
                */
            });
        }
    );

    java = await renderer.loadGlb(
        '/public/assets/glb/java-logo.glb',
        async function(gltf) {
            await gltf.scene.traverse(async function(child) {
                /*
                child.frustumCulled = false;
                if(child.isLight) {
                    child.castShadow = true;
                }
                */
            });
        }
    );

    scene.add(cpp, cs, java);

    skill_slot_1.add(cpp);
    skill_slot_2.add(cs);
    skill_slot_3.add(java);







    //controls
    controls.setOnWheelUp(function(e) {
        camera.position.y += 0.3;
    });
    controls.setOnWheelDown(function(e) {
        camera.position.y -= 0.3;
    });
    controls.setOnClick(function() {
        raycaster.setFromCamera(
            new THREE.Vector2(controls.mouse.x, controls.mouse.y),
            camera
        );
        let intersects = raycaster.intersectObjects(tower.children, true);
        if(intersects.length == 0) return;

        //console.log(intersects[0].object.name);

        if(intersects[0].object.name == `projects-carousel-right`) {
            projectsFinalPosition -= (2 * (Math.PI / 7));
        }
        if(intersects[0].object.name == `projects-carousel-left`) {
            projectsFinalPosition += (2 * (Math.PI / 7));
        }

        if(intersects[0].object.name == `pdf-link`) {
            const link = document.createElement('a');
            link.href = "/public/assets/files/Collin_Hansen_Resume.pdf";
            link.download = "Collin_Hansen_Resume.pdf";
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        if(intersects[0].object.name == `call-link`) {
            location = 'tel:+14322716960';
        }
        if(intersects[0].object.name == `message-link`) {
            location = `sms:+14322716960?body=${ ((new Date().getHours() < 12)? ('Good morning'): ('Good afternoon')) + ` Collin! My name is ...` }`;
        }
        if(intersects[0].object.name == `email-link`) {
            location.href = `mailto:chansen3910@gmail.com?subject=${ ((new Date().getHours() < 12)? ('Good morning'): ('Good afternoon')) + ` Collin!` }&body=...`;
        }
        if(intersects[0].object.name == `linkedin-link`) {
            location.href = 'https://linkedin.com/in/collin-hansen-647478386/';
        }
        if(intersects[0].object.name == `snapchat-link`) {
            location.href = 'https://www.snapchat.com/add/mmisterperfectt';
        }
    });

    controls.setOnMouseMove(function(e) {
        raycaster.setFromCamera(
            new THREE.Vector2(controls.mouse.x, controls.mouse.y),
            camera
        );
        let intersects = raycaster.intersectObjects(tower.children, true);
        if(intersects.length == 0) return;

        switch(intersects[0].object.name) {
            case `projects-carousel-right`:
                containerElement.title = `Send the carousel forward`;
                containerElement.style.setProperty(`cursor`, `pointer`);
                break;
            case `projects-carousel-left`:
                containerElement.title = `Send the carousel backward`;
                containerElement.style.setProperty(`cursor`, `pointer`);
                break;
            case `newtube-card`:
                containerElement.title = `Visit newtube.ch`;
                containerElement.style.setProperty(`cursor`, `pointer`);
                break;
            case `study-buddy-card`:
                containerElement.title = `Visit studybuddy.ch`;
                containerElement.style.setProperty(`cursor`, `pointer`);
                break;
            case `real-life-card`:
                containerElement.title = `Play the Real Life demo`;
                containerElement.style.setProperty(`cursor`, `pointer`);
                break;
            case `air-assault-card`:
                containerElement.title = `Play the Air Assault demo`;
                containerElement.style.setProperty(`cursor`, `pointer`);
                break;
            case `online-adventures-card`:
                containerElement.title = `Play Online Adventures`;
                containerElement.style.setProperty(`cursor`, `pointer`);
                break;
            case `snake-3d-card`:
                containerElement.title = `Play the Snake 3D demo`;
                containerElement.style.setProperty(`cursor`, `pointer`);
                break;
            case `anthony-ant-card`:
                containerElement.title = `Play the Anthony Ant demo`;
                containerElement.style.setProperty(`cursor`, `pointer`);
                break;
            case `pdf-link`:
                containerElement.title = `Download my resume as a pdf`;
                containerElement.style.setProperty(`cursor`, `pointer`);
                break;
            case `call-link`:
                containerElement.title = `Click to give me a ring`;
                containerElement.style.setProperty(`cursor`, `pointer`);
                break;
            case `message-link`:
                containerElement.title = `Click here to shoot me a text`;
                containerElement.style.setProperty(`cursor`, `pointer`);
                break;
            case `email-link`:
                containerElement.title = `Get in touch via email`;
                containerElement.style.setProperty(`cursor`, `pointer`);
                break;
            case `linkedin-link`:
                containerElement.title = `Go to my Linkedin profile`;
                containerElement.style.setProperty(`cursor`, `pointer`);
                break;
            case `snapchat-link`:
                containerElement.title = `Message me on snapchat`;
                containerElement.style.setProperty(`cursor`, `pointer`);
                break;
            default:
                containerElement.style.setProperty(`cursor`, `default`);
                containerElement.title = ``;
                break;
        };
    });

    controls.setOnResize(function(e) {
        setCameraZ();
    });

    controls.setOnTouchStart(function(e) {
        touchStartY = e.touches[0].clientY;
        touchPrevY = e.touches[0].clientY;
    });
    controls.setOnTouchMove(function(e) {
        touchNextY = e.touches[0].clientY;
        let deltaPixels = Math.abs(touchNextY - touchPrevY);
        if(touchNextY > touchPrevY) {
            camera.position.y += (deltaPixels * 0.02);
        }else {
            camera.position.y -= (deltaPixels * 0.02);
        }
        touchPrevY = touchNextY;
    });
    controls.setOnTouchEnd(function(e) {
        //
    });

    controls.setUpdateOnPressed(function() {
        if(active) {
            //escape
            if(controls.keyStates.has(`27`)) {
                
            }
            //w
            if(controls.keyStates.has(`87`)) {
                camera.position.z -= 0.1;
            }
            //s
            if(controls.keyStates.has(`83`)) {
                camera.position.z += 0.1;
            }
            //a
            if(controls.keyStates.has(`65`)) {
                
            }
            //d
            if(controls.keyStates.has(`68`)) {

            }
            //shift
            if(controls.keyStates.has(`16`)) {
                
            }
            //space
            if(controls.keyStates.has(`32`)) {
                //
            }

            //

        }
    });



    camera.lookAt(
        tower.position.x,
        tower.position.y,
        tower.position.z
    );



    scene.onBeginRender = function() {
        renderer.uiElement.appendChild(document.createElement(`hud-element`));
    }

    let i = 0;
    scene.update = function() {
        tower.mixer.update(0.03);

        projects_carousel_left.rotation.x -= 0.1;
        projects_carousel_right.rotation.x += 0.1;

        //many_colors_scroller.material.map.offset.y += 0.0003;
        if(i++ >= 30) {
            i = 0;
            many_colors_scroller.material.map.offset.y += 0.0194;
            if(many_colors_scroller.material.map.offset.y >= 0.9) many_colors_scroller.material.map.offset.y = 0;
        }
        header_room_1.material.map.offset.y += 0.007;



        if(projectsArmature.rotation.y > projectsFinalPosition) {
            projectsArmature.rotation.y -= CAROUSEL_ROTATION_SPEED;
            if(Math.abs(projectsArmature.rotation.y - projectsFinalPosition) < CAROUSEL_ROTATION_SPEED) projectsArmature.rotation.y = projectsFinalPosition;
        }else if(projectsArmature.rotation.y < projectsFinalPosition) {
            projectsArmature.rotation.y += CAROUSEL_ROTATION_SPEED;
            if(Math.abs(projectsArmature.rotation.y - projectsFinalPosition) < CAROUSEL_ROTATION_SPEED) projectsArmature.rotation.y = projectsFinalPosition;
        }
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
