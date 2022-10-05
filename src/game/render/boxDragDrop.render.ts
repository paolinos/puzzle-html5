import { Rendereable2D, RENDEREABLE_TYPE } from "../../engine/rendereable";

interface DragDropRelative {
    active: boolean;
    diff_x: number;
    diff_y: number;
}

/**
 * abstract class.
 */
export class BoxDragDrop extends Rendereable2D{

    _drag_drop:DragDropRelative;

    constructor(type:RENDEREABLE_TYPE){
        super(type);

        this._drag_drop = {
            active: false,
            diff_x: 0,
            diff_y: 0
        };
    }   

    render(_ctx:CanvasRenderingContext2D){
        throw new Error("Not implemented");
    }

    setPos(x:number, y:number) {
        this.x = x - this._drag_drop.diff_x;
        this.y = y - this._drag_drop.diff_y;
    }

    startDragAndDrop(x:number, y:number){
        this._drag_drop.active = true;
        this._drag_drop.diff_x = x - this.x;
        this._drag_drop.diff_y = y - this.y;
    }

    clearDragAndDrop() {
        this._drag_drop.active = false;

        this._drag_drop.diff_x = 0;
        this._drag_drop.diff_y = 0;
    }
}