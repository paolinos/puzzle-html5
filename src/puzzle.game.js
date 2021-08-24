import { CanvasRender, ImageRendering, PiecePuzzle } from './rendering.js';
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

class HtmlUI{
    constructor() {
        this.timeTxt = document.getElementById("time");
        this.setTime();
    }

    setTime(value="") {
        this.timeTxt.innerHTML = value;
    }
}

// Game status
const PUZZLE_GAME_STATUS = {
    NONE: 0,
    LOADING_IMAGE: 10,
    PRE_PREVIEW: 15,
    PREVIEWING: 20,
    PLAYING: 30
}

// Time game in seconds
const TIME_GAME = 60;
const TO_SECONDS = 0.001;

/**
 * Jigsaw Puzzle
 */
export default class PuzzleGame {
    constructor(canvasId, inputSettings) {
        this.stage = new CanvasRender(canvasId);
        this.inputSettings = inputSettings; // as InputData;
        this.ui = new HtmlUI();

        this.gameStatus = PUZZLE_GAME_STATUS.NONE;
        this.previewInterval = null;

        // create ImageRendering
        this.image = new ImageRendering(this.inputSettings.getImageFile());
        this.gameStatus = PUZZLE_GAME_STATUS.LOADING_IMAGE;
        this.image.onLoadComplete(() => {
            if (this.previewInterval === PUZZLE_GAME_STATUS.PRE_PREVIEW) {
                this.start();
            }
        });


        timer.addEventOnFrame(this.onUpdateGame.bind(this));
    }

    /**
     * Start game
     */
    start() {
        // First display the image for X seconds
        // cut/create pieces of the puzzle
        // play the game

        // Check status to start
        if (this.image.isReady()) {
            this.previewImage();
        } else {
            this.previewInterval = PUZZLE_GAME_STATUS.PRE_PREVIEW;
        }
    }

    /**
     * Start previwing the image and after X seconds will start the game
     */
    previewImage() {
        this.previewInterval = PUZZLE_GAME_STATUS.PREVIEWING;
        let counter = 5;
        this.ui.setTime(`Starting in: ${counter}`);

        this.stage.render([this.image]);

        clearInterval(this.previewInterval);
        this.previewInterval = setInterval(() => {
            counter--;
            this.ui.setTime(`Starting in: ${counter}`);
            if (counter <= 0) {
                clearInterval(this.previewInterval);
                
                this.runGame();
            }
        }, 1000)
    }

    /**
     * Run the game
     */
    runGame() {
        this.previewInterval = PUZZLE_GAME_STATUS.PLAYING;
        this.timeStart = Date.now();
        this.ui.setTime(`End game in: ${TIME_GAME}`);
        
        this.pieces = PiecePuzzle.createFromImage(this.image, this.inputSettings.getHorizontal(), this.inputSettings.getVertical());
        
        timer.start();
    }

    /**
     * On update game
     */
    onUpdateGame() {
        try {
            const currentTime = Math.floor((Date.now() - this.timeStart) * TO_SECONDS);
            this.ui.setTime(`End game in: ${TIME_GAME - currentTime}`);
            this.stage.render(this.pieces);
            
            if (currentTime >= TIME_GAME) {

                this.ui.setTime(`GAME OVER`);
                timer.stop();
            }
            
        } catch (error) {
            console.log(error);
            
            timer.stop();
        }
    }

    stop() {
        this.stage.clear();
    }
} 