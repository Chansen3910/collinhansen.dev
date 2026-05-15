import { LitElement, html, css } from 'lit';
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { CURRENT_SCENE_IS_ACTIVE } from "/public/store.js";

export class NotificationToast extends LitElement {

    static get properties() {
        return {
            title: { type: String, attribute: "box-title" },
            message: { type: String, attribute: "box-message" },
            buttonValue: { type: String, attribute: "button-value" }
        };
    }

    static styles = css`
        :host {
            display: block;
        }
    `;

    createRenderRoot() {
        return(this);
    }

    constructor() {
        super();
        this.title = "";
        this.message = "";
        this.buttonValue = "";
    }

    connectedCallback() {
        super.connectedCallback();
        CURRENT_SCENE_IS_ACTIVE.set(false);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        CURRENT_SCENE_IS_ACTIVE.set(true);
    }

    handleClick(e) {
        e.stopPropagation();
        this.remove();
    }

    render() {
        return html`
            <div style="position:absolute; top:0px; left:0px; z-index:99999;">
                <div style="width:100vw; height:100vh; cursor:default; backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); background-color:rgba(0, 0, 0, 0.3);" class="col center unselectable">
                    <div style="width:fit-content; padding-left:20px; padding-right:20px; border-radius:12px; background-color:rgba(12, 12, 36, 0.7)"
                        class="col center between">
                        <h2 style="margin:12px;">${ this.title }</h2>
                        
                        <p style="font-style:italic; width:300px; overflow-wrap:break-word; text-align:center;">
                            ${ unsafeHTML(this.message) }
                        <p>

                        <input type="button"
                            style="padding:3px 7px 3px 7px; margin:20px; min-width:70px; text-align:center; font-weight:bold;"
                            class="col center finger"
                            value="${ this.buttonValue }"
                            @click="${{ handleEvent: this.handleClick.bind(this) }}" />
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('notification-toast', NotificationToast);
