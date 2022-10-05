import { Engine2d, EngineOptions } from "../engine/engine2d";
import { IGameSettings } from "../models/gameSettings";
import ImageRender from "./render/image.render";

/**
 * Jigsaw Puzzle Constructor
 */
export default class PuzzleConstructor {

    protected stage;
    protected image?:ImageRender;
    protected inputSettings?:IGameSettings;

    constructor(canvasId:string|HTMLCanvasElement, options:EngineOptions) {
        this.stage = new Engine2d(canvasId, options);
    }

    _load(inputSettings:IGameSettings, onComplete:() => void){
        // create ImageRendering
        this.inputSettings = inputSettings;

        this.image = new ImageRender(this.inputSettings!.image);

        if(onComplete){
            this.image.onLoadComplete(onComplete);
        }
    }

    clear() {
        this.stage.clear();

        this.image = undefined;
        this.inputSettings = undefined;
    }

}