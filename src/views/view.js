export class View {
    
    constructor(name, nodeId, visible){
        this._name = name;
        this._nodeId = nodeId;
        this._element = document.getElementById(nodeId);

        if(!visible){
            this.hide();        
        }

        this._fn = null;
    }

    show(){
        this._element.style.display = "block";
    }
    
    hide(){
        this._element.style.display = "none";
    }

    start(){
        this.show();
    }

    clear(){
        this.hide();
    }

    onNext(fn){
        this._fn = fn;
    }
}