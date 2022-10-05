import AutoIncrement from '../common/autoincrement.common';

export enum RENDEREABLE_TYPE {
    CONTAINER = 'container',
    GROUP = 'group',
    PIECE = 'piece'
};

/**
 * Base rendereable object
 */
export class Rendereable2D {
    private readonly _id:number;
    private _visible:boolean = true;
    private _x:number = 0;
    private _y:number = 0;
    
    constructor(
        private readonly _type:RENDEREABLE_TYPE
    ){
        this._id = AutoIncrement.getId();
    }
    
    get id() {
        return this._id;
    }
    
    get type() {
        return this._type;
    }

    get visible() {
        return this._visible;
    }
    set visible(value:boolean){
        this._visible = value;
    }

    get x() {
        return this._x;
    }
    set x(value:number){
        this._x = value;
    }

    get y(){
        return this._y;
    }
    set y(value:number){
        this._y = value;
    }

    render(_ctx:CanvasRenderingContext2D):void {
        throw new Error("Not implemented");
    }
}