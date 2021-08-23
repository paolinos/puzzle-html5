import { CanvasRender, ImageRendering } from './rendering.js';
import { InputData } from './input.settings.js';

// TODO:    old school or requestAnimationFrame?
class TimeLoop{
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

            // TODO: remove console.log!!!
            console.log("miliseconds per frame: ", current - this.prevFrame);
            this.prevFrame = current;
        }, this.intervalTime)
    }

    stop() {
        clearInterval(this.interval);
    }
}
const timer = new TimeLoop();

export default class PuzzleGame {
    constructor(canvasId, inputSettings) {
        this.stage = new CanvasRender(canvasId);
        this.inputSettings = inputSettings; // as InputData;

        // TODO: remove console.log!!!
        console.log("this.inputSettings.getImage():", this.inputSettings.getImageFile());
        this.image = new ImageRendering(this.inputSettings.getImageFile());

        timer.addEventOnFrame(this.update.bind(this));
    }

    start() {
        timer.start();
    }

    update() {
        this.stage.render([this.image]);
    }

    stop() {
        this.stage.clear();
    }
} 