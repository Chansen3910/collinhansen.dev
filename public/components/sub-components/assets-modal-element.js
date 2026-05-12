import { LitElement, html, css } from 'lit';

export class AssetsModalElement extends LitElement {

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

                        <span>Assets</span>
                        
                        <div id="close-button" @click=${ this.close }>
                            <span>X</span>
                        </div>
                    </div>

                    <div class="col" style="padding: 21px;">
                        <span>Real estate</span>

                        <br />

                        <span>Vehicles</span>

                        <br />

                        <span>Businesses</span>
                    <div>
                </div>
            </div>
        `;
    }

    close() {
        this.remove();
    }

};

customElements.define('assets-modal-element', AssetsModalElement);
