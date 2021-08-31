/**
 * Time Loop have the logic to update the fps
 * // TODO: THIS WILL BE CHANGED BY requestAnimationFrame
 */
export default class TimeLoop{
    constructor(fps = 30) {
        this.intervalTime = 1000 / fps;
        this.interval = null;
        this.func = null;
        this.prevFrame = 0;
    }

    addEventOnFrame(func) {
        this.func = func;
    }

    start() {
        clearInterval(this.interval);
        this.prevFrame = performance.now();
        this.interval = setInterval(() => {
            const current = performance.now();
            if (this.func) {
                this.func();
            }
            this.prevFrame = current;
        }, this.intervalTime)
    }

    stop() {
        clearInterval(this.interval);
    }
}