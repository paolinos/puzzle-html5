import {Rendereable2D} from "../../engine/rendereable";

export default class ImageRender extends Rendereable2D {
    constructor(src) {
        super();

        this.ready = false;

        this.func = null;

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

    render(ctx) {
        if (!this.ready) return;

        ctx.drawImage(this.img, 0, 0);
    }

    isReady(){
        return this.ready;
    }

    getImg() {
        return this.img;
    }

    onLoadComplete(func) {
        this.func = func;
    }
}