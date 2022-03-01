export const TOUCH_TYPE = {
    DOWN: 10,
    MOVE: 20,
    UP: 30
}

export class TouchPosition {
    constructor(type, x,y) {
        this._x = x;
        this._y = y;
        this._type = type;
    }

    isDown() {
        return this._type === TOUCH_TYPE.DOWN;
    }

    isMove() {
        return this._type === TOUCH_TYPE.MOVE;
    }

    isUp() {
        return this._type === TOUCH_TYPE.UP;
    }

    getPos() {
        return { x: this._x, y: this._y };
    }

    getX() {
        return this._x;
    }

    getY() {
        return this._y;
    }
}