import { LitElement, html, css } from 'lit';
import {
    CURRENT_SCENE_IS_ACTIVE,
    DIALOG_BOX_QUEUE,
    DIALOG_BOX_CURRENT_SCRIPT
} from '/public/store.js';

export class DialogElement extends LitElement {

    dialogBoxElement;
    dialogTextElement;

    currentScript;
    currentLine;
    lineCounter;
    charCounter;

    static styles = css`
        :host {
            position: relative;
            display: inline-block;
        }

        #dialog-box {
            height: fit-content;
            width: 600px;
            padding-left: 20px;
            padding-right: 20px;

            background-image: linear-gradient(
                to right, 
                rgba(255, 0, 0, 0.5),
                rgba(76, 0, 255, 0.5)
            );
            border-radius: 5px;
            
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        #text-box {
            font-family: 'nintendo';
            font-size: 37px;
            font-style:italic;
            color: rgba(255, 209, 7, 1);

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            animation: 0.1s shake infinite alternate;
        }

        @keyframes shake {
            0% {
                font-style: italic;
            }
            100% {
                font-style: normal;
            }
        }
        
        .hide {
            visibility: hidden;
        }
    `;

    constructor() {
        super();

        this.skip = this.skip.bind(this);
    }

    firstUpdated() {
        this.dialogTextElement = this.renderRoot.getElementById(`text-box`);
        this.dialogBoxElement = this.renderRoot.getElementById(`dialog-box`);
    }

    /*
        When a new script is received at the DIALOG_BOX_QUEUE and the
        DIALOG_BOX_CURRENT_SCRIPT is empty, shift it directly into the 
        DIALOG_BOX_CURRENT_SCRIPT and initiate processing.
    */
    checkQueueForNextScript() {
        if(
            DIALOG_BOX_CURRENT_SCRIPT.get() == null &&
            DIALOG_BOX_QUEUE.get().length > 0
        ) {

            let dbq = DIALOG_BOX_QUEUE.get();

            DIALOG_BOX_CURRENT_SCRIPT.set(dbq.shift());

            DIALOG_BOX_QUEUE.set(dbq);

            this.initiateNextScript();
        }
    }

    initiateNextScript() {
        //set active to false to block controls, etc.
        CURRENT_SCENE_IS_ACTIVE.set(false);

        //Show the dialog box
        this.shadowRoot.querySelector('#dialog-box').classList.toggle(`hide`);

        //start at line 0 and walk up the array
        this.lineCounter = 0;
        this.charCounter = 0;
        this.currentLine = DIALOG_BOX_CURRENT_SCRIPT.get()[this.lineCounter];

        this.loadNextLine();
        window.parent.addEventListener(`keydown`, this.skip);
    }

    loadNextLine() {
        this.dialogTextElement = this.shadowRoot.querySelector(`#text-box`);

        if(this.lineCounter >= DIALOG_BOX_CURRENT_SCRIPT.get().length) {
            this.dialogTextElement.innerHTML = ``;
            this.dialogBoxElement.classList.toggle(`hide`);
            CURRENT_SCENE_IS_ACTIVE.set(true);
            window.parent.removeEventListener(`keydown`, this.skip);
            DIALOG_BOX_CURRENT_SCRIPT.set(null);
            this.checkQueueForNextScript();
        }else {
            //feed the line to the dialogTextElement and wait for enter
            this.currentInterval = setInterval(function() {
                if(this.charCounter >= this.currentLine.length) {
                    clearInterval(this.currentInterval);
                }else {
                    this.dialogTextElement.innerHTML += this.currentLine.charAt(this.charCounter++);
                }
            }.bind(this), 50);
        }
    }

    skip(e) {
        if(e.keyCode == 32 || e.keyCode == 13) {
            if(this.charCounter < this.currentLine.length) {
                //if the counter hasnt typed out the current line, type all immediately.
                this.charCounter = this.currentLine.length;
                this.dialogTextElement.innerHTML = this.currentLine;
            }else {
                //if current line has been typed, roll the next line
                this.dialogTextElement.innerHTML = "";
                this.charCounter = 0;
                this.lineCounter++;
                this.currentLine = DIALOG_BOX_CURRENT_SCRIPT.get()[this.lineCounter];
                this.loadNextLine();
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();

        this._unsubscribe_DIALOG_BOX_QUEUE = DIALOG_BOX_QUEUE.subscribe(function(value) {
            if(value.length <= 0 || !value) return;

            this.checkQueueForNextScript(value);
        }.bind(this));
    }

    render() {
        return html`
        <div id="dialog-box" class="hide">
            <div>
                <span id="text-box"></span>
            </div>
        </div>
        `;
    }

    disconnectedCallback() {
        this._unsubscribe_DIALOG_BOX_QUEUE();
    }

}

customElements.define('dialog-element', DialogElement);
