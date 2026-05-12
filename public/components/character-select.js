import { LitElement, html, css } from 'lit';
import { globalStyles } from '/public/globalStyles.js';
import {
    CHARACTER_SLOTS_DATA,
    CURRENT_OPPORTUNITY_TITLE,
    CURRENT_OPPORTUNITY_SELECTIONS
} from '/public/store.js';

export class CharacterSelect extends LitElement {

    static properties = {
        slots: { type: Object },
        title: { type: Object },
        selections: { type: Array }
    };

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
        this.title = CURRENT_OPPORTUNITY_TITLE.get();
        this.selections = CURRENT_OPPORTUNITY_SELECTIONS.get();
    }

    connectedCallback() {
        super.connectedCallback();

        this.unsubscribe_slots = CHARACTER_SLOTS_DATA.subscribe(function(value) {
            this.slots = value;
        }.bind(this));

        this.unsubscribe_title = CURRENT_OPPORTUNITY_TITLE.subscribe(function(value) {
            this.title = value;
        }.bind(this));

        this.unsubscribe_selections = CURRENT_OPPORTUNITY_SELECTIONS.subscribe(function(value) {
            this.selections = value;
        }.bind(this));
    }

    render() {
        return html`
        <div id="container" class="col center between unselectable">
            <h2>Character select</h2>

            <div class="col center">
                <h3>
                name: ${ this.title.name }<br>
                location: ${ this.title.currentScene }<br>
                net worth: ${ this.title.netWorth }
                </h3>
                ${
                    (function() {
                        let a = [];

                        for(let i = 0; i < this.selections.length; i++) {
                            a.push(html`
                                <span @click=${ this.selections[i].callback }>${ this.selections[i].name }</span>
                            `);
                        }

                        return(a);
                    }.bind(this))()
                }
            </div>
        </div>
        `;
    }

    disconnectedCallback() {
        this.unsubscribe_slots();
        this.unsubscribe_title();
        this.unsubscribe_selections();
    }
}

customElements.define('character-select', CharacterSelect);
