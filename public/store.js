import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';



export const CURRENT_SCENE_RENDERER_REFERENCE = atom(null);
export const CURRENT_SCENE_CAMERA_REFERENCE = atom(null);
export const CURRENT_SCENE_CAMERA_SYSTEM_REFERENCE = atom(null);
export const CURRENT_ESCAPE_INDEX = atom(null);
export const CURRENT_SCENE_CONTROLS_REFERENCE = atom(null);
export const CURRENT_SCENE_SCENE_REFERENCE = atom(null);



export const CURRENT_OPPORTUNITY_TITLE = atom(null);
export const CURRENT_OPPORTUNITY_SELECTIONS = atom(null);

export const DIALOG_BOX_QUEUE = atom([]);

export const DIALOG_BOX_CURRENT_SCRIPT = atom(null);

export const CURRENT_SCENE_IS_ACTIVE = persistentAtom(
    `CURRENT_SCENE_IS_ACTIVE`,
    false,
    {
        encode: JSON.stringify,
        decode: JSON.parse,
        storage: localStorage,
        listen: false
    }
);

export const CURRENT_SCENE_CLOCK = persistentAtom(
    `CURRENT_SCENE_CLOCK`,
    false,
    {
        encode: JSON.stringify,
        decode: JSON.parse,
        storage: localStorage,
        listen: false
    }
);

export const CURRENT_GAME_EPOCH = persistentAtom(
    `CURRENT_GAME_EPOCH`,
    0,
    {
        encode: JSON.stringify,
        decode: JSON.parse,
        storage: localStorage,
        listen: false
    }
);
