import { PUZZLE_GAME_STATUS, TIME_GAME, TO_SECONDS } from "../const";
import TimeLoop from "../common/timeloop.common";
import CanvasRender from "../render/canvas.render";
// Objects
import ImageObject from "../objects/image.object";
import PiecePuzzleObject from "../objects/piecepuzzle.object";
// UI
import HtmlUI from "../ui/html.ui";

// TODO: change this
const timer = new TimeLoop();

/**
 * Jigsaw Puzzle
 * // TODO: create layouts and update it
 */
export default class PuzzleGame {
    constructor(canvasId, inputSettings) {
        this.stage = new CanvasRender(canvasId);
        this.inputSettings = inputSettings; // as InputData;
        this.ui = new HtmlUI();

        this.gameStatus = PUZZLE_GAME_STATUS.NONE;
        this.previewInterval = null;

        // create ImageRendering
        this.image = new ImageObject(this.inputSettings.getImageFile());
        this.gameStatus = PUZZLE_GAME_STATUS.LOADING_IMAGE;
        this.image.onLoadComplete(() => {
            if (this.previewInterval === PUZZLE_GAME_STATUS.PRE_PREVIEW) {
                this.start();
            }
        });

        // TODO: is this the best place?
        this.touchEvent = null;
        this.stage.addTouchEvent((e) => {
            this.touchEvent = e;
        })
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
        
        this.pieces = PiecePuzzleObject.createFromImage(this.image, this.inputSettings.getHorizontal(), this.inputSettings.getVertical());
        
        // Clear touch & piece to move
        this.touchEvent = null;
        this.pieceToMove = null;
        timer.start();
    }

    /**
     * On update game
     */
    onUpdateGame() {
        try {
            // TODO: review this logic
            if (this.touchEvent) {

                // TODO: this should be part of the update of the Stage, and emit event of Touch
                // Identify item that is touching
                let pieceTouched = null;
                let pos = 0;
                for (pos = this.pieces.length-1; pos >= 0; pos--) {
                    const piece = this.pieces[pos];
                    if (piece.checkColission(this.touchEvent)) {
                        pieceTouched = piece;
                        break;
                    };
                }
                if (this.touchEvent.isDown()) {
                    if (pieceTouched) {
                        // NOTE: this should be in the rendering engine. but we are not taking care about engine. 
                        // Update object to render last
                        this.pieces.splice(pos, 1);
                        this.pieces.push(pieceTouched);

                        this.pieceToMove = pieceTouched;
                        // TODO: check differences between the pieces and touch.
                        this.pieceToMove.setPos(this.touchEvent.getX(), this.touchEvent.getY());
                    }
                }
                else if (this.touchEvent.isMove() && this.pieceToMove) {
                    // TODO: check differences between the pieces and touch.
                    this.pieceToMove.setPos(this.touchEvent.getX(), this.touchEvent.getY());
                }
                else if (this.touchEvent.isUp()) {

                    if (this.pieceToMove) {
                        // Clear touch differences
                        this.pieceToMove.clearDragAndDrop();
                    }
                    this.pieceToMove = null;
                }
            }
            this.touchEvent = null;
            
            // Update UI Time
            const currentTime = Math.floor((Date.now() - this.timeStart) * TO_SECONDS);
            this.ui.setTime(`End game in: ${TIME_GAME - currentTime}`);
            
            // Render
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