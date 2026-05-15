import { LitElement, html, css } from 'lit';
import { CURRENT_SCROLL_POSITION } from '/public/store.js';

export class ScrollBarElement extends LitElement {

    static properties = {
        currentScrollPosition: { type: Number }
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
            background: #222;
            border-radius: 6px;
            cursor: pointer;
            overflow: hidden;
        }

        .thumb {
            position: absolute;
            width: 30px;
            height: 40px;
            background: #888;
            border-radius: 6px;
            cursor: grab;
            transition: background 0.2s;
        }

        .thumb:active {
            cursor: grabbing;
            background: #bbb;
        }
    `;

    static MIN = -15;
    static MAX = 25;

    constructor() {
        super();
        this.currentScrollPosition = CURRENT_SCROLL_POSITION.get();
        this.dragging = false;
        this.dragStartY = 0;
        this.dragStartPos = 0;
    }

    connectedCallback() {
        super.connectedCallback();

        this.currentScrollPosition = CURRENT_SCROLL_POSITION.get();
        this._unsubscribe_CURRENT_SCROLL_POSITION = CURRENT_SCROLL_POSITION.subscribe(function(value) {
            this.currentScrollPosition = value;
        }.bind(this));

        this._onMouseMove = this._handleMouseMove.bind(this);
        this._onMouseUp = this._handleMouseUp.bind(this);
        window.addEventListener('mousemove', this._onMouseMove);
        window.addEventListener('mouseup', this._onMouseUp);
    }

    disconnectedCallback() {
        this._unsubscribe_CURRENT_SCROLL_POSITION();
        window.removeEventListener('mousemove', this._onMouseMove);
        window.removeEventListener('mouseup', this._onMouseUp);
    }

    _getTrackHeight() {
        const track = this.shadowRoot?.querySelector('.track');
        return track ? track.getBoundingClientRect().height : 300;
    }

    _getThumbTop() {
        const { MIN, MAX } = ScrollBarElement;
        const trackHeight = this._getTrackHeight();
        const thumbHeight = 40;
        const travelHeight = trackHeight - thumbHeight;
        const ratio = (this.currentScrollPosition - MIN) / (MAX - MIN);
        return ratio * travelHeight;
    }

    _handleMouseDown(e) {
        e.preventDefault();
        this.dragging = true;
        this.dragStartY = e.clientY;
        this.dragStartPos = this.currentScrollPosition;
    }

    _handleMouseMove(e) {
        if (!this.dragging) return;

        const { MIN, MAX } = ScrollBarElement;
        const trackHeight = this._getTrackHeight();
        const thumbHeight = 40;
        const travelHeight = trackHeight - thumbHeight;

        const deltaY = e.clientY - this.dragStartY;
        const deltaPos = (deltaY / travelHeight) * (MAX - MIN);
        const newPos = Math.min(MAX, Math.max(MIN, this.dragStartPos + deltaPos));

        CURRENT_SCROLL_POSITION.set(newPos);
    }

    _handleMouseUp() {
        this.dragging = false;
    }

    _handleTrackClick(e) {
        if (e.target === this.shadowRoot.querySelector('.thumb')) return;

        const { MIN, MAX } = ScrollBarElement;
        const trackHeight = this._getTrackHeight();
        const thumbHeight = 40;
        const travelHeight = trackHeight - thumbHeight;

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
                @click=${ this._handleTrackClick }>
                <div class="thumb"
                    style="top:${ thumbTop }px;"
                    @mousedown=${ this._handleMouseDown }>
                </div>
            </div>
        `;
    }
}

customElements.define('scroll-bar-element', ScrollBarElement);
