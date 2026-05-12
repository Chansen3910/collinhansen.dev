import { LitElement, html, css } from 'lit';
import { globalStyles } from '/public/globalStyles.js';
import { getDefinition } from '/public/Item.js';
import { InventoryListItem } from '/public/components/sub-components/inventory-list-item.js';
import {
    CURRENT_SCENE_PLAYER_REFERENCE,
    CURRENT_SCENE_INVENTORY_REFERENCE,
    CURRENT_SCENE_IS_ACTIVE
} from '/public/store.js';

export class AddFurnitureInventorySelectElement extends LitElement {
    static styles = [
        globalStyles,
        css`
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
                background-color: rgb(255, 180, 120, 1.0);
                color: rgba(70, 0, 0, 1.0);
                border-radius: 7px;
                overflow: hidden;
            }
            #top-row {
                height: fit-content;
            }

            #title-text {
                text-align: center;
                margin: 0;
                font-size: 1.5rem;
            }

            #close-button {
                margin: 3px;
                padding: 3px;
                
                color: rgb(255, 255, 255);
                background-color: red;
                
                border-radius: 3px;

                cursor: pointer;
            }
        `
    ];

    constructor() {
        super();

        (async function() {
            let list = CURRENT_SCENE_INVENTORY_REFERENCE.get();

            this.inventory = [];

            for(let i = 0; i < list.length; i++) {
                let item = await getDefinition(list[i]);
                item.inventoryIndex = i;
                this.inventory.push(item);
            }

            this.requestUpdate();
        }.bind(this))();
    }

    connectedCallback() {
        CURRENT_SCENE_IS_ACTIVE.set(false);
        super.connectedCallback();
    }

    close() {
        this.remove();
    }

    /*
    list all furniture items in user inventory
    each has click function to remove from inventory and add to active select
    also add the close / cancel button
    actively selected furniture options
    place, rotate, cancel
    once you place it you are in rearrange mode too
    */
    render() {
        return html`
            <div id="background-ctr" class="col center">

                <div id="modal-ctr" class="col">
                    <div id="top-row" class="row center between">
                        <span></span>

                        <span id="title-text">Select from inventory</span>

                        <div id="close-button" @click=${ this.close }>&#x274C;</div>
                    </div>

                    <div class="col">
                        ${
                            (function() {
                                let a = [];

                                for(let i = 0; i < this.inventory.length; i++) {
                                    a.push(html`
                                        <inventory-list-item
                                            itemImageUrl="${ this.inventory[i].imageUrl }"
                                            itemName="${ this.inventory[i].name }"
                                            inventoryIndex="${ this.inventory[i].inventoryIndex }">
                                        </inventory-list-item>
                                    `);
                                }

                                return(a);
                            }.bind(this))()
                        }
                    </div>
                </div>

            </div>
        `;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        CURRENT_SCENE_IS_ACTIVE.set(true);
    }

}

customElements.define('add-furniture-inventory-select-element', AddFurnitureInventorySelectElement);
