export default class Transitioner {
    
    filter;

    constructor(filterElement) {
        this.filter = filterElement;
        this.circleOut = this.circleOut.bind(this);
        this.circleIn = this.circleIn.bind(this);
        this.fadeOut = this.fadeOut.bind(this);
        this.fadeIn = this.fadeIn.bind(this);
        this.radialFadeOut = this.radialFadeOut.bind(this);
        this.radialFadeIn = this.radialFadeIn.bind(this);
    }

    circleOut() {
        var that = this;
        return new Promise((resolve) => {
            let i = 106;
            that.filter.style.backgroundColor = `rgba(0, 0, 0, 0.0)`;
            let play = setInterval(function() {
                i--;
                that.filter.style.backgroundImage = `-webkit-radial-gradient(center, rgba(0, 0, 0, 0.0) ${ i - 6 }%, rgba(0, 0, 0, 1.0) ${ i }%)`;
                if(i < 0) {
                    clearInterval(play);
                    resolve("circleIn() complete");
                }
            }, 20);
        });
    }
    
    circleIn() {
        var that = this;
        return new Promise((resolve) => {
            that.filter.style.backgroundColor = `rgba(0, 0, 0, 0.0)`;
            let i = 0;
            let play = setInterval(function() {
                i++;
                that.filter.style.backgroundImage = `-webkit-radial-gradient(center, rgba(0, 0, 0, 0.0) ${ i - 6 }%, rgba(0, 0, 0, 1.0) ${ i }%)`;
                if(i > 106) {
                    clearInterval(play);
                    resolve("circleOut() complete");
                }
            }, 20);
        });
    }
    
    fadeOut() {
        var that = this;
        return new Promise((resolve) => {
            that.filter.style.backgroundImage = ``;
            that.filter.style.backgroundColor = `rgba(0, 0, 0, 0.0)`;
            let i = 0.0;
            let play = setInterval(function() {
                i += 0.02;
                if(i >= 1) {
                    i = 1;
                    clearInterval(play);
                    that.filter.style.backgroundColor = `rgba(0, 0, 0, 1.0)`;
                    resolve("fadeIn() complete");
                }
                that.filter.style.backgroundColor = `rgba(0, 0, 0, ${ i })`;
            }, 20);
        });
    }
    
    fadeIn() {
        var that = this;
        return new Promise((resolve) => {
            that.filter.style.backgroundImage = ``;
            that.filter.style.backgroundColor = `rgba(0, 0, 0, 1.0)`;
            let i = 1.0;
            let play = setInterval(function() {
                i -= 0.02;
                if(i <= 0) {
                    i = 0;
                    clearInterval(play);
                    that.filter.style.backgroundColor = `rgba(0, 0, 0, 0.0)`;
                    resolve("fadeOut() complete");
                }
                that.filter.style.backgroundColor = `rgba(0, 0, 0, ${ i })`;
            }, 20);
        });
    }
    
    radialFadeOut() {
        var that = this;
        return new Promise((resolve) => {
            that.filter.style.backgroundImage = `-webkit-radial-gradient(center, rgba(0, 0, 0, 0.0) 30%, rgba(0, 0, 0, 1.0) 100%)`;
            that.filter.style.backgroundColor = `rgba(0, 0, 0, 0.0)`;
            let i = 0.0;
            let play = setInterval(function() {
                i += 0.02;
                if(i >= 1) {
                    i = 1;
                    clearInterval(play);
                    that.filter.style.backgroundImage = `-webkit-radial-gradient(center, rgba(0, 0, 0, 1.0) 30%, rgba(0, 0, 0, 1.0) 100%)`;
                    resolve("fadeIn() complete");
                }
                that.filter.style.backgroundImage = `-webkit-radial-gradient(center, rgba(0, 0, 0, ${ i }) 30%, rgba(0, 0, 0, 1.0) 100%)`;
            }, 20);
        });
    }
    
    radialFadeIn() {
        var that = this;
        return new Promise(function(resolve) {
            that.filter.style.backgroundImage = `-webkit-radial-gradient(center, rgba(0, 0, 0, 1.0) 30%, rgba(0, 0, 0, 1.0) 100%)`;
            that.filter.style.backgroundColor = `rgba(0, 0, 0, 0.0)`;
            let i = 1.0;
            let play = setInterval(function() {
                i -= 0.02;
                if(i <= 0) {
                    i = 0;
                    clearInterval(play);
                    that.filter.style.backgroundImage = `-webkit-radial-gradient(center, rgba(0, 0, 0, 0.0) 30%, rgba(0, 0, 0, 1.0) 100%)`;
                    resolve("fadeOut() complete");
                }
                that.filter.style.backgroundImage = `-webkit-radial-gradient(center, rgba(0, 0, 0, ${ i }) 30%, rgba(0, 0, 0, 1.0) 100%)`;
            }, 20);
        });
    }

};
