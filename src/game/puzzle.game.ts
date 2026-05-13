import { PUZZLE_GAME_STATUS, TIME_GAME, TO_SECONDS } from "../const";
import { Engine2d, EngineOptions } from "../engine/engine2d";
import PiecePuzzleTool from "./tools/piecepuzzle.tool";
import ImageRender from "./render/image.render";
import { IGameSettings } from "../models/gameSettings";
import { TouchPosition } from "../engine/touch.event";
import { Container } from "./render/container.render";

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

    private stage:Engine2d;
    private image?:ImageRender;
    private inputSettings?:IGameSettings;
    private _onEventfn?:(name:string, data:string) => void;
    private gameStatus:PUZZLE_GAME_STATUS;
    private touchEvent?:TouchPosition;

    private timeStart:number = 0;
    private containerToMove?:Container;

    constructor(canvasId:string|HTMLCanvasElement, options:EngineOptions) {
        this.stage = new Engine2d(canvasId, options);

        this.gameStatus = PUZZLE_GAME_STATUS.NONE;

        // Note: maybe not the best place. Event should be added and remove each time, but just a test ;)
        this.stage.addTouchEvent((e:TouchPosition) => {
            if(this.gameStatus !== PUZZLE_GAME_STATUS.PLAYING) return;

            this.touchEvent = e;
        })
    }

    load(inputSettings:IGameSettings){
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
    onEvent(fn:(name:string, data:string) => void){
        this._onEventfn = fn;
    }


    _emitEvent(name:string, data:string=""){
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
        if (this.image!.isReady()) {
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

        this.stage.addItem(this.image!);
        this.stage.render();
        

        let previewWait = setInterval(() => {
            counter--;
            
            this._emitEvent(GAME_EVENTS.UPDATE_UI,`Starting in: ${counter}`);
            if (counter <= 0) {
                clearInterval(previewWait);
                
                this.stage.removeItem(this.image!);

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
                this.image!, 
                this.inputSettings!.horizontal, 
                this.inputSettings!.vertical,
                this.stage.width,
                this.stage.height,
            )
        );

        // Clear touch & piece to move
        this.touchEvent = undefined;
        this.containerToMove = undefined;

        this.gameStatus = PUZZLE_GAME_STATUS.PLAYING;
        this.onUpdateGame();
    }

    /**
     * On update game
     */
    onUpdateGame(){
        // Clear stage for re-render
        if (this.gameStatus === PUZZLE_GAME_STATUS.END){
            this.stage.removeAllItems();
            this._emitEvent(GAME_EVENTS.END);
            return;
        }

        // Clear touch position at end of frame
        const prevTouchEvent = this.touchEvent;
        
        this.touchEvent = undefined; // Will be set by event handler next frame

        // Check game status first
        if(this.stage.items.length === 1){
            const finalContainer = this.stage.items[0] as Container;
            
            // Set final position (0,0) for solved puzzle
            finalContainer.setPos(0,0);
            
            // Check if container is not empty (has at least one piece)
            if(finalContainer.pieces.length > 0){
                this.gameStatus = PUZZLE_GAME_STATUS.END;
            }
        }
        else if (Math.floor((Date.now() - this.timeStart) * TO_SECONDS) >= TIME_GAME ) {
            this.gameStatus = PUZZLE_GAME_STATUS.END;
        }

        // Update UI Time
        const currentTime = Math.floor((Date.now() - this.timeStart) * TO_SECONDS);
        const remainingTime = Math.max(0, TIME_GAME - currentTime);
        
        // Check if puzzle is completed
        if (this.gameStatus === PUZZLE_GAME_STATUS.END) {
            let finalTime = Math.min(currentTime, TIME_GAME); // Cap at TIME_GAME
            this._emitEvent(GAME_EVENTS.UPDATE_UI, `GAME WIN! ${finalTime}s`);
        } else {
            this._emitEvent(GAME_EVENTS.UPDATE_UI, `End game in: ${remainingTime}`);
        }

        // Process touch events before clearing stage
        if (prevTouchEvent){
            const touchEvent = prevTouchEvent;

            if (touchEvent.isDown()) {
                // check collision - use prev containerToMove since it might still be valid
                // We need to check collision with all pieces before clearing containerToMove
                let foundContainer = this.containerToMove;
                
                // If no container is being moved and we clicked on a piece, select it
                if (!foundContainer) {
                    for (let pos = this.stage.items.length - 1; pos >= 0; pos--) {
                        const item = this.stage.items[pos];
                        const container = item as Container;
                        if (container.checkTouchColission(touchEvent)) {
                            foundContainer = container;
                            break;
                        };
                    }
                }

                if(foundContainer){
                    foundContainer.startDragAndDrop(touchEvent.getX(), touchEvent.getY());
                    this.containerToMove = foundContainer;
                    // Also clear dragAndDrop if we're switching containers
                    if (this.containerToMove !== foundContainer && this.containerToMove) {
                        this.containerToMove.clearDragAndDrop();
                    }
                }
            }
            else if (touchEvent.isMove()){
                if (this.containerToMove){
                    this.containerToMove.setPos(touchEvent.getX(), touchEvent.getY());

                    for (const item of this.stage.items) {
                        if(item.id === this.containerToMove.id) continue;

                        const container = item as Container;
                        const resColl = container.checkContainerCollision(this.containerToMove);
                        if(resColl.collision){
                            this.containerToMove.clearDragAndDrop();
                            this.containerToMove.setPos(this.containerToMove.x, this.containerToMove.y - 1); // Snap to grid later if needed

                            // Remove tags collision
                            resColl.data.other.piece.tagInfo.removeTag(resColl.data.current.piece.tagInfo.name);
                            resColl.data.current.piece.tagInfo.removeTag(resColl.data.other.piece.tagInfo.name);
                            
                            container.mergeGroup(this.containerToMove);

                            this.stage.removeItem(this.containerToMove);

                            this.containerToMove = undefined;
                            break;
                        }
                    }
                }
            }
            else if (touchEvent.isUp() ){
                if (this.containerToMove) {
                    this.containerToMove.clearDragAndDrop();
                }
                this.containerToMove = undefined;
            }
        }

        // Render the game
        this.stage.render();
        
        // Only reset status to PLAYING if we haven't ended
        if (this.gameStatus !== PUZZLE_GAME_STATUS.END) {
            this.gameStatus = PUZZLE_GAME_STATUS.PLAYING;
        }

        requestAnimationFrame(this.onUpdateGame.bind(this));
    }

    clear() {
        this.gameStatus = PUZZLE_GAME_STATUS.NONE;
        this.stage.clear();

        this.image = undefined;
        this.inputSettings = undefined;
        this.touchEvent = undefined;
    }
}