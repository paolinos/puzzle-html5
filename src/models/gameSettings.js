export class GameSettings {
    constructor(options){
        this._image = options.image ? URL.createObjectURL(options.image) : null;
        this._horizontal = options.horizontal || 0;
        this._vertical = options.vertical || 0;
    }

    get image(){
        return this._image;
    }
    get horizontal(){
        return this._horizontal;
    }
    get vertical(){
        return this._vertical;
    }
}