import { PUZZLE_GAME_STATUS, TIME_GAME, TO_SECONDS } from "../const";
import { Engine2d } from "../engine/engine2d";
import PiecePuzzleTool from "./tools/piecepuzzle.tool";
import ImageRender from "./render/image.render";

/**
 * Game events for onEvent
 */
export const GAME_EVENTS = {
    END: "game-end",
    UPDATE_UI: "game-update-ui"
}

/**
 * Jigsaw Puzzle
 */
export default class PuzzleGame {
    constructor(canvasId, options) {
        this.stage = new Engine2d(canvasId, options);

        this.inputSettings = null;
        this._onEventfn = null;

        this.gameStatus = PUZZLE_GAME_STATUS.NONE;

        // Note: maybe not the best place. Event should be added and remove each time, but just a test ;)
        this.touchEvent = null;
        this.stage.addTouchEvent((e) => {
            if(this.gameStatus !== PUZZLE_GAME_STATUS.PLAYING) return;

            this.touchEvent = e;
        })
    }

    load(inputSettings){
        // create ImageRendering
        this.inputSettings = inputSettings;

        this.image = new ImageRender(this.inputSettings.image);
        this.gameStatus = PUZZLE_GAME_STATUS.LOADING_IMAGE;
        this.image.onLoadComplete(() => {
            this.start();
        });
    }

    /**
     * NOTE: We already know that we could use EventEmitter. but we use simple callback. 
     * @param {function} fn callback 
     */
    onEvent(fn){
        this._onEventfn = fn;
    }


    _emitEvent(name, data={}){
        if(this._onEventfn){
            this._onEventfn(name, data)
        }
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
            this.gameStatus = PUZZLE_GAME_STATUS.PRE_PREVIEW;
        }
    }

    /**
     * Start previwing the image and after X seconds will start the game
     */
    previewImage() {
        this.gameStatus = PUZZLE_GAME_STATUS.PREVIEWING;
        let counter = 5;

        this._emitEvent(GAME_EVENTS.UPDATE_UI, `Starting in: ${counter}`);

        this.stage.addItem(this.image);
        this.stage.render();
        

        let previewWait = setInterval(() => {
            counter--;
            
            this._emitEvent(GAME_EVENTS.UPDATE_UI,`Starting in: ${counter}`);
            if (counter <= 0) {
                clearInterval(previewWait);
                
                this.stage.removeItem(this.image);

                this.createGame();
            }
        }, 1000);
    }

    /**
     * Create Game pieces
     */
    createGame() {
        this.timeStart = Date.now();
        this._emitEvent(GAME_EVENTS.UPDATE_UI,`End game in: ${TIME_GAME}`);
        this.stage.clear();
        
        this.stage.addRange(
            PiecePuzzleTool.createFromImage(
                this.image, 
                this.inputSettings.horizontal, 
                this.inputSettings.vertical,
                this.stage.width,
                this.stage.height,
            )
        );

        // Clear touch & piece to move
        this.touchEvent = null;
        this.containerToMove = null;

        this.gameStatus = PUZZLE_GAME_STATUS.PLAYING;
        this.onUpdateGame();
    }

    /**
     * On update game
     */
    onUpdateGame(){
        this.stage.clear();
        
        if (this.touchEvent){

            if (this.touchEvent.isDown()) {
                // check collision
                for (let pos = this.stage.items.length - 1; pos >= 0; pos--) {
                    const item = this.stage.items[pos];

                    if (item.checkTouchColission(this.touchEvent)) {
                        this.containerToMove = item;
                        break;
                    };
                }

                if(this.containerToMove){
                    this.containerToMove.startDragAndDrop(this.touchEvent.getX(), this.touchEvent.getY());
                }
            }
            else if (this.touchEvent.isMove() && this.containerToMove){
                this.containerToMove.setPos(this.touchEvent.getX(), this.touchEvent.getY());

                for (const item of this.stage.items) {
                    if(item.id === this.containerToMove.id) continue;

                    const resColl = item.checkContainerCollision(this.containerToMove);
                    if(resColl.collision){
                        this.containerToMove.clearDragAndDrop();

                        // Remove tags collision
                        resColl.data.other.piece.tagInfo.removeTag(resColl.data.current.piece.tagInfo.name);
                        resColl.data.current.piece.tagInfo.removeTag(resColl.data.other.piece.tagInfo.name);
                        
                        item.mergeGroup(this.containerToMove);

                        this.stage.removeItem(this.containerToMove);

                        this.containerToMove = null;
                        break
                    }
                }
            }
            else if (this.touchEvent.isUp() ){
                if (this.containerToMove) {
                    this.containerToMove.clearDragAndDrop();
                }
                this.containerToMove = null;
            }
        }
        
        // Clear touch
        this.touchEvent = null;

        // Update UI Time
        const currentTime = Math.floor((Date.now() - this.timeStart) * TO_SECONDS);
        this._emitEvent(GAME_EVENTS.UPDATE_UI, `End game in: ${TIME_GAME - currentTime}`);

        if(this.stage.items.length === 1){
            this._emitEvent(GAME_EVENTS.UPDATE_UI, 'Well done');
            this.stage.items[0].setPos(0,0);

            this.gameStatus = PUZZLE_GAME_STATUS.END;
        }
        else if (currentTime >= TIME_GAME ) {
            this._emitEvent(GAME_EVENTS.UPDATE_UI, 'GAME OVER');

            this.gameStatus = PUZZLE_GAME_STATUS.END;
        }

        this.stage.render();
        
        if(this.gameStatus === PUZZLE_GAME_STATUS.END){
            this.stage.removeAllItems();
            
            this._emitEvent(GAME_EVENTS.END);
            return;
        }

        requestAnimationFrame(this.onUpdateGame.bind(this));
    }

    clear() {
        this.gameStatus = PUZZLE_GAME_STATUS.NONE;
        this.stage.clear();

        this.image = null;
        this.inputSettings = null;
        this.touchEvent = null;
    }
}