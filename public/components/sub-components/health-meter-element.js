import { LitElement, html, css } from 'lit';
import {
    PLAYER_HEALTH,
    PLAYER_HEALTH_MAX
} from '../../store.js';

export class HealthmeterElement extends LitElement {

    static properties = {
        playerHealth: { type: Number },
        max: { type: Number },
        color: { type: String }
    };

    static styles = css`
        :host {
            position: relative;
            display: inline-block;

            width: 150px;
            height: 20px;

            background-color: rgb(30, 30, 30);

            border-radius: 2px;

            overflow: hidden;
        }
        .bar {
            position: absolute;
            z-index: 7;

            height: 100%;
            width: 100%;

            transform-origin: left;
            transition: transform .2s;
        }
        #label-text {
            position: absolute;
            z-index: 11;

            inset: 0;
            margin: auto;

            height: fit-content;
            width: fit-content;

            font-size: 15px;
        }
    `;

    constructor() {
        super();

        this.playerHealth = PLAYER_HEALTH.get();
        this.playerHealthMax = PLAYER_HEALTH_MAX.get();
        this.color = `rgb(200, 0, 0)`;
    }

    connectedCallback() {
        super.connectedCallback();

        this._unsubscribe_PLAYER_HEALTH = PLAYER_HEALTH.subscribe(function(value) {
            this.playerHealth = value;
        }.bind(this));
        
        this._unsubscribe_PLAYER_HEALTH_MAX = PLAYER_HEALTH_MAX.subscribe(function(value) {
            this.playerHealthMax = value;
        }.bind(this));
    }

    render() {
        const pct = Math.min(100, Math.max(0, (this.playerHealth / this.playerHealthMax) * 100));
        return html`
        <div class="bar" style="background-color: ${ this.color };transform: scaleX(${pct / 100})"></div>
        <span id="label-text">${ this.playerHealth } / ${ this.playerHealthMax }</span>
        `;
    }

    disconnectedCallback() {
        this._unsubscribe_PLAYER_HEALTH();
        this._unsubscribe_PLAYER_HEALTH_MAX();
    }

}

customElements.define('health-meter-element', HealthmeterElement);
