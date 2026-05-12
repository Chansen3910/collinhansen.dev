import { LitElement, html, css } from 'lit';

export class MenubarElement extends LitElement {

        static styles = css`
        :host {
            position: relative;
            display: inline-block;
        }

        #menubar-container {
            background-color: rgba(15, 15, 60, 1.0);
            border-radius: 7px;
            padding: 7px;
        }

        #menubar-heading {
            margin-bottom: 7px;
            font-size: 35px;
        }

        #menubar-buttons > * {
            background-color: rgba(30, 30, 120, 1.0);
            padding: 7px;
            margin-bottom: 1px;
            font-size: 30px;
            font-style: italic;
            cursor: pointer;
        }
        #menubar-buttons > *:hover {
            background-color: rgba(60, 60, 240, 1.0);
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
            justify-content: center;
            align-items: center;
        }

        .between {
            justify-content: space-between !important;
        }

        .close-button {
            aspect-ratio: 1/1;
            width: 35px;

            display: flex;
            flex-direction: col;
            align-items: center;
            justify-content: center;
            
            background-color: red;
            border-radius: 3px;
            cursor: pointer;
        }
        .close-button {
            display: flex;
            flex-direction: col;
            align-items: center;
            justify-content: center;
        }
        
        .finger {
            cursor: pointer;
        }
    `;

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
    }

    statusClicked(e) {
        let element = document.createElement(`status-modal-element`);
        document.body.appendChild(element);
        console.log(`status clicked`);
    }

    outfitClicked(e) {
        let element = document.createElement(`outfit-modal-element`);
        document.body.appendChild(element);
        console.log(`outfit clicked`);
    }

    itemsClicked(e) {
        let element = document.createElement(`items-modal-element`);
        document.body.appendChild(element);
        console.log(`items clicked`);
    }

    journalClicked(e) {
        let element = document.createElement(`journal-modal-element`);
        document.body.appendChild(element);
        console.log(`journal clicked`);
    }

    assetsClicked(e) {
        let element = document.createElement(`assets-modal-element`);
        document.body.appendChild(element);
        console.log(`assets clicked`);
    }

    settingsClicked(e) {
        let element = document.createElement(`settings-modal-element`);
        document.body.appendChild(element);
        console.log(`settings clicked`);
    }

    saveClicked(e) {
        let element = document.createElement(`save-modal-element`);
        document.body.appendChild(element);
        console.log(`save clicked`);
    }

    exitClicked(e) {
        let element = document.createElement(`exit-modal-element`);
        document.body.appendChild(element);
        console.log(`exit clicked`);
    }

    closeClicked() {
        console.log(`close clicked`);
        this.remove();
    }

    render() {
        return html`
        <div id="menubar-container" class="col">
            <div id="menubar-heading" class="w-100 row center between">
                <span>Menu</span>

                <div class="close-button" @click=${ this.closeClicked }>
                    <span>&#215;</span>
                </div>
            </div>
            <div id="menubar-buttons">
                <div id="status-button" @click=${ this.statusClicked }>
                    <span>status</span>
                </div>
                <div id="outfit-button" @click=${ this.outfitClicked }>
                    <span>outfit</span>
                </div>
                <div id="items-button" @click=${ this.itemsClicked }>
                    <span>items</span>
                </div>
                <div id="journal-button" @click=${ this.journalClicked }>
                    <span>journal</span>
                </div>
                <div id="assets-button" @click=${ this.assetsClicked }>
                    <span>assets</span>
                </div>
                <div id="settings-button" @click=${ this.settingsClicked }>
                    <span>settings</span>
                </div>
                <div id="save-button" @click=${ this.saveClicked }>
                    <span>save</span>
                </div>
                <div id="exit-button" @click=${ this.exitClicked }>
                    <span>exit</span>
                </div>
            </div>
        </div>
        `;
    }

    disconnectedCallback() {
        //
    }

}

customElements.define('menubar-element', MenubarElement);
