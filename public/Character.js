import * as THREE from 'three';
import {
    CURRENT_GAME_EPOCH,
    CURRENT_SCENE_PLAYER_REFERENCE,
    CURRENT_SCENE_RENDERER_REFERENCE,
    CURRENT_SCENE_SCENE_REFERENCE
} from '/public/store.js';
import { getDefinition } from '/public/Item.js';

export const SIZES = [
    "small",
    "medium",
    "large"
];



export class Character {
    name;
    gender;
    color;
    size;
    quirks;
    stats;
    rolls;
    coins;

    meshUrl;
    mesh;

    renderer;
    scene;

    equippedItems = [];
    equipment = {
        primarySlot: undefined,
        secondarySlot: undefined,
        aux1Slot: undefined,
        aux2Slot: undefined,
        headSlot: undefined,
        neckSlot: undefined,
        keysSlot: undefined,
        cardSlot: undefined,
        bodySlot: undefined,
        handsSlot: undefined,
        LRingSlot: undefined,
        RRingSlot: undefined,
        backSlot: undefined,
        waistSlot: undefined,
        legsSlot: undefined,
        feetSlot: undefined,

        loadEquippedItems: async function() {
            for(let i = 0; i < this.equippedItems.length; i++) {
                await this.equipment.equipFromId(this.equippedItems[i]);
            }
        }.bind(this),

        equipFromId: async function(id) {
            let item = await getDefinition(id);
            await this.equipment.equipFromObject(item);
        }.bind(this),

        equipFromObject: async function(item) {
            //return if item is not equippable
            if(!item.equipSlot) {
                console.log(`Item of ID "${ item.id }" is not equippable...`);
                return(false);
            }

            //if an item is already equipped in this slot
            if(this.equipment[ item.equipSlot ]) {
                console.log(`An item is already equipped in ${ item.equipSlot }... Removing "${ this.equipment[ item.equipSlot ].name }".`);
                this.mesh.remove(this.equipment[ item.equipSlot ].wornMesh);
                this.equipment[ item.equipSlot ] = undefined;
            }

            //return if character cannot equip item
            /*
            if(item.min) {
                let minKeys = Object.keys(item.min);
                for(let i = 0; i < minKeys.length; i++) {
                    //check each key and return if player does not meet min value
                }
            }
            */

            //Load the equippedItem.
            let wornMesh = await this.renderer.loadGlb(
                item.wornMeshUrl,
                async function(gltf) {
                    await gltf.scene.traverse(
                        async function(child) {
                            if(child.type == `SkinnedMesh`) {

                                //Set the skeleton of the skinnedmesh of the loaded item to the skeleton of the character mesh.
                                child.skeleton = this.mesh.skinnedMesh.skeleton;

                            }
                        }.bind(this)
                    );
                }.bind(this)
            );
            item.wornMesh = wornMesh;

            //Add the item scene object to the character scene object.
            this.mesh.add(wornMesh);
            this.equipment[ item.equipSlot ] = item;
        }.bind(this),

        getData: function() {
            let data = [];

            if(this.primarySlot ?? false) data.push(this.primarySlot.id)
            if(this.secondarySlot ?? false) data.push(this.secondarySlot.id);
            if(this.aux1Slot ?? false) data.push(this.aux1Slot.id);
            if(this.aux2Slot ?? false) data.push(this.aux2Slot.id);
            if(this.headSlot ?? false) data.push(this.headSlot.id);
            if(this.neckSlot ?? false) data.push(this.neckSlot.id);
            if(this.keysSlot ?? false) data.push(this.keysSlot.id);
            if(this.cardSlot ?? false) data.push(this.cardSlot.id);
            if(this.bodySlot ?? false) data.push(this.bodySlot.id);
            if(this.handsSlot ?? false) data.push(this.handsSlot.id);
            if(this.LRingSlot ?? false) data.push(this.LRingSlot.id);
            if(this.RRingSlot ?? false) data.push(this.RRingSlot.id);
            if(this.backSlot ?? false) data.push(this.backSlot.id);
            if(this.waistSlot ?? false) data.push(this.waistSlot.id);
            if(this.legsSlot ?? false) data.push(this.legsSlot.id);
            if(this.feetSlot ?? false) data.push(this.feetSlot.id);

            return(data);
        }
    };

    inventoryItems;
    inventory = {
        items: [],

        addItem: async function(id) {
            let item = undefined;

            try {
                item = await getDefinition(id);
            }catch(e) {
                return(false);
            }

            return(true);
        }.bind(this)
    };
    creationTime;
    currentScene;
    currentPosition;
    currentRotation;

    constructor(options = {}) {
        this.name = options.name;
        this.color = options.color;
        this.gender = options.gender;
        this.size = options.size;
        this.quirks = options.quirks;
        this.stats = options.stats;
        this.rolls = options.rolls;
        this.coins = options.coins;
        this.bank = options.bank;

        this.equippedItems = options.equippedItems ?? [];
        this.inventoryItems = options.inventoryItems ?? [];

        this.renderer = options.renderer ?? CURRENT_SCENE_RENDERER_REFERENCE.get();
        this.scene = options.scene ?? CURRENT_SCENE_SCENE_REFERENCE.get();

        this.creationTime = options.creationTime ?? CURRENT_GAME_EPOCH.get();
        this.currentScene = options.currentScene ?? 'city';
        this.currentPosition = options.currentPosition ?? new THREE.Vector3(12.0, 0.0, 24.0);
        this.currentRotation = options.currentRotation ?? new THREE.Vector3(0.0, 0.0, 0.0);
    }

    async loadAllData() {
        //Load initial derived mesh.
        await this.loadMesh();
        
        //Set initial color.
        await this.setColor();

        //Load inventory.
        await this.equipment.loadEquippedItems();

        //that.inventory = that.inventoryItems;
    }

    async loadMesh(url = this.meshUrl = `/public/assets/glb/stick-${ ((this.gender)? ("male"): ("female")) }-${ SIZES[this.size] }.glb`) {
        if(this.mesh) {
            this.scene.remove(this.mesh);
            this.mesh = undefined;
        }

        let skinnedMesh;
        this.mesh = await this.renderer.loadGlb(
            this.meshUrl,
            async function(gltf) {
                //Traverse the collection on initial load.
                await gltf.scene.traverse(async function(child) {
                    child.frustumCulled = false;

                    //Set the skinnedMesh reference.
                    if(child.type == `SkinnedMesh`) {
                        skinnedMesh = child;
                    }

                }.bind(this));

                //Embed animations.
                const clips = await gltf.animations;
                //Create an animation mixer for the mesh upon itself.
                gltf.scene.mixer = new THREE.AnimationMixer(gltf.scene);
                //Create empty actions object and load with all animation clips
                gltf.scene.actions = {};
                for(let i = 0; i < clips.length; i++) {
                    gltf.scene.actions[clips[i].name] = gltf.scene.mixer.clipAction(clips[i]);
                }
                //Set the default action.
                gltf.scene.actions.currentAction = `idle`;
                gltf.scene.actions[`idle`].play();
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
            }.bind(this)

        );

        this.mesh.skinnedMesh = skinnedMesh;

        await this.scene.add(this.mesh);
    }

    setColor(color = this.color) {
        this.color = color;
        this.mesh.skinnedMesh.material.color.set(color);
    }

    getData() {
        return({
            name: this.name,
            color: this.color,
            gender: this.gender,
            size: this.size,
            quirks: this.quirks,
            stats: this.stats,
            rolls: this.rolls,
            coins: this.coins,
            bank: this.bank,
            equippedItems: this.equippedItems,
            inventoryItems: this.inventoryItems,
            creationTime: this.creationTime,
            currentScene: this.currentScene,
            currentPosition: this.currentPosition,
            currentRotation: this.currentRotation
        });
    }

    destroy() {
        //unload mesh
        //unload all items
    }
}







export function radiusFollow(leader, follower, r) {
    if ((vec2Distance(leader.position, follower.position)) > r) {
        let vDiff = vec3Subtract(follower.position, leader.position);
        let norm = vec2Distance(leader.position, follower.position);
        follower.position.set(leader.position.x + ((vDiff.x * r) / norm), follower.position.y, leader.position.z + ((vDiff.z * r) / norm));
    }
}
export function followBehind(leader, follower, distance, stepRate) {
    follower.position.x -= (follower.position.x - (-(distance * Math.sin(leader.rotation.y)) + leader.position.x))/stepRate;
    follower.position.z -= (follower.position.z - (-(distance * Math.cos(leader.rotation.y)) + leader.position.z))/stepRate;
}

export function radiusFollow3D(leader, follower, leash) {
    let delta = vec3Distance(leader, follower);
    if(delta > leash) {
        let pos = rayFrom(leader, follower, leash);
        return(pos);
    }
    return(follower);
}

export function rayFrom(start, end, length) {
    const dir = (end.clone().sub(start)).normalize();
    const pos = start.clone().addScaledVector(dir, length);
    return(pos);
}

export function vec3Distance(pos1, pos2) {
    return(Math.sqrt((Math.pow((pos2.x - pos1.x),2) + Math.pow((pos2.y - pos1.y), 2) + Math.pow((pos2.z - pos1.z), 2))));
}

export function vec2Distance(pos1, pos2) {
    return(Math.sqrt((Math.pow((pos2.x - pos1.x), 2)) + (Math.pow((pos2.z - pos1.z), 2))));
}

export function vec3Subtract(vec3Minuend, vec3Subtrahend) {
    let result = ({x: (vec3Minuend.x - vec3Subtrahend.x), y: (vec3Minuend.y - vec3Subtrahend.y), z: (vec3Minuend.z - vec3Subtrahend.z)});
    return(result);
}

export function lookBottomToPointAndFacePoint(modelPosition, bottomTarget, frontTarget) {
    //Desired world-space directions.
    const y = new THREE.Vector3().addVectors(bottomTarget, modelPosition).normalize();
    const z = new THREE.Vector3().addVectors(frontTarget, modelPosition).normalize();

    //Ensure z is perpendicular to y.
    const x = new THREE.Vector3().crossVectors(z, y).normalize();
    z.crossVectors(x, y);

    //Build rotation matrix.
    const m = new THREE.Matrix4();
    m.makeBasis(x, y, z);

    //Convert to quaternion.
    const q = new THREE.Quaternion().setFromRotationMatrix(m);
    return(q);
}

export function passthroughClamp(value, min, max) {
    if(value > max) value -= max;
    if(value < min) value += max;
    return(value);
}

export function clamp(value, min, max) {
    return(Math.max(min, Math.min(max, value)));
}

export function vec3CartesianToSpherical(x, y, z) {
    const radius = Math.sqrt(x * x + y * y + z * z);

    if(radius === 0) {
        return({
            radius: radius,
            theta: Math.atan2(x, z),
            phi: Math.acos(clamp(y / radius, -1, 1))
        });
    }

    return({
        radius: radius,
        theta: Math.atan2(x, z),
        phi: Math.acos(clamp(y / radius, -1, 1))
    });
}

export function sphericalToVec3Cartesian(radius, phi, theta) {
    const sinPhiRadius = Math.sin(phi) * radius;

    return({
        x: sinPhiRadius * Math.sin(theta),
        y: Math.cos( phi ) * radius,
        z: sinPhiRadius * Math.cos(theta)
    });
}
