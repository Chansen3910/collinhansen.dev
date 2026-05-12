import { LitElement, html, css } from 'lit';

let CHARACTER_AGE = 129;
let CHARACTER_NET_WORTH = 942074;
let CHARACTER_CURRENT_TITLE = `Bluecorp Espionage Agent`;
let CHARACTER_CURRENT_RESIDENCE = `Bluecorp Corporate Lodge - Luxury Suite`;

let CHARACTER_COOKING_LEVEL = 0;
let CHARACTER_BUSINESS_ADMINISTRATION_LEVEL = 0;
let CHARACTER_COMPUTER_PROGRAMMING_LEVEL = 0;
let CHARACTER_FIGHTING_LEVEL = 0;
let CHARACTER_MECHANICAL_LEVEL = 0;
let CHARACTER_METAL_FABRICATION_LEVEL = 0;
let CHARACTER_PSYCHIC_LEVEL = 0;
let CHARACTER_DRIVING_LEVEL = 0;

export class StatusModalElement extends LitElement {

    static styles = css`
        :host {
            
        }
        .w-100 {
            width: 100%;
        }
        .h-100 {
            height: 100%;
        }
        .col {
            display: flex;
            flex-direction: column;
        }
        .row {
            display: flex;
            flex-direction: row;
        }
        .center {
            align-items: center;
            justify-content: center;
        }
        .between {
            justify-content: space-between !important;
        }
        .start {
            justify-content: flex-start;
        }
        .end {
            justify-content: flex-end;
        }
        #background-ctr {
            position: absolute;
            z-index: 1000;
            top: 0px;
            left: 0px;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        #modal-ctr {
            height: 500px;
            width: 500px;
            background-color: rgba(255, 180, 120, 1.0);
            color: rgba(70, 0, 0, 1.0);
            border-radius: 7px;
            overflow: hidden;
        }
        #close-button {
            background-color: rgba(255, 0, 0, 1.0);
            color: rgba(255, 255, 255, 1.0);
            cursor: pointer;
            padding: 12px;
        }
    `;

    constructor() {
        super();
    }

    render() {
        return html`
            <div id="background-ctr">
                <div id="modal-ctr">
                    <div class="row center between">
                        <span></span>

                        <span>Status</span>
                        
                        <div id="close-button" @click=${ this.close }>
                            <span>X</span>
                        </div>
                    </div>

                    <div class="col" style="padding: 21px;">
                        <span>${ CHARACTER_AGE } days old</span>
                        <span>Net Worth: $${ CHARACTER_NET_WORTH }</span>
                        <span>Title: ${ CHARACTER_CURRENT_TITLE }</span>
                        <span>Residence: ${ CHARACTER_CURRENT_RESIDENCE }</span>

                        <br />

                        <span>Intelligence: 100</span>
                        <span>Charisma: 100</span>
                        <span>Strength: 100</span>
                        <span>Karma: 100</span>

                        <br />

                        <span>Fighting level: ${ CHARACTER_FIGHTING_LEVEL }</span>
                        <span>Psychic level: ${ CHARACTER_PSYCHIC_LEVEL }</span>
                        <span>Oration level: ${ CHARACTER_COMPUTER_PROGRAMMING_LEVEL }</span>
                        <span>Cooking level: ${ CHARACTER_COOKING_LEVEL }</span>
                        <span>Hacking level: ${ CHARACTER_COMPUTER_PROGRAMMING_LEVEL }</span>
                        <span>Mechanical level: ${ CHARACTER_MECHANICAL_LEVEL }</span>
                        <span>Driving level: ${ CHARACTER_DRIVING_LEVEL }</span>
                    <div>
                </div>
            </div>
        `;
    }

    close() {
        this.remove();
    }

};

customElements.define('status-modal-element', StatusModalElement);
