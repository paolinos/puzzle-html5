import { Rendereable2D as Rendereable } from "./rendereable";
import { TOUCH_TYPE, TouchPosition } from './touch.event';

export type EngineOptions = {
    width: number;
    height: number;
}

export interface IEngine2D {
    get width():number;
    set width(value:number);

    get height():number;
    set height(value:number);

    get canvas():HTMLCanvasElement;
    get items():Rendereable[];

    addItem(item:Rendereable):void;
    addRange(list:Rendereable[]):void;
    removeItem(item:Rendereable):void;
    removeAllItems():void;
    
}


/**
 * Engine2d is a base abstraction to use Canvas
 */
export class Engine2d implements IEngine2D {

    private _canvas:HTMLCanvasElement;
    private _context:CanvasRenderingContext2D;
    private _items:Rendereable[];
    private _canvas_rect:DOMRect;
    private _func:((value:TouchPosition) => void)|undefined = undefined;
    private mouseDown:boolean = false;

    constructor(value:string|HTMLCanvasElement, options:EngineOptions|null = null){
        this._items = [];

        if(value instanceof HTMLCanvasElement){
            this._canvas = value as HTMLCanvasElement;
        }else{
            this._canvas = document.getElementById(value) as HTMLCanvasElement;
        }

        if(options){
            if(options.width) this._canvas.width = options.width;
            if(options.height) this._canvas.height = options.height;
        }

        this._context = this._canvas.getContext('2d') as CanvasRenderingContext2D;
        this._canvas_rect = this._canvas.getBoundingClientRect();
    }

    get width():number{
        return this._canvas.width;
    }
    set width(value:number){
        this._canvas.width = value;
    }

    get height():number {
        return this._canvas.height;
    }
    set height(value:number){
        this._canvas.height = value;
    }

    get canvas():HTMLCanvasElement {
        return this._canvas;
    }

    addItem(item:Rendereable):void {
        //if(!(item instanceof Rendereable)) return;

        this._items.push(item);
    }

    addRange(list:Rendereable[]):void {
        if(!(list instanceof Array)) return;

        for (const item of list) {
            this.addItem(item);
        }
    }

    removeItem(item:Rendereable):void {
        if(!(item instanceof Rendereable)) return;

        const pos = this._items.findIndex(q => q.id === item.id);
        if(pos >= 0){
            this._items.splice(pos, 1)
        }
    }

    removeAllItems():void{
        this._items = [];
    }

    get items():Rendereable[]{
        return this._items;
    }

    addTouchEvent(func:(value:TouchPosition) => void){
        if(!func || this._func) return;
        
        this._func = func;

        this._canvas.addEventListener("mousedown", this._onTouchDown.bind(this), false);
        this._canvas.addEventListener("mousemove", this._onTouchMove.bind(this), false);
        this._canvas.addEventListener("mouseup", this._onTouchUp.bind(this), false);
        this._canvas.addEventListener("mouseout", this._onTouchUp.bind(this), false);
    }

    removeTouchEvent(){
        this._func = undefined;

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

    private _onTouchDown(e:MouseEvent) {
        if (!this._func) return;
        this.mouseDown = true;

        this._sendEvent(TOUCH_TYPE.DOWN , e);
    }

    private _onTouchMove(e:MouseEvent) {
        if(!this.mouseDown) return;

        this._sendEvent(TOUCH_TYPE.MOVE, e);
    }

    private _onTouchUp(e:MouseEvent) {
        if (!this.mouseDown) return;
        this.mouseDown = false;

        this._sendEvent(TOUCH_TYPE.UP, e);
    }

    private _sendEvent(eventName:TOUCH_TYPE, mouseEvent:MouseEvent){
        if (!this._func) return;
        this._func(
            new TouchPosition(eventName, mouseEvent.clientX - this._canvas_rect.left, mouseEvent.clientY - this._canvas_rect.top)
        );
    }
}