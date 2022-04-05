import { Rendereable2D } from "../../engine/rendereable";

/**
 * abstract class.
 */
export class BoxDragDrop extends Rendereable2D{
    constructor(type){
        super(type);

        this._drag_drop = {
            active: false,
            diff_x: 0,
            diff_y: 0
        };
    }   

    render(ctx){
        throw new Error("Not implemented");
    }

    setPos(x, y) {
        this.x = x - this._drag_drop.diff_x;
        this.y = y - this._drag_drop.diff_y;
    }

    startDragAndDrop(x,y){
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