import { LitElement, html, css } from 'lit';

export class MainMenuElement extends LitElement {

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

    render() {
        return html`
        <div id="container" class="col between">

            

        </div>
        `;
    }

}

customElements.define('main-menu-element', MainMenuElement);
