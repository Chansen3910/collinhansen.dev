import { LitElement, html, css } from 'lit';
import { globalStyles } from '/public/globalStyles.js';
import { OpportunityCamera } from '/public/Cameras';
import {
    CURRENT_OPPORTUNITY_TITLE,
    CURRENT_OPPORTUNITY_SELECTIONS
} from '/public/store.js';

export class LowEndApartmentMediumElement extends LitElement {

    title;
    selections;

    static styles = [
        globalStyles,
        css`
            #container {
                width: 100%;
                height: 100%;
                padding: 2.0em;
            }
            .title {
                font-size: 28px;
            }
            .selection {
                font-size: 21px;
                width: fit-content;
                margin-left: 12px;
            }
            .selection:hover {
                margin-left: 7px;
                cursor: pointer;
                background-color: rgba(255, 255, 255, 0.4);
            }
        `
    ];

    titleUpdated(value) {
        this.title = value;
        this.requestUpdate();
    }

    selectionsUpdated(value) {
        this.selections = value;
        this.requestUpdate();
    }

    constructor() {
        super();

        this.title = CURRENT_OPPORTUNITY_TITLE.get() || `loading...`;
        this.selections = CURRENT_OPPORTUNITY_SELECTIONS.get() || `loading...`;

        this.unsubscribe_CURRENT_OPPORTUNITY_TITLE = CURRENT_OPPORTUNITY_TITLE.subscribe(this.titleUpdated.bind(this));
        this.unsubscribe_CURRENT_OPPORTUNITY_SELECTIONS = CURRENT_OPPORTUNITY_SELECTIONS.subscribe(this.selectionsUpdated.bind(this));

        this.requestUpdate();
    }

    connectedCallback() {
        super.connectedCallback();
    }

    getCurrentSelection() {
        return(html`
            <div class="col">
                <span class="title">${ this.title }</span>

                ${
                    (function() {
                        if(!this.selections) return;

                        let a = [];

                        for(let i = 0; i < this.selections.length; i++) {
                            a.push(html`
                                <span class="selection" @click=${ function() { this.selections[i].callback(this) } }>${ this.selections[i].name }</span>
                            `);
                        }

                        return(a);
                    }.bind(this))()
                }
            </div>
        `);
    }

    render() {
        return html`
            <div id="container" class="col between unselectable">
                <div id="top" class="row between">
                    <span></span>

                    <!--
                    <div class="col center">
                        <span>chunky monkfruit mango kale</span>
                        <span>live / edit</span>
                        <span>add item</span>
                        <span>remove item</span>
                    </div>
                    -->
                </div>

                <div id="mid" class="row center between"></div>

                <div id="bottom" class="row center between">
                    ${ this.getCurrentSelection() }
                </div>
            </div>
        `;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe_CURRENT_OPPORTUNITY_TITLE();
        this.unsubscribe_CURRENT_OPPORTUNITY_SELECTIONS();
    }

}

customElements.define('low-end-apartment-medium-element', LowEndApartmentMediumElement);
