import AutoIncrement from '../common/autoincrement.common';

export const RENDEREABLE_TYPE = {
    CONTAINER : 'container',
    GROUP : 'group',
    PIECE : 'piece'
}

/**
 * Base rendereable object
 */
export class Rendereable2D {
    _id = -1;
    _visible = true;
    _x = 0;
    _y = 0;
    _type = '';
    
    constructor(type){
        this._type = type;
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
    set visible(value){
        this._visible = value;
    }

    get x() {
        return this._x;
    }
    set x(value){
        this._x = value;
    }

    get y(){
        return this._y;
    }
    set y(value){
        this._y = value;
    }

    render(ctx){
        throw new Error("Not implemented");
    }
}