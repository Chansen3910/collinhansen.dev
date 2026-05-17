import * as THREE from 'three';
import { Renderer } from '/public/Renderer.js';
import { ScrollBarElement } from '/public/components/scroll-bar.js';
import { NotificationToast } from '/public/components/notification-toast.js';
import {
    CURRENT_SCENE_RENDERER_REFERENCE,
    CURRENT_GAME_EPOCH,
    CURRENT_SCROLL_POSITION,
    CURRENT_SCENE_IS_ACTIVE
} from '/public/store.js';



let containerElement = document.getElementById(`container`);
let debugElement = document.getElementById(`debug`);
let filterElement = document.getElementById(`filter`);
let uiElement = document.getElementById(`ui`);
let canvasElement = document.getElementById(`canvas`);



let renderer = new Renderer(containerElement, debugElement, filterElement, uiElement, canvasElement);
CURRENT_SCENE_RENDERER_REFERENCE.set(renderer);
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
let clock_little_hand,
    clock_big_hand;
const CAROUSEL_ROTATION_SPEED = 0.07;

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
    scene.name = `home`;
    scene.transitionIn = `fadeIn`;
    scene.transitionOut = `fadeOut`;
    scene.clock = true;



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
                    if(child.name == `clock-big-hand`) clock_big_hand = child;
                    if(child.name == `clock-little-hand`) clock_little_hand = child;
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

    CURRENT_GAME_EPOCH.subscribe(function(value) {
        console.log(value % 60);
        clock_big_hand.rotation.z = (Math.PI / 30) * (-(value % 60));
        clock_little_hand.rotation.z = (Math.PI / 6) * (-(value % 720) / 60);
    });

    renderer.camera.position.y = CURRENT_SCROLL_POSITION.get();
    CURRENT_SCROLL_POSITION.subscribe(function(value) {
        renderer.camera.position.y = -value;
    });



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

        let s = CURRENT_SCROLL_POSITION.get() - 0.3
        CURRENT_SCROLL_POSITION.set(s);
    });
    controls.setOnWheelDown(function(e) {
        camera.position.y -= 0.3;

        let s = CURRENT_SCROLL_POSITION.get() + 0.3;
        CURRENT_SCROLL_POSITION.set(s);
    });

    let clickDefault = function() {
        //console.log("No valid click target!");
    }
    let comingSoonToast = function() {
        let toast = document.createElement("notification-toast");
        toast.setAttribute("box-title", "Coming soon!");
        toast.setAttribute("box-message", "I previously wiped my entire GitHub account. The live applications no longer exist, but will be returning shortly.<br /><br />Thank you for your patience as I rebuild my online presence.");
        toast.setAttribute("button-value", "OK");
        document.getElementById("ui").appendChild(toast);
    }
    const clickTargets = {
        "projects-carousel-right-hitbox": function() {
            projectsFinalPosition -= (2 * (Math.PI / 7));
        },
        "projects-carousel-left-hitbox": function() {
            projectsFinalPosition += (2 * (Math.PI / 7));
        },
        "newtube-card": comingSoonToast,
        "study-buddy-card": comingSoonToast,
        "real-life-card": comingSoonToast,
        "air-assault-card": comingSoonToast,
        "online-adventures-card": comingSoonToast,
        "snake-3d-card": comingSoonToast,
        "anthony-ant-card": comingSoonToast,
        "pdf-link": function() {
            window.open("/public/assets/files/Collin_Hansen_Resume.pdf", "_blank");
        },
        "call-link": function() {
            location = 'tel:+14322716960';
        },
        "message-link": function() {
            location = `sms:+14322716960?body=${ ((new Date().getHours() < 12)? ('Good morning'): ('Good afternoon')) + ` Collin! My name is ...` }`;
        },
        "email-link": function() {
            location.href = `mailto:chansen3910@gmail.com?subject=${ ((new Date().getHours() < 12)? ('Good morning'): ('Good afternoon')) + ` Collin!` }&body=...`;
        },
        "slack-link": function() {
            location.href = 'https://join.slack.com/t/contactcollinhansen/shared_invite/zt-3xr0uv29z-x4iF9EVTp15pWs6rCpXWoQ';
        }
    };
    controls.setOnClick(function(e) {
        e.stopPropagation();
        if(!CURRENT_SCENE_IS_ACTIVE.get()) {
            return;
        }

        raycaster.setFromCamera(
            new THREE.Vector2(controls.mouse.x, controls.mouse.y),
            camera
        );
        let intersects = raycaster.intersectObjects(tower.children, true);
        if(intersects.length == 0) return;

        console.log(intersects[0].object.name);

        let cb = clickTargets[ intersects[0].object.name ];
        if(cb == null) clickDefault();
        else cb();
    });

    let moveDefault = function() {
        containerElement.style.setProperty(`cursor`, `default`);
        containerElement.title = ``;
    }
    const moveTargets = {
        "projects-carousel-right-hitbox": function() {
            containerElement.title = `Send the carousel forward`;
            containerElement.style.setProperty(`cursor`, `pointer`);
        },
        "projects-carousel-left-hitbox": function() {
            containerElement.title = `Send the carousel backward`;
            containerElement.style.setProperty(`cursor`, `pointer`);
        },
        "newtube-card": function() {
            containerElement.title = `Visit newtube.ch`;
            containerElement.style.setProperty(`cursor`, `pointer`);
        },
        "study-buddy-card": function() {
            containerElement.title = `Visit studybuddy.ch`;
            containerElement.style.setProperty(`cursor`, `pointer`);
        },
        "real-life-card": function() {
            containerElement.title = `Play the Real Life demo`;
            containerElement.style.setProperty(`cursor`, `pointer`);
        },
        "air-assault-card": function() {
            containerElement.title = `Play the Air Assault demo`;
            containerElement.style.setProperty(`cursor`, `pointer`);
        },
        "online-adventures-card": function() {
            containerElement.title = `Play Online Adventures`;
            containerElement.style.setProperty(`cursor`, `pointer`);
        },
        "snake-3d-card": function() {
            containerElement.title = `Play the Snake 3D demo`;
            containerElement.style.setProperty(`cursor`, `pointer`);
        },
        "anthony-ant-card": function() {
            containerElement.title = `Play the Anthony Ant demo`;
            containerElement.style.setProperty(`cursor`, `pointer`);
        },
        "pdf-link": function() {
            containerElement.title = `Download my resume as a pdf`;
            containerElement.style.setProperty(`cursor`, `pointer`);
        },
        "call-link": function() {
            containerElement.title = `Click to give me a ring`;
            containerElement.style.setProperty(`cursor`, `pointer`);
        },
        "message-link": function() {
            containerElement.title = `Click here to shoot me a text`;
            containerElement.style.setProperty(`cursor`, `pointer`);
        },
        "email-link": function() {
            containerElement.title = `Get in touch via email`;
            containerElement.style.setProperty(`cursor`, `pointer`);
        },
        "slack-link": function() {
            containerElement.title = `Join my Slack channel`;
            containerElement.style.setProperty(`cursor`, `pointer`);
        }
    };
    controls.setOnMouseMove(function(e) {
        raycaster.setFromCamera(
            new THREE.Vector2(controls.mouse.x, controls.mouse.y),
            camera
        );
        let intersects = raycaster.intersectObjects(tower.children, true);
        if(intersects.length == 0) return;

        let cb = moveTargets[ intersects[0].object.name ];
        if(cb == null) moveDefault();
        else cb();
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

            let s = CURRENT_SCROLL_POSITION.get() - (deltaPixels * 0.02);
            CURRENT_SCROLL_POSITION.set(s);
        }else {
            camera.position.y -= (deltaPixels * 0.02);

            let s = CURRENT_SCROLL_POSITION.get() + (deltaPixels * 0.02);
            CURRENT_SCROLL_POSITION.set(s);
        }
        touchPrevY = touchNextY;
    });
    controls.setOnTouchEnd(function(e) {
        if(!CURRENT_SCENE_IS_ACTIVE.get()) {
            return;
        }

        //
    });

    controls.setUpdateOnPressed(function() {
        if(!CURRENT_SCENE_IS_ACTIVE.get()) {
            return;
        }

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
    });



    scene.onBeginRender = function() {
        let mainDiv = document.createElement(`div`);
        mainDiv.classList.add("w-100", "h-100", "row", "center", "between");

        mainDiv.appendChild(document.createElement(`div`));
        mainDiv.appendChild(document.createElement(`scroll-bar-element`));

        renderer.uiElement.appendChild(mainDiv);
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
