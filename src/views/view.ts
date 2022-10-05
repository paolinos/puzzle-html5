import { IGameSettings } from "../models/gameSettings";

export interface IView {
    show():void;

    hide():void;

    start(_data?:IGameSettings):void;

    clear():void;

    onNext(fn:((data?: IGameSettings, type?: string) => void)|undefined):void;
}

export abstract class View implements IView {
    protected _element:HTMLElement;
    protected _fn:((data?: IGameSettings, type?: string) => void)|undefined;

    constructor(
        protected _name:string,
        protected _nodeId:string,
        visible:boolean = false){
        //this._name = name;
        //this._nodeId = nodeId;
        this._element = document.getElementById(this._nodeId) as HTMLElement;

        if(!visible){
            this.hide();        
        }
    }

    show(){
        this._element.style.display = "block";
    }
    
    hide(){
        this._element.style.display = "none";
    }

    start(_data?:IGameSettings){
        this.show();
    }

    clear(){
        this.hide();
    }

    onNext(fn:(data?: IGameSettings, type?: string) => void){
        this._fn = fn;
    }
}