import { LitElement, html, css } from 'lit';
import { globalStyles } from '/public/globalStyles.js';

export class InventoryListItem extends LitElement {

    static properties = {
        itemImageUrl: { type: String },
        itemName: { type: String },
        inventoryIndex: { type: Number }
    };

    static styles = [
        globalStyles,
        css`
            :host {
                --border-size: 4px;
                --h: 210;
                --s: 70%;
                --l: 50%;
            }

            #container {
                width: 100%;
                height: 100%;
                padding: 3px;
                border: 1px solid pink;
                cursor: pointer;
            }

            #image-container {
                position: relative;
                aspect-ratio: 1/1;
                height: 32px;
            }
            #image-background {
                position: absolute;
                inset: 0px;
                z-index: 0;

                background-color: rgb(155, 155, 180);
                border-top: var(--border-size) solid hsl(var(--h) var(--s) calc(var(--l)) );
                border-left: var(--border-size) solid hsl(var(--h) var(--s) calc(var(--l) + 10%));
                border-right: var(--border-size) solid hsl(var(--h) var(--s) calc(var(--l) + 30%));
                border-bottom: var(--border-size) solid hsl(var(--h) var(--s) calc(var(--l) + 50%));
            }
            #image-midground {
                position: absolute;
                inset: 0px;
                z-index: 3;

                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
            }
            #image-foreground {
                position: absolute;
                inset: 0px;
                z-index: 7;
            }

            #item-name {
                font-size: 24px;
                margin-left: 3px;
            }
        `
    ];

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
    }

    addFurnitureToHouse() {
        console.log(`add item at inventory index ${ this.inventoryIndex } to house`);
        
    }

    render() {
        return html`
            <div id="container" class="row unselectable" @click=${ this.addFurnitureToHouse }>
                <div id="image-container">
                    <div id="image-background"></div>
                    <div id="image-midground" style="background-image: url(${ this.itemImageUrl })"></div>
                    <div id="image-foreground"></div>
                </div>

                <div id="item-name" class="col center">
                    <span>${ this.itemName }</span>
                </div>
            </div>
        `;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

}

customElements.define('inventory-list-item', InventoryListItem);
