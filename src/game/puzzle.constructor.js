import { Engine2d } from "../engine/engine2d";
import ImageRender from "./render/image.render";

/**
 * Jigsaw Puzzle Constructor
 */
export default class PuzzleConstructor {

    constructor(canvasId, options) {
        this.stage = new Engine2d(canvasId, options);

        this.image = null;
        this.inputSettings = null;
    }

    _load(inputSettings, onComplete){
        // create ImageRendering
        this.inputSettings = inputSettings;

        this.image = new ImageRender(this.inputSettings.image);

        if(onComplete){
            this.image.onLoadComplete(onComplete);
        }
    }

    clear() {
        this.stage.clear();

        this.image = null;
        this.inputSettings = null;
    }

}