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

    getImg() {
        return this.img;
    }
}

const PUZZLE_TABS_UP = 1;
const PUZZLE_TABS_DOWN = 2;
const PUZZLE_TABS_LEFT = 3;
const PUZZLE_TABS_RIGHT = 4;

class Tab{
    /**
     * Information to know tab position and how we need to render it
     * @param {int} position position to render Up, Down, Left, Right
     * @param {boolean} internal tab internal or external
     */
    constructor(position, internal = false) {
        this._pos = position;
        this._side = internal;
    }

    getPosition() {
        return this._pos;
    }

    isInternal() {
        return this._side;
    }

    isExternal() {
        return !this._side;
    }
}


export class PiecePuzzle extends BaseRenderObject {
    /**
     * 
     * @param {Image} img 
     * @param {int} x 
     * @param {int} y 
     * @param {int} width 
     * @param {int} height 
     * @param {array of Tabs} tabs tabs to each position to create
     */
    constructor(img, x, y, imgx, imgy, width, height, tabs = []) {
        super();

        this.img = img;

        //  Position of the piece
        this.x = x;
        this.y = y;

        // Rendering settings
        this.imgx = imgx;
        this.imgy = imgy;
        this.width = width;
        this.height = height;
    }


    render(ctx) {
        if (!this.ready) return;

        ctx.drawImage(this.img, this.imgx, this.imgy, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    /**
     * 
     * @param {ImageRendering} image
     * @returns {Array of PiecePuzzle} PiecePuzzle array
     */
    static createFromImage(image, horizontal, vertical) {
        
        // Get real image
        const img = image.getImg();
        // Calculate piece width & height
        const imgW = img.width / horizontal;
        const imgH = img.height / vertical;

        // Create each piece, with the dimentions
        const data = [];
        for (let x = 0; x < horizontal; x++) {
            for (let y = 0; y < vertical; y++) {
                // Calculate random positions
                const randomX = Math.random() * img.width;
                const randomY = Math.random() * img.height;

                const piece = new PiecePuzzle(img, randomX, randomY,  x * imgW, y * imgH, imgW, imgH);
                data.push(piece)
            }
        }

        return data;
    }
}