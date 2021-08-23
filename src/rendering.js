export class CanvasRender {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        //this.canvas.width = window.innerWidth;
        //this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext('2d');
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * @param {array of BaseRenderObject} obj 
     */
    render(obj = []) {
        // TODO: render only when is needed
        
        this.clear();

        for (const item of obj) {
            item.render(this.ctx);
        }

        this.ctx.beginPath();
        this.ctx.rect(100, 50, 140, 74);
        this.ctx.stroke();
        
    }
}

/**
 * Base Rendereable Object
 */
class BaseRenderObject {
    constructor(ready=true) {
        this.ready = ready;
    }

    render(ctx) {
        throw new Error("Not implemented");
    }
}

/**
 * Image rendering.
 */
export class ImageRendering extends BaseRenderObject {
    constructor(src) {
        super(false);

        this.img = new Image();
        this.img.addEventListener("load", () => {
            console.log("Ready image to render");
            this.ready = true;
        })
        this.img.src = src;
    }

    render(ctx) {
        if (!this.ready) return;

        ctx.drawImage(this.img, 0, 0);
    }
}