import { LitElement, html, css } from 'lit';

export class hudElement extends LitElement {

    static styles = css`
        * {
            box-sizing: border-box;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            -o-user-select: none;
            user-select: none;
        }
        :host {
            display: block;
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
        #container {
            width: 100vw;
            height: 100vh;
            padding: 7px;
        }

        button {
            margin-left: .5rem;
        }

        #menu-button {
            border-radius: 3px;
            padding: 3px;
            background-color: rgb(10, 10, 80);
        }
        .finger {
            cursor: pointer;
        }
    `;

    constructor() {
        super();
    }

    menuClicked() {
        let e = this.renderRoot.querySelector(`#mid-center`);
        e.appendChild(document.createElement(`menubar-element`));
    }

    render() {
        return html`
        <div id="container" class="col between">

            <div class="w-100 row between">
                <div id="top-left" class="col">
                    <health-meter-element></health-meter-element>
                </div>

                <div id="top-center">
                </div>

                <div id="top-right" class="col">
                    <span>location name</span>
                    <span>minimap</span>
                </div>
            </div>

            <div class="w-100 row between">
                <div id="mid-left">
                </div>

                <div id="mid-center">
                </div>

                <div id="mid-right">
                </div>
            </div>

            <div class="w-100 row between">
                <div id="bottom-left" class="col end">
                    <clock-element></clock-element>
                    <cash-element></cash-element>
                    <dialog-element></dialog-element>
                </div>

                <div id="bottom-center">
                </div>

                <div id="bottom-right" class="col end">

                    <div id="menu-button" class="col center finger" @click=${ this.menuClicked }>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>

                </div>
            </div>

        </div>
        `;
    }

}

customElements.define('hud-element', hudElement);
