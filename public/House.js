import { Vector3 } from 'three';

export class Ray {
    origin;
    direction;

    constructor(origin, direction) {
        this.origin = new Vector3(
            origin.x,
            origin.y,
            origin.z
        );
        this.direction = new Vector3(
            direction.x,
            direction.y,
            direction.z
        );
    }
};

export class Selection {
    name;
    callback;

    constructor(name, callback) {
        this.name = name;
        this.callback = callback;
    }
};

export class Opportunity {
    title;
    ray;
    selections;

    constructor(title, ray, selections) {
        this.title = title;
        this.ray = ray;
        this.selections = selections;
    }
};
