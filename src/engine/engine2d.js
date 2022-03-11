import { Rendereable2D as Rendereable } from "./rendereable";
import { TOUCH_TYPE, TouchPosition } from './touch.event';

/**
 * Engine2d is a base abstraction to use Canvas
 */
export class Engine2d {

    constructor(value){
        this._canvas = null;
        this._context = null;
        this._items = [];
        this._canvas_rect = null;

        this._func = null;

        if(value instanceof HTMLCanvasElement){
            this._canvas = value;
        }else{
            this._canvas = document.getElementById(value);
        }

        this._context = this._canvas.getContext('2d');

        this._canvas_rect = this._canvas.getBoundingClientRect();
    }

    addItem(item) {
        if(!(item instanceof Rendereable)) return;

        this._items.push(item);
    }

    addRange(list) {
        if(!(list instanceof Array)) return;

        for (const item of list) {
            this.addItem(item);
        }
    }

    removeItem(item) {
        if(!(item instanceof Rendereable)) return;

        const pos = this._items.findIndex(q => q.id === item.id);
        if(pos >= 0){
            this._items.splice(pos, 1)
        }
    }

    addTouchEvent(func){
        if(!func || this._func) return;
        
        this._func = func;

        this._canvas.addEventListener("mousedown", this._onTouchDown.bind(this), false);
        this._canvas.addEventListener("mousemove", this._onTouchMove.bind(this), false);
        this._canvas.addEventListener("mouseup", this._onTouchUp.bind(this), false);
        this._canvas.addEventListener("mouseout", this._onTouchUp.bind(this), false);
    }

    removeTouchEvent(){
        this._func = null;

        this._canvas.removeEventListener("mousedown", this._onTouchDown, false);
        this._canvas.removeEventListener("mousemove", this._onTouchMove, false);
        this._canvas.removeEventListener("mouseup", this._onTouchUp, false);
        this._canvas.removeEventListener("mouseout", this._onTouchUp, false);
    }

    render(){
        this.clear();
                
        for (const piece of this._items) {
            piece.render(this._context);
        }
    }

    clear() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }



    _onTouchDown(e) {
        if (!this._func) return;
        this.mouseDown = true;

        this._sendEvent(TOUCH_TYPE.DOWN , e);
    }

    _onTouchMove(e) {
        if(!this.mouseDown) return;

        this._sendEvent(TOUCH_TYPE.MOVE, e);
    }

    _onTouchUp(e) {
        if (!this.mouseDown) return;
        this.mouseDown = false;

        this._sendEvent(TOUCH_TYPE.UP, e);
    }

    _sendEvent(eventName, mouseEvent){
        if (!this._func) return;
        this._func(
            new TouchPosition(eventName, mouseEvent.clientX - this._canvas_rect.left, mouseEvent.clientY - this._canvas_rect.top)
        );
    }
}