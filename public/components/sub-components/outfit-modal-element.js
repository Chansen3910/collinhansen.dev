import { LitElement, html, css } from 'lit';

export class OutfitModalElement extends LitElement {

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

        #outfit-slot-container {
            width: 280px;
            display: flex;
            flex-wrap: wrap;
        }
        .outfit-slot {
            aspect-ratio: 1/1;
            width: 70px;
            background-color: rgb(120, 120, 180);
            border: 1px solid black;
            box-sizing: border-box;
        }

        .outfit-effect {
            background-color: rgb(120, 120, 180);
            width: 280px;
            height: 50px;
        }

        #content-container {
            padding: 9px;
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
                        <span>Outfit</span>
                        <div id="close-button" @click=${ this.close }>
                            <span>X</span>
                        </div>
                    </div>

                    <div id="content-container">
                        <div class="w-100 col center">
                            <div id="outfit-slot-container">
                                <div class="outfit-slot col center">
                                    <span>primary</span>
                                </div>
                                <div class="outfit-slot col center">
                                    <span>secondary</span>
                                </div>
                                <div class="outfit-slot col center">
                                    <span>aux 1</span>
                                </div>
                                <div class="outfit-slot col center">
                                    <span>aux 2</span>
                                </div>
                                <div class="outfit-slot col center">
                                    <span>head</span>
                                </div>
                                <div class="outfit-slot col center">
                                    <span>neck</span>
                                </div>
                                <div class="outfit-slot col center">
                                    <span>keys</span>
                                </div>
                                <div class="outfit-slot col center">
                                    <span>business card</span>
                                </div>
                                <div class="outfit-slot col center">
                                    <span>body</span>
                                </div>
                                <div class="outfit-slot col center">
                                    <span>hands</span>
                                </div>
                                <div class="outfit-slot col center">
                                    <span>L watch / ring</span>
                                </div>
                                <div class="outfit-slot col center">
                                    <span>R watch / ring</span>
                                </div>
                                <div class="outfit-slot col center">
                                    <span>back</span>
                                </div>
                                <div class="outfit-slot col center">
                                    <span>waist</span>
                                </div>
                                <div class="outfit-slot col center">
                                    <span>legs</span>
                                </div>
                                <div class="outfit-slot col center">
                                    <span>feet</span>
                                </div>
                            <div>
                        </div>

                        <div class="w-100 col center">
                            <span>outfit effects</span>
                            <div id="outfit-effects-container" class="col">
                                <div class="outfit-effect">
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;
    }

    close() {
        this.remove();
    }

};

customElements.define('outfit-modal-element', OutfitModalElement);
