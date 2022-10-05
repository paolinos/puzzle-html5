import {Rendereable2D, RENDEREABLE_TYPE} from "../../engine/rendereable";

export default class ImageRender extends Rendereable2D {

    private ready:boolean = false;
    func:(() => void)|undefined = undefined;
    private readonly img:HTMLImageElement;

    constructor(src:string) {
        super(RENDEREABLE_TYPE.PIECE);

        this.img = new Image();
        this.img.addEventListener("load", () => {
            console.log("Ready image to render");
            this.ready = true;
            if (this.func) {
                this.func();
            }
        })
        this.img.src = src;
    }

    render(ctx:CanvasRenderingContext2D):void {
        if (!this.ready) return;

        ctx.drawImage(this.img, 0, 0);
    }

    isReady():boolean {
        return this.ready;
    }

    getImg() {
        return this.img;
    }

    onLoadComplete(func:() => void):void {
        this.func = func;
    }
}