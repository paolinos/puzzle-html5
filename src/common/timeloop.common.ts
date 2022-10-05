/**
 * Time Loop have the logic to update the fps
 * // TODO: THIS WILL BE CHANGED BY requestAnimationFrame
 */
export default class TimeLoop{

    private intervalTime:number;
    private interval:number|undefined = undefined;
    private func:((dt:number) => void)|undefined = undefined;
    //private prevFrame:number;

    constructor(fps = 30) {
        this.intervalTime = 1000 / fps;
        //this.prevFrame = 0;
    }

    addEventOnFrame(func:(dt:number) => void) {
        this.func = func;
    }

    start() {
        clearInterval(this.interval);
        let prevFrame = performance.now();
        this.interval = setInterval(() => {
            const current = performance.now();
            const deltaT = current - prevFrame;
            if (this.func) {
                this.func(deltaT);
            }
            prevFrame = current;
        }, this.intervalTime)
    }

    stop() {
        clearInterval(this.interval);
    }
}