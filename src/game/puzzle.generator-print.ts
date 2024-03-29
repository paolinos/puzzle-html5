import { EngineOptions } from "../engine/engine2d";
import { IGameSettings } from "../models/gameSettings";
import PuzzleConstructor from "./puzzle.constructor";
import PiecePuzzleTool from "./tools/piecepuzzle.tool";


export default class PuzzleGeneratorPrint extends PuzzleConstructor {
    constructor(canvasId:string|HTMLCanvasElement, options:EngineOptions){
        super(canvasId, options);
    }


    load(inputSettings:IGameSettings) {
        this._load(inputSettings, this._onLoadComplete.bind(this));
    }
    _onLoadComplete() {
        this.stage.clear();

        const result =  PiecePuzzleTool.createPrintableFromImage(
            this.image!, 
            this.inputSettings!.horizontal, 
            this.inputSettings!.vertical
            //this.stage.width,
            //this.stage.height
        );
        this.stage.width = result.width;
        this.stage.height = result.height;
        this.stage.addRange(result.data);

        this.stage.render();
    }

    get canvas(){
        return this.stage.canvas;       
    }

    createImageFromCanvas(){
        return this.stage.canvas.toDataURL("image/png")
    }
}