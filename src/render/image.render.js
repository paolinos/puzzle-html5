import BaseObjectRender from "./base.object.render";

export default class ImageRender extends BaseObjectRender {
    constructor(src) {
        super(false);

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

    getImg() {
        return this.img;
    }

    onLoadComplete(func) {
        this.func = func;
    }
}