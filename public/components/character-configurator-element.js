import { LitElement, html, css } from 'lit';
import { globalStyles } from '/public/globalStyles.js';
import {
    CREATE_CHARACTER
} from '/public/Memory.js';
import {
    CURRENT_SCENE_RENDERER_REFERENCE,
    CURRENT_GAME_EPOCH,
    CURRENT_SCENE_CAMERA_REFERENCE,
    CURRENT_SCENE_SCENE_REFERENCE,
    CURRENT_SCENE_PLAYER_REFERENCE,
    CURRENT_SCENE_EQUIPMENT_REFERENCE
} from '/public/store.js';
import { SIZES } from '/public/Character.js';

export class CharacterConfiguratorElement extends LitElement {

    static properties = {
        currentGameEpoch: { type: Number },
        gameMinutes: { type: Number },
        gameHours: { type: Number },
        gameDays: { type: Number },
        gameMonths: { type: Number },
        gameYears: { type: Number }
    };

    formComplete = false;
    name = {
        sealed: false,
        value: undefined
    };
    gender = {
        sealed: false,
        value: undefined
    };
    color = {
        sealed: false,
        value: undefined
    };
    size = {
        sealed: false,
        value: undefined
    };
    QUIRKS = [
        `Rich Parents`,
        `Nepo Baby`,
        `Psychotic`,
        `Prisoner Eyes`,
        `Pedophile Physionomy`,
        `Murderer Physionomy`,
        `Nerd`,
        `Cleptomaniac`,
        `Autistic`,
        `Retarded`,
        `Dad Energy`,
        `Nervous Energy`,
        `Confident`,
        `Chump`
    ];
    quirks = {
        sealed: false,
        value: undefined
    };
    stats = {
        sealed: false,
        value: undefined
    };
    rolls = undefined;

    static styles = [
        globalStyles,
        css`
            input:not([disabled]) {
                cursor: pointer;
            }
            input[type="text"] {
                background-color: rgba(0, 0, 0, 0.0);
                color: inherit;
                font-size: inherit;
                font-family: inherit;
                font-style: italic;
                placeholder: "Name";
            }
            input[type="text"]::placeholder {
                color: rgb(255, 255, 255);
                opacity: 0.5;
            }

            #container {
                width: 100%;
                height: 100%;
                padding: 2.0em;
            }

            #quirk-inputs {
                columns: 2;
            }

            #roll-stats-container > *:not(:first-child) {
                margin-left: 12px;
            }

            span {
                font-size: 2.0em;
            }
            .grayed {
                color: rgb(100, 100, 130);
                cursor: not-allowed;
            }

            .ecg {
                display: grid;
                grid-template-columns: 1fr 1fr;
            }

            .switch {
                position: relative;
                display: inline-block;
                width: 46px;
                height: 24px;
                background-color: rgba(0, 0, 0, 0.25);
                border-radius: 22px;
                transition: all 0.3s;
            }
            .switch::after {
                content: '';
                position: absolute;
                width: 22px;
                height: 22px;
                border-radius: 22px;
                background-color: white;
                top: 1px;
                left: 1px;
                transition: all 0.3s;
            }
            .switch:hover {
                cursor: pointer;
            }
            input[type='checkbox']:checked + .switch::after {
                transform: translateX(22px);
            }
            input[type='checkbox']:checked + .switch {
                background-color: #7983ff;
            }
            input[type='checkbox']:disabled + .switch {
                opacity: 0.4;
                cursor: default;
            }
            .offscreen {
                position: absolute;
                left: -9999px;
            }

            /*
            span:not(.grayed):hover {
                cursor: pointer;
                padding-left: 7px;
                padding-right: 7px;
                background-color: rgba(255, 255, 200, 0.2);
            }
            //*/
        `
    ];

    constructor() {
        super();
        this.currentGameEpoch = CURRENT_GAME_EPOCH.get();

        this.player = CURRENT_SCENE_PLAYER_REFERENCE.get();
        this.name.value = this.player.name;
        this.gender.value = this.player.gender;
        this.color.value = this.player.color;
        this.size.value = this.player.size;
        this.quirks.value = this.player.quirks;
        this.stats.value = this.player.stats;
        this.rolls = this.player.rolls;
    }

    connectedCallback() {
        super.connectedCallback();

        this._unsubscribe_CURRENT_GAME_EPOCH = CURRENT_GAME_EPOCH.subscribe(function(value) {
            this.currentGameEpoch = value;
            this.gameMinutes = this.currentGameEpoch;
            this.gameHours = (this.gameMinutes / 60) >> 0;
            this.gameDays = (this.gameHours / 24) >> 0;
            this.gameMonths = (this.gameMonths / 30) >> 0;
            this.gameYears = (this.gameMonths / 12) >> 0;
        }.bind(this));
    }

    exit(e) {
        (async function() {
            await CURRENT_SCENE_RENDERER_REFERENCE.get().endScene();

            window.location.replace(`/title/`);
        })();
    }
    getNameField() {
        return((this.name.sealed)?
            (html`
                <div class="row">
                    <span class="pre-wrap">name: ${ this.name.value }</span>
                </div>
            `):
            (html`
                <div class="row">
                    <span class="pre-wrap">name: 
                        <input id="name-input-field"
                            type="text"
                            placeholder="<your name here>"
                            value="${ this.name.value }"
                            autocomplete="off">
                        </input>
                    </span>
                </div>
                <div class="col">
                    <span id="submission-hint"></span>
                    <div class="row">
                        <input type="button" value="NEXT" @click=${ this.nameNext }></input>
                        <input type="button" value="CANCEL & EXIT" @click=${ this.exit }></input>
                    </div>
                </div>
            `)
        );
    }
    nameNext(e) {
        let name = this.renderRoot.querySelector(`#name-input-field`).value;
        if(name.length < 3) {
            this.renderRoot.querySelector(`#submission-hint`).innerText = `Name must be at least 3 characters.`;
            return;
        }

        //seal the input name
        this.name.value = name;
        this.name.sealed = true;

        this.player.name = name;

        this.requestUpdate();
        return;
    }

    getGenderField() {
        if(!this.name.sealed) return;
        return((this.gender.sealed)?
            (html`
                <div class="row">
                    <span class="pre-wrap">gender: 
                        <input id="gender-input-field" class="offscreen" type="checkbox" checked="${ this.gender.value }" disabled></input>
                        <label for="gender-input-field" class="switch"></label>
                        ${ ((this.gender.value)? ("male"): ("female")) }
                    </span>
                </div>
            `):
            (html`
                <div class="row">
                    <span class="pre-wrap">gender: 
                        <input id="gender-input-field" class="offscreen" type="checkbox" checked="${ this.gender.value }" @input=${ this.genderInputChanged }></input>
                        <label for="gender-input-field" class="switch"></label>
                        ${ ((this.gender.value)? ("male"): ("female")) }
                    </span>
                </div>
                <div class="col">
                    <span id="submission-hint">click to select your gender</span>
                    <div class="row">
                        <input type="button" value="NEXT" @click=${ this.genderNext }></input>
                        <input type="button" value="BACK" @click=${ this.genderBack }></input>
                    </div>
                </div>
            `)
        );
    }
    genderInputChanged(e) {
        this.gender.value = this.player.gender = e.target.checked;

        //unload current character
        

        //load male / female
        //play animation

        this.requestUpdate();
    }
    genderNext() {
        let gender = this.renderRoot.querySelector(`#gender-input-field`).checked;

        this.gender.value = this.player.gender = gender;
        this.gender.sealed = true;

        this.requestUpdate();
        return;
    }
    genderBack() {
        this.name.sealed = false;

        (async function() {
            await this.requestUpdate();

            let ti = this.renderRoot.querySelector(`#name-input-field`);
            ti.setSelectionRange(ti.value.length, ti.value.length);
            ti.focus();
        }.bind(this))();
    }

    getColorField() {
        if(!this.gender.sealed) return;
        return((this.color.sealed)?
            (html`
                <div class="row">
                    <span class="pre-wrap">color: <input type="color" value="${ this.color.value }" disabled></input></span>
                </div>
            `):
            (html`
                <div class="row">
                    <span class="pre-wrap">color: 
                        <input id="color-input-field" type="color" value=${ this.color.value } @input=${ this.colorInputChange }></input>
                    </span>
                </div>
                <div class="col">
                    <span id="submission-hint">click to pick your color</span>
                    <div class="row">
                        <input type="button" value="NEXT" @click=${ this.colorNext }></input>
                        <input type="button" value="BACK" @click=${ this.colorBack }></input>
                    </div>
                </div>
            `)
        );
    }
    colorInputChange(e) {
        this.color.value = e.target.value;

        //update character
        (async function() {
            this.player.setColor(this.color.value);
        }.bind(this))();
    }
    colorNext(e) {
        let color = this.renderRoot.querySelector(`#color-input-field`).value;
        //color validation guard clause

        this.color.value = color;
        this.color.sealed = true;
        (async function() {
            this.player.setColor(this.color.value);
        }.bind(this))();

        this.requestUpdate();
        return;
    }
    colorBack(e) {
        this.gender.sealed = false;

        (async function() {
            await this.requestUpdate();

            this.renderRoot.querySelector(`#gender-input-field`).focus();
        }.bind(this))();
    }

    getSizeField() {
        if(!this.color.sealed) return;
        return((this.size.sealed)?
            (html`
                <div class="row">
                    <span class="pre-wrap">size: </span>
                    <div class="col center">
                        <input id="size-input-field" type="range" min="0" max="2" step="1" value="${ this.size.value }" disabled></input>
                        <span>${ SIZES[ this.size.value ] }</span>
                    </div>
                </div>
            `):
            (html`
                <div class="row">
                    <span class="pre-wrap">size: </span>
                    <div class="col center">
                        <input id="size-input-field" type="range" min="0" max="2" step="1" list="sizes" value="${ this.size.value }" @input=${ this.sizeChanged }></input>
                        <datalist id="sizes">
                            <option value="0" label="small">
                            <option value="1" label="medium">
                            <option value="2" label="large">
                        </datalist>
                        <span>${ SIZES[ this.size.value ] }</span>
                    </div>
                </div>
                <div class="col">
                    <span id="submission-hint"></span>
                    <div class="row">
                        <input type="button" value="NEXT" @click=${ this.sizeNext }></input>
                        <input type="button" value="BACK" @click=${ this.sizeBack }></input>
                    </div>
                </div>
            `)
        );
    }
    sizeChanged(e) {
        this.size.value = this.player.size = e.target.value;

        this.requestUpdate();

        //update size of character
    }
    sizeNext(e) {
        let size = this.renderRoot.querySelector(`#size-input-field`).value;

        this.size.value = this.player.size = size;
        this.size.sealed = true;

        this.requestUpdate();
        return;
    }
    sizeBack(e) {
        this.color.sealed = false;

        (async function() {
            await this.requestUpdate();

            this.renderRoot.querySelector(`#color-input-field`).focus();
        }.bind(this))();
    }

    getQuirksField() {
        if(!this.size.sealed) return;
        return((this.quirks.sealed)?
            (html`
                <div class="col">
                    <span class="pre-wrap">quirks: </span>
                    <form id="quirks-input-form" class="col p-12 ecg">
                        ${ (function() {
                            let a = [];

                            for(let i = 0; i < this.quirks.value.length; i++) {
                                a.push(html`
                                    <div>
                                        <input type="checkbox" id="${ this.quirks.value[i] }" name="${ this.quirks.value[i] }" value="${ this.quirks.value[i] }" checked="true" disabled></input>
                                        <label for="${ this.quirks.value[i] }">${ this.quirks.value[i] }</label>
                                    </div>
                                `);
                            }

                            return(a);
                        }.bind(this))() }
                    </form>
                </div>
            `):
            (html`
                <div class="col">
                    <span class="pre-wrap">quirks: </span>
                    <form id="quirks-input-form"
                        class="col p-12 ecg"
                        @change=${ this.quirksChanged }>
                        ${ (function() {
                            let a = [];
                            
                            for(let i = 0; i < this.QUIRKS.length; i++) {
                                a.push(html`
                                    <div>
                                        <input type="checkbox" id="${ this.QUIRKS[i] }" name="${ this.QUIRKS[i] }" value="${ this.QUIRKS[i] }"></input>
                                        <label for="${ this.QUIRKS[i] }">${ this.QUIRKS[i] }</label>
                                    </div>
                                `);
                            }
                            
                            return(a);
                        }.bind(this))() }
                    </form>
                </div>
                <div class="col">
                    <span id="submission-hint"></span>
                    <div class="row">
                        <input type="button" value="NEXT" @click=${ this.quirksNext }></input>
                        <input type="button" value="BACK" @click=${ this.quirksBack }></input>
                    </div>
                </div>
            `)
        );
    }
    quirksChanged(e) {
        let form = this.renderRoot.querySelector(`#quirks-input-form`);

        //get array of quirks
        let quirks = Array.from(
            form.querySelectorAll('input[type="checkbox"]:checked'),
            function(tickedBox) {
                return(tickedBox.value);
            }
        );
        this.quirks.value = this.player.quirks = quirks;

        //enable / disable quirks
        if(this.quirks.value.length >= 4) {
            //limit reached, disable unchecked quirks
        }else {
            //make sure all quirks are selectable
        }

        //console.log(quirks);
    }
    quirksNext(e) {
        let form = this.renderRoot.querySelector(`#quirks-input-form`);
        let quirks = Array.from(
            form.querySelectorAll('input[type="checkbox"]:checked'),
            function(tickedBox) {
                return(tickedBox.value);
            }
        );

        this.quirks.value = this.player.quirks = quirks;
        this.quirks.sealed = true;

        this.requestUpdate();
        return;
    }
    quirksBack(e) {
        this.size.sealed = false;

        (async function() {
            await this.requestUpdate();

            this.renderRoot.querySelector(`#size-input-field`).focus();
        }.bind(this))();
    }

    getStatsField() {
        if(!this.quirks.sealed) return;
        return((this.stats.sealed)?
            (html`
                <div class="col">
                    <span class="pre-wrap">stats: </span>
                    <div class="col p-12">
                        <div id="roll-stats-container" class="row between">
                            <div class="col center">
                                <span>${ this.stats.value.charisma }</span>
                                <span>charisma</span>
                            </div>
                            <div class="col center">
                                <span>${ this.stats.value.strength }</span>
                                <span>strength</span>
                            </div>
                            <div class="col center">
                                <span>${ this.stats.value.intelligence }</span>
                                <span>intelligence</span>
                            </div>
                            <div class="col center">
                                <span>${ this.stats.value.luck }</span>
                                <span>luck</span>
                            </div>
                        </div>

                        <div class="row">
                            <input type="button" value="CREATE CHARACTER" @click=${ this.createCharacter }></input>
                            <input type="button" value="CANCEL" @click=${ this.statsUnseal }></input>
                        </div>
                    </div>
                </div>
            `):
            (html`
                <div class="col">
                    <span class="pre-wrap">stats: </span>
                    <div class="col p-12">
                        <div id="roll-stats-container" class="row between">
                            <div class="col center">
                                <span>${ this.stats.value.charisma }</span>
                                <span>charisma</span>
                            </div>
                            <div class="col center">
                                <span>${ this.stats.value.strength }</span>
                                <span>strength</span>
                            </div>
                            <div class="col center">
                                <span>${ this.stats.value.intelligence }</span>
                                <span>intelligence</span>
                            </div>
                            <div class="col center">
                                <span>${ this.stats.value.luck }</span>
                                <span>luck</span>
                            </div>
                        </div>

                        <div class="row">
                            <input type="button" value="ROLL" @click=${ this.statsChanged }></input>
                            <input type="button" value="DONE" @click=${ this.statsSeal }></input>
                            <input type="button" value="BACK" @click=${ this.statsBack }></input>
                        </div>
                    </div>
                </div>
            `)
        );
    }
    statsChanged(e) {
        this.rolls++;
        this.player.rolls++;

        //generate random stats values based on quirks
        this.stats.value = this.player.stats = {
            charisma: this.randInt(30, (100 - this.rolls)),
            strength: this.randInt(30, (100 - this.rolls)),
            intelligence: this.randInt(30, (100 - this.rolls)),
            luck: this.randInt(0, (4 - (this.rolls / 7)))
        }

        this.requestUpdate();
    }
    statsSeal(e) {
        //disable stats
        this.stats.sealed = true;

        this.requestUpdate();
    }
    statsUnseal(e) {
        this.stats.sealed = false;

        this.requestUpdate();
    }
    statsBack(e) {
        this.quirks.sealed = false;

        this.requestUpdate();
    }
    createCharacter() {
        (async function() {
            await CURRENT_SCENE_RENDERER_REFERENCE.get().endScene();




            this.player.creationTime = CURRENT_GAME_EPOCH.get();
            this.player.coins = 0;
            if(this.player.quirks.includes(`Rich Parents`)) this.player.coins += 12000;
            this.player.bank = 0;
            await CREATE_CHARACTER(this.player.getData());



            window.location.replace(`/title/`);
        }.bind(this))();
    }

    randInt(min, max) {
        return((((Math.random() * (max - min + 1)) + min) >> 0));
    }

    render() {
        return html`
        <div id="container" class="row between unselectable">

            <div class="col">
                <div class="row">
                    <span class="pre-wrap">DOB: ${ CURRENT_GAME_EPOCH.get() }</span>
                </div>

                ${ this.getNameField() }

                ${ this.getGenderField() }

                ${ this.getColorField() }

                ${ this.getSizeField() }

                ${ this.getQuirksField() }

                ${ this.getStatsField() }
            </div>

            <div></div>
        </div>
        `;
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        this._unsubscribe_CURRENT_GAME_EPOCH();
    }

}

customElements.define('character-configurator-element', CharacterConfiguratorElement);
