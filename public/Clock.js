import * as THREE from 'three';
import { CURRENT_GAME_EPOCH } from "/public/store.js";

let atmosphereOpacity = 0.0;

const skyShader = {
    uniforms: {
        uTimeOfDay: {
            value: ((CURRENT_GAME_EPOCH.get() / 60) % 24)
        },
        uAtmosphereOpacity: {
            value: atmosphereOpacity
        }
    },
    vertexShader: `
        varying vec3 vWorldPosition;
        
        void main() {
            vWorldPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTimeOfDay;
        uniform float uAtmosphereOpacity;
        
        varying vec3 vWorldPosition;
        
        vec4 nightSkyColor = vec4(0.01, 0.01, 0.01, 1.0);
        vec3 atmosphereColor = vec3(0.8, 1.0, 1.0);

        vec4 alphaOver(vec4 A, vec4 B) {
            float a = B.a + A.a * (1.0 - B.a);
            vec3  rgb = (B.rgb * B.a + A.rgb * A.a * (1.0 - B.a)) / max(a, 1e-5);
            return vec4(rgb, a);
        }

        void main() {
            
            //the uAtmosphereOpacity wave will be negative during night cycle, so clamp it to 0.
            float opac = 0.0;
            if(uAtmosphereOpacity >= 0.0) opac = uAtmosphereOpacity;



            /*
                Must figure out how to draw star systems from center of sphere and move them
                12 constellations in game
                each constellation moves into position directly above per month
                the constellations are associated with various gameplay effects
            */
            //sparkling starry night sky with constellations drifting into position
            //this is the background of lowest z-index
            vec4 col = alphaOver(nightSkyColor, vec4(atmosphereColor, opac));



            /*
                Must figure out how to make the zenith a gradient along the horizon
                sun enters east and exits west
                it should scatter lower length light locally
                lowest -> highest in visible spectrum
                red, orange, yellow, green, cyan, blue, purple, violet

                the opacity should disappear during the day
                graph wavelength of opac
                find wavelength that peaks at start and end of day cycle
                something like 2.0 * sin(uAtmosphereOpacity) but better
            */
            //zenith color gradient along horizon.
            vec3 color0 = vec3(0.9, 0.9, 0.9);
            vec3 color1 = vec3(0.9, 0.9, 0.9);
            vec3 color2 = vec3(0.9, 0.9, 0.9);

            //using the opacity float for the break makes the zenith gradually grow in and shrink out.
            float break0 = 0.0 - opac;
            float break1 = 0.0;
            float break2 = opac;

            //using world position distributed across the sphere for fragcoord / height based breaks in gradient.
            vec2 uv = vWorldPosition.xy / vec2(1024.0, 512.0);
            float y = uv.y;

            vec4 c = vec4(0.0);

            if (y < break0) {
                c = vec4(color0, 0.0);
            } else if (y < break1) {
                float t = (y - break0) / (break1 - break0);
                c = mix(vec4(color0, 0.0), vec4(color1, opac), t);
            } else if (y < break2) {
                float t = (y - break1) / (break2 - break1);
                c = mix(vec4(color1, opac), vec4(color2, 0.0), t);
            } else {
                c = vec4(color2, 0.0);
            }

            gl_FragColor = alphaOver(col, c);
        }
    `
};

const geo = new THREE.SphereGeometry(1000, 12, 7);
const mat = new THREE.ShaderMaterial({
    ...skyShader,
    side: THREE.BackSide,
    depthWrite: false
});
const sky = new THREE.Mesh(geo, mat);
//Create cube render target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter
});
//Create cube camera
const cubeCam = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
cubeCam.position.set(0, 100, 0);

function updateDayNight(totalGameMinutes) {
    const gameHours = (totalGameMinutes / 60) % 24;
    sky.material.uniforms.uTimeOfDay.value = gameHours;
    
    /*
    sunLight.position.set(Math.sin(angle), Math.cos(angle), 0.2);
    sunLight.intensity = Math.max(0, Math.cos(angle));   // 0 at night
    sunLight.color.setHSL(0.1, 1, 0.5 + 0.3*Math.cos(angle)); // warm/cold
    //*/
}

export class Clock {

    renderer;
    scene;
    //ms is the actual ms counter.
    ms = 0;
    //tickRate is the number of milliseconds that comprise one game minute.
    tickRate = 2000;
    //ii is the input for the sine wave uniform, defining the shader day night cycle.
    //it is initialized to the current minute of the day / the number of minutes in a full day,
    //multiplied by 2*PI (a full wave cycle)
    ii = (((CURRENT_GAME_EPOCH.get() % 1440) / 1440) * (2 * Math.PI));
    //iirate is one day night cycle divided by the number of minutes in one day.
    iirate = (2 * Math.PI) / 1440;

    constructor(renderer, scene) {
        this.renderer = renderer;
        this.scene = scene;
        this.scene.add(sky);
        this.scene.add(cubeCam);
        cubeCam.update(this.renderer.renderer, this.scene);
        skyShader.uniforms.uAtmosphereOpacity.value = (-Math.cos(this.ii));
        updateDayNight(CURRENT_GAME_EPOCH.get());
        cubeCam.update(this.renderer.renderer, this.scene);
        this.scene.environment = cubeCam.renderTarget.texture;
    }

    tick(n) {
        this.ms += n;

        //-Math.cos(x) graphs a wave which begins at the bottom of the wave (midnight).
        skyShader.uniforms.uAtmosphereOpacity.value = (-Math.cos(this.ii));
        //console.log(skyShader.uniforms.uAtmosphereOpacity.value);

        if(this.ms >= this.tickRate) {
            this.ms -= this.tickRate;
            this.ii += this.iirate;

            CURRENT_GAME_EPOCH.set((CURRENT_GAME_EPOCH.get() + 1));

            updateDayNight(CURRENT_GAME_EPOCH.get());
            cubeCam.update(this.renderer.renderer, this.scene);
            this.scene.environment = cubeCam.renderTarget.texture;
        }
    }
}
