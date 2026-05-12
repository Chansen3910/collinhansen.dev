import { LitElement, html, css } from 'lit';
import { CURRENT_GAME_EPOCH } from '/public/store.js';

class ClockElement extends LitElement {

    static properties = {
        currentGameEpoch: { type: Number },
        gameMinutes: { type: Number },
        gameHours: { type: Number },
        gameDays: { type: Number },
        gameMonths: { type: Number },
        gameYears: { type: Number }
    };

    static styles = css`
        #clock {
            font-size: 34px;
        }
    `;

    constructor() {
        super();
        this.currentGameEpoch = CURRENT_GAME_EPOCH.get();
    }

    connectedCallback() {
        super.connectedCallback();

        this._unsubscribe_CURRENT_DAY_HOURS_LEFT = CURRENT_GAME_EPOCH.subscribe(function(value) {
            this.currentGameEpoch = value;
            this.gameMinutes = this.currentGameEpoch;
            this.gameHours = (this.gameMinutes / 60) >> 0;
            this.gameDays = (this.gameHours / 24) >> 0;
            this.gameMonths = (this.gameMonths / 30) >> 0;
            this.gameYears = (this.gameMonths / 12) >> 0;
        }.bind(this));
    }

    render() {
        return html`
            <span id="clock">${ String(((this.gameHours % 12) == 0)? (12): (this.gameHours % 12)).padStart(2, '0') }:${ String(this.gameMinutes % 60).padStart(2, '0') }${ (((this.gameHours % 24) < 12)? (`AM`): (`PM`)) }</span>
        `;
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        this._unsubscribe_CURRENT_DAY_HOURS_LEFT();
    }
}

customElements.define('clock-element', ClockElement);
