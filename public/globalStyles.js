import { css } from 'lit';

export const globalStyles = css`
    @font-face {
        font-family: 'nintendo';
        src: url('/public/assets/fonts/warioB.ttf');
    }

    * {
        font-family: 'nintendo';
        outline: none;
        border: none;
        box-sizing: border-box;
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

    .around {
        justify-content: space-around !important;
    }

    .evenly {
        justify-content: space-evenly !important;
    }

    .end {
        justify-content: end !important;
    }

    .w-100 {
        width: 100%;
    }

    .h-100 {
        height: 100%;
    }

    .finger {
        cursor: pointer;
    }

    .m-12 {
        margin: 12px;
    }

    .p-12 {
        padding: 12px;
    }

    .unselectable {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .hidden {
        display: none;
    }
`;
