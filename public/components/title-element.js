import { LitElement, html, css } from 'lit';
import { hudElement } from '/public/components/hud-element.js';
import { globalStyles } from '/public/globalStyles.js';
import { CURRENT_SCENE_RENDERER_REFERENCE } from '/public/store.js';
import { CHARACTER_SLOTS_DATA } from '../store';

export class TitleElement extends LitElement {

    auth = true;
    data = {
        allowed: 4,
        characters: []
    };
    prompt = null;

    static styles = [
        globalStyles,
        css`
            #container {
                width: 100%;
                height: 100%;
                padding: 2.0em;
            }

            #logo {
                height: 150px;
                width: 800px;
                min-width: 300px;
                max-width: 800px;
                background-image: url("/public/assets/images/real-life-logo-title.png");
                background-size: cover;
            }

            span {
                font-size: 2.0em;
            }
            .grayed {
                color: rgb(100, 100, 130);
                cursor: not-allowed;
            }
            span:not(.grayed):hover {
                cursor: pointer;
                padding-left: 7px;
                padding-right: 7px;
                background-color: rgba(255, 255, 200, 0.2);
            }
        `
    ];

    constructor() {
        super();

        this.slots = CHARACTER_SLOTS_DATA.get();
    }

    promptClicked(e) {
        let prompt = this.renderRoot.querySelector('#prompt');
        let options = this.renderRoot.querySelector('#options');
        prompt.classList.toggle(`hidden`);
        options.classList.toggle(`hidden`);
    }

    selectCharacter() {
        (async function() {
            let rdr = await CURRENT_SCENE_RENDERER_REFERENCE.get();
            await rdr.endScene();
            await window.location.replace(`/character-select`);
        })();
    }

    createCharacter() {
        (async function() {
            let rdr = await CURRENT_SCENE_RENDERER_REFERENCE.get();
            await rdr.endScene();
            await window.location.replace(`/character-configurator`);
        })();
    }

    deleteCharacter() {
        console.log(`Delete character`);
    }

    exitToLobby(e) {
        (async function() {
            let rdr = await CURRENT_SCENE_RENDERER_REFERENCE.get();
            await rdr.endScene();
            await window.location.replace(`/`);
        })();
    }

    getSelectCharacterElement() {
        return(
            (this.slots.length <= 0)?
            (html`<span class="grayed" title="You do not have any characters to select.">Select character</span>`):
            (html`<span @click=${ this.selectCharacter }>Select character</span>`)
        );
    }

    getCreateCharacterElement() {
        return(
            (this.data.characters.length >= this.data.allowed)?
            (html`<span class="grayed" title="Character slot limit reached!">Create character</span>`):
            (html`<span @click=${ this.createCharacter }>Create character</span>`)
        );
    }

    getDeleteCharacterElement() {
        return(
            (this.slots.length <= 0)?
            (html`<span class="grayed" title="You do not have any characters to delete.">Delete character</span>`):
            (html`<span @click=${ this.deleteCharacter }>Delete character</span>`)
        );
    }

    getOptions() {
        return((this.auth)?
            html`
                ${ this.getSelectCharacterElement() }
                ${ this.getCreateCharacterElement() }
                ${ this.getDeleteCharacterElement() }
            `:
            html`
                <div>Authentication credentials not found!</div>
            `
        );
    }

    render() {
        return html`
        <div id="container" class="col center between unselectable">

            <div id="logo"></div>

            <span id="prompt" @click=${ this.promptClicked }>Click here to start</span>

            <div id="options" class="col center between hidden">
                ${ this.getOptions() }
                <span @click=${ this.exitToLobby }>Exit to lobby</span>
            </div>
        </div>
        `;
    }

}

customElements.define('title-element', TitleElement);
