import { LitElement, html, css } from 'lit';
import { CURRENT_SCROLL_POSITION } from '/public/store.js';

export class ScrollBarElement extends LitElement {

    static properties = {
        currentScrollPosition: { type: Number },
        trackHeight: { type: Number }
    };

    static styles = css`
        :host {
            display: block;
            width: fit-content;
            height: 100%;
        }

        .track {
            position: relative;
            width: 30px;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 6px;
            cursor: pointer;
            overflow: hidden;
            touch-action: none; 
        }

        .thumb {
            position: absolute;
            width: 30px;
            height: 40px;
            background: rgba(200, 200, 200, 1.0);
            border-radius: 6px;
            cursor: grab;
            transition: background 0.2s;
            touch-action: none; 
        }

        .thumb:active {
            cursor: grabbing;
            background: rgba(240, 240, 240, 1.0);
        }
    `;

    static MIN = -15;
    static MAX = 25;

    constructor() {
        super();
        this.currentScrollPosition = CURRENT_SCROLL_POSITION.get();
        this.trackHeight = 300;
        this.dragging = false;
        this.dragStartY = 0;
        this.dragStartPos = 0;
        this._handlePointerMove = this._handlePointerMove.bind(this);
        this._handlePointerUp = this._handlePointerUp.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();

        this.currentScrollPosition = CURRENT_SCROLL_POSITION.get();
        this._unsubscribe_CURRENT_SCROLL_POSITION = CURRENT_SCROLL_POSITION.subscribe(function(value) {
            this.currentScrollPosition = value;
        }.bind(this));
    }

    firstUpdated() {
        const track = this.shadowRoot?.querySelector('.track');
        if(track) {
            this.trackHeight = track.getBoundingClientRect().height;
        }
    }

    disconnectedCallback() {
        this._unsubscribe_CURRENT_SCROLL_POSITION();
        window.removeEventListener('pointermove', this._handlePointerMove);
        window.removeEventListener('pointerup', this._handlePointerUp);
    }

    _getThumbTop() {
        const { MIN, MAX } = ScrollBarElement;
        const thumbHeight = 40;
        const travelHeight = this.trackHeight - thumbHeight;
        const ratio = (this.currentScrollPosition - MIN) / (MAX - MIN);
        return ratio * travelHeight;
    }

    _handleThumbPointerDown(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.setPointerCapture(e.pointerId);

        this.dragging = true;
        this.dragStartY = e.clientY;
        this.dragStartPos = this.currentScrollPosition;

        window.addEventListener('pointermove', this._handlePointerMove);
        window.addEventListener('pointerup', this._handlePointerUp);
    }

    _handlePointerMove(e) {
        e.stopPropagation();
        if(!this.dragging) return;

        const { MIN, MAX } = ScrollBarElement;
        const thumbHeight = 40;
        const travelHeight = this.trackHeight - thumbHeight;

        const deltaY = e.clientY - this.dragStartY;
        const deltaPos = (deltaY / travelHeight) * (MAX - MIN);
        const newPos = Math.min(MAX, Math.max(MIN, this.dragStartPos + deltaPos));

        CURRENT_SCROLL_POSITION.set(newPos);
    }

    _handlePointerUp(e) {
        e.stopPropagation();
        if(!this.dragging) return;

        this.dragging = false;
        window.removeEventListener('pointermove', this._handlePointerMove);
        window.removeEventListener('pointerup', this._handlePointerUp);
    }

    _handleTrackClick(e) {
        e.stopPropagation();
        if(e.target === this.shadowRoot.querySelector('.thumb')) return;

        const { MIN, MAX } = ScrollBarElement;
        const thumbHeight = 40;
        const travelHeight = this.trackHeight - thumbHeight;

        const trackRect = e.currentTarget.getBoundingClientRect();
        const clickY = e.clientY - trackRect.top - (thumbHeight / 2);
        const ratio = Math.min(1, Math.max(0, clickY / travelHeight));
        const newPos = Math.round(MIN + ratio * (MAX - MIN));

        CURRENT_SCROLL_POSITION.set(newPos);
    }

    render() {
        const thumbTop = this._getThumbTop();

        return html`
            <div class="track"
                @pointerdown=${ this._handleTrackClick }>
                <div class="thumb"
                    style="top:${ thumbTop }px;"
                    @pointerdown=${ this._handleThumbPointerDown }>
                </div>
            </div>
        `;
    }
}

customElements.define('scroll-bar-element', ScrollBarElement);
