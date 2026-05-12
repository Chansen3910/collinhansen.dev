import { LitElement, html, css } from 'lit';
import { PLAYER_CASH } from '../../store.js';

class CashElement extends LitElement {

    static styles = css`
        :host {
            display: inline-block;
            width: 100px;
            height: fit-content;
            box-sizing: border-box;
        }
        #pie {
            transform: scaleX(-1);
            box-sizing: border-box;
            border: 3px solid rgba(0, 0, 0, 1.0);
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    `;

    constructor() {
        super();
        this.playerCash = PLAYER_CASH.get();
    }

    connectedCallback() {
        super.connectedCallback();

        this._unsubscribe_PLAYER_CASH = PLAYER_CASH.subscribe(function(value) {
            this.playerCash = value;
        }.bind(this));
    }

    render() {
        return html`
            <span>$${ this.playerCash }</span>
        `;
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        this._unsubscribe_PLAYER_CASH();
    }
}

customElements.define('cash-element', CashElement);
