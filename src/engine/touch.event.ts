export enum TOUCH_TYPE {
    DOWN= 10,
    MOVE= 20,
    UP= 30
}

export class TouchPosition {

    constructor(
        private _type:TOUCH_TYPE,
        private _x: number,
        private _y: number
    ) { }

    isDown():boolean {
        return this._type === TOUCH_TYPE.DOWN;
    }

    isMove():boolean {
        return this._type === TOUCH_TYPE.MOVE;
    }

    isUp():boolean {
        return this._type === TOUCH_TYPE.UP;
    }

    getPos():{x:number, y:number} {
        return { x: this._x, y: this._y };
    }

    getX():number {
        return this._x;
    }

    getY():number {
        return this._y;
    }
}