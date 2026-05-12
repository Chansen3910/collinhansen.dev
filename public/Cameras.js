import { Vector3 } from 'three';
import { vec3Distance } from '/public/Character.js';
import { GridPoint } from '/public/House.js';
import {
    CURRENT_SCENE_CAMERA_REFERENCE,
    CURRENT_OPPORTUNITY_TITLE,
    CURRENT_OPPORTUNITY_SELECTIONS
} from '/public/store.js';

export class OpportunityCamera {
    camera;
    opportunities = [];
    RELATIVE_MODE;
    RELATIVE_MODE_TOTAL_STEPS;

    currentOrigin = new Vector3(0.0, 0.0, 0.0);
    currentDirection = new Vector3(0.0, 0.0, 0.0);

    targetOrigin = new Vector3(0.0, 0.0, 0.0);
    targetDirection = new Vector3(0.0, 0.0, 0.0);

    currentIndex = 0;
    targetIndex = 0;

    directionStep = 0.3;
    originStep = 0.3;

    originIdle = true;
    directionIdle = true;
    idle = true;

    constructor(options = {}) {
        this.camera = options.camera ?? CURRENT_SCENE_CAMERA_REFERENCE.get();
        this.opportunities = options.opportunities ?? [];
        this.RELATIVE_MODE = options.RELATIVE_MODE ?? true;
        this.RELATIVE_MODE_TOTAL_STEPS = options.RELATIVE_MODE_TOTAL_STEPS ?? 21;

        this.setIndex(0);
    }

    hotswapOpportunities(opportunities) {
        if(opportunities.length <= 0) throw(`CONSTRUCTION FAILED: No opportunities were provided to OpportunityCamera.`);
        this.opportunities = opportunities;

        this.setIndex(0);
    }

    update() {
        //Prevent attempting to update when there is nothing to update.
        if(this.idle) return;

        //If originIdle is set, the origin doesn't need to be updated.
        if(!this.originIdle) {
            let deltaOrigin = vec3Distance(this.currentOrigin, this.opportunities[this.targetIndex].ray.origin);

            if(deltaOrigin < 0.01) {
                //Snap the origin vector if distance < 0.01.
                this.camera.position.set(
                    this.targetOrigin.x,
                    this.targetOrigin.y,
                    this.targetOrigin.z
                );

                this.originIdle = true;
            }else {
                //Otherwise, step the direction vector by originStep.
                this.currentOrigin = this.marchLine(
                    this.currentOrigin,
                    this.targetOrigin,
                    this.originStep
                );

                this.camera.position.set(
                    this.currentOrigin.x,
                    this.currentOrigin.y,
                    this.currentOrigin.z
                );
                this.camera.lookAt(
                    this.currentDirection.x,
                    this.currentDirection.y,
                    this.currentDirection.z
                );
            }
        }

        //if directionIdle is set, the direction doesn't need to be updated.
        if(!this.directionIdle) {
            let deltaDirection = vec3Distance(this.currentDirection, this.targetDirection);

            if(deltaDirection < 0.01) {
                //Snap the direction vector if distance < 0.01.
                this.camera.lookAt(
                    this.targetDirection.x,
                    this.targetDirection.y,
                    this.targetDirection.z
                );

                this.directionIdle = true;
            }else {
                //Otherwise, step the direction vector by directionStep.
                this.currentDirection = this.marchLine(
                    this.currentDirection,
                    this.targetDirection,
                    this.directionStep
                );

                this.camera.lookAt(
                    this.currentDirection.x,
                    this.currentDirection.y,
                    this.currentDirection.z
                );
            }
        }

        if(this.originIdle && this.directionIdle) {
            this.idle = true;
            this.currentIndex = this.targetIndex;
        }
    }

    //March the origin to the target by scalarDelta distance.
    marchLine(origin, target, scalarDelta) {
        //Get the direction vector.
        const direction = new Vector3().subVectors(target, origin);
        let distance = vec3Distance(target, origin);

        //Normalize the line for scaling.
        direction.normalize();

        //Scale the direction vector and add to the origin.
        let x = origin.clone();
        x.addScaledVector(
            direction, Math.min(scalarDelta, distance)
        );

        return(x);
    }

    nextIndex() {
        //Prevent setting the targetIndex if currently moving to next index.
        if(!this.idle) return;

        //Increment the targetIndex or set to 0 if max.
        if(this.targetIndex >= this.opportunities.length - 1) {
            this.setIndex(0);
        }else {
            this.setIndex(this.targetIndex + 1);
        }
    }

    previousIndex() {
        //Prevent setting the targetIndex if currently moving to next index.
        if(!this.idle) return;

        //Decrement the targetIndex or set to max if 0.
        if(this.targetIndex <= 0) {
            this.setIndex(this.opportunities.length - 1);
        }else {
            this.setIndex(this.targetIndex - 1);
        }
    }

    setIndex(index) {
        //Prevent setting the targetIndex if currently moving to next index.
        if(!this.idle) return;

        this.targetIndex = index;

        this.targetOrigin = this.opportunities[this.targetIndex].ray.origin;
        this.targetDirection = this.opportunities[this.targetIndex].ray.direction;

        CURRENT_OPPORTUNITY_TITLE.set(this.opportunities[this.targetIndex].title);
        CURRENT_OPPORTUNITY_SELECTIONS.set(this.opportunities[this.targetIndex].selections);

        //optionally set the step values from linear to relative distance.
        if(this.RELATIVE_MODE) {
            this.originStep = vec3Distance(this.currentOrigin, this.targetOrigin) / this.RELATIVE_MODE_TOTAL_STEPS;
            this.directionStep = vec3Distance(this.currentDirection, this.targetDirection) / this.RELATIVE_MODE_TOTAL_STEPS;
        }

        //Unset idles to trigger update.
        this.unsetIdles();
    }

    unsetIdles() {
        this.idle = false;
        this.originIdle = false;
        this.directionIdle = false;
    }
};







export class RenewalCamera{
    camera;
    CAMERA_Y_OFFSET = 5.0;
    CAMERA_Z_OFFSET = 5.0;

    grabbedFurniture;
    floorPoints;

    currentHorizontalIndex = 0;
    currentVerticalIndex = 0;

    constructor(options = {}) {
        this.camera = options.camera ?? CURRENT_SCENE_CAMERA_REFERENCE.get();
        this.floorPoints = options.floorPoints ?? [ [ new GridPoint(0.5, 0.0, -0.5) ] ];
        this.grabbedFurniture = options.grabbedFurniture ?? null;

        this.camera.position.set(
            this.floorPoints[ this.currentVerticalIndex ][ this.currentHorizontalIndex ].x,
            this.floorPoints[ this.currentVerticalIndex ][ this.currentHorizontalIndex ].y + this.CAMERA_Y_OFFSET,
            this.floorPoints[ this.currentVerticalIndex ][ this.currentHorizontalIndex ].z + this.CAMERA_Z_OFFSET
        );
        this.camera.lookAt(
            this.floorPoints[ this.currentVerticalIndex ][ this.currentHorizontalIndex ].x,
            this.floorPoints[ this.currentVerticalIndex ][ this.currentHorizontalIndex ].y,
            this.floorPoints[ this.currentVerticalIndex ][ this.currentHorizontalIndex ].z
        );

        this.grabbedFurniture = grabbedFurniture;

        this.updateFurniturePosition();
    }

    update() {
        //DO NOT REMOVE THIS METHOD
    }

    updateFurniturePosition() {
        this.grabbedFurniture.position.x = this.grabbedFurniture.mesh.position.x = this.floorPoints[ this.currentVerticalIndex ][ this.currentHorizontalIndex ].x;
        this.grabbedFurniture.position.y = this.grabbedFurniture.mesh.position.y = this.floorPoints[ this.currentVerticalIndex ][ this.currentHorizontalIndex ].y;
        this.grabbedFurniture.position.z = this.grabbedFurniture.mesh.position.z = this.floorPoints[ this.currentVerticalIndex ][ this.currentHorizontalIndex ].z;
    }

    moveForward() {
        let pos;

        try {
            pos = this.floorPoints[ this.currentVerticalIndex + 1 ][ this.currentHorizontalIndex ];
        }catch(e) {
            return;
        }

        if(pos) {
            //console.log(`forward`);
            this.camera.position.set(
                pos.x,
                pos.y + this.CAMERA_Y_OFFSET,
                pos.z + this.CAMERA_Z_OFFSET
            );
            this.currentVerticalIndex++;

            this.updateFurniturePosition();
        }
    }

    moveBackward() {
        let pos;

        try {
            pos = this.floorPoints[ this.currentVerticalIndex - 1 ][ this.currentHorizontalIndex ];
        }catch(e) {
            return;
        }

        if(pos) {
            //console.log(`backward`);
            this.camera.position.set(
                pos.x,
                pos.y + this.CAMERA_Y_OFFSET,
                pos.z + this.CAMERA_Z_OFFSET
            );
            this.currentVerticalIndex--;

            this.updateFurniturePosition();
        }
    }

    moveLeft() {
        let pos;

        try {
            pos = this.floorPoints[ this.currentVerticalIndex ][ this.currentHorizontalIndex - 1 ];
        }catch(e) {
            return;
        }

        if(pos) {
            //console.log(`left`);
            this.camera.position.set(
                pos.x,
                pos.y + this.CAMERA_Y_OFFSET,
                pos.z + this.CAMERA_Z_OFFSET
            );
            this.currentHorizontalIndex--;

            this.updateFurniturePosition();
        }
    }

    moveRight() {
        let pos;

        try {
            pos = this.floorPoints[ this.currentVerticalIndex ][ this.currentHorizontalIndex + 1 ];
        }catch(e) {
            return;
        }

        if(pos) {
            //console.log(`right`);
            this.camera.position.set(
                pos.x,
                pos.y + this.CAMERA_Y_OFFSET,
                pos.z + this.CAMERA_Z_OFFSET
            );
            this.currentHorizontalIndex++;

            this.updateFurniturePosition();
        }
    }

    rotateLeft() {
        this.grabbedFurniture.rotation -= ((2 * Math.PI) / 8);
        this.grabbedFurniture.mesh.rotation.y -= ((2 * Math.PI) / 8);
    }

    rotateRight() {
        this.grabbedFurniture.rotation += ((2 * Math.PI) / 8);
        this.grabbedFurniture.mesh.rotation.y += ((2 * Math.PI) / 8);
    }
};
