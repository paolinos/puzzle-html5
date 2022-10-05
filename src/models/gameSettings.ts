
export interface IGameSettings {
    get image():string;
    get horizontal():number;
    get vertical():number;
}

export interface IGameOptions {
    image: File;
    horizontal: number;
    vertical: number;
}

export class GameSettings implements IGameSettings {

    private readonly _image:string;
    private readonly _horizontal:number;
    private readonly _vertical:number; 

    constructor(options:IGameOptions){
        this._image = URL.createObjectURL(options.image);
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