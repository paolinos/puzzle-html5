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

        this.tabs = tabs;

        // Internal calculations
        this.toX = this.x + this.width;
        this.toY = this.y + this.height;
        this.middleWidth = this.x + (this.width * 0.5);
        this.middleHeight = this.y + (this.height * 0.5);

        this.tabSizeW = this.width * 0.10; // 15 percent
        this.tabSizeH = this.height * 0.10; // 15 percent
        if (this.tabSizeW > this.tabSizeH) {
            this.tabSizeH = this.tabSizeW;
        } else {
            this.tabSizeW = this.tabSizeH;
        }
    }


    render(ctx) {
        if (!this.ready) return;

        //ctx.drawImage(this.img, this.imgx, this.imgy, this.width, this.height, this.x, this.y, this.width, this.height);

        // Get calculation values
        const toX = this.toX;
        const toY = this.toY;
        const middleWidth = this.middleWidth;
        const middleHeight = this.middleHeight;
        const tabSizeW = this.tabSizeW;
        const tabSizeH = this.tabSizeW;

        // Tab to find
        let tab = null;

        ctx.save();

        ctx.beginPath();
        // Move to x,y position
        ctx.moveTo(this.x, this.y);

        // TOP Line
        tab = this.tabs.find(el => el.getPosition() === PUZZLE_TABS_UP);
        if (tab) {
            const multiple = tab.isInternal() ? 1 : -1;
            // Inside tab
            ctx.lineTo(middleWidth - tabSizeW, this.y);
            ctx.quadraticCurveTo(middleWidth - (tabSizeW*2), this.y + (tabSizeH * multiple), middleWidth, this.y + (tabSizeH * multiple))
            ctx.quadraticCurveTo(middleWidth + (tabSizeW*2), this.y + (tabSizeH * multiple), middleWidth + tabSizeW, this.y)
        }
        ctx.lineTo(toX, this.y);            // close Line    
        

        // Right Line
        tab = this.tabs.find(el => el.getPosition() === PUZZLE_TABS_RIGHT);
        if (tab) {
            const multiple = tab.isInternal() ? -1 : 1;
            // Inside tab
            ctx.lineTo(toX, middleHeight - tabSizeH);
            ctx.quadraticCurveTo(toX + (tabSizeW * multiple), middleHeight - (tabSizeH * 2), toX + (tabSizeW * multiple), middleHeight)
            ctx.quadraticCurveTo(toX + (tabSizeW * multiple), middleHeight + (tabSizeH * 2), toX, middleHeight + tabSizeH)
        }
        ctx.lineTo(toX, toY);               // close Line
        
        
        // Bottom line
        tab = this.tabs.find(el => el.getPosition() === PUZZLE_TABS_DOWN);
        if (tab) {
            const multiple = tab.isInternal() ? -1 : 1;
            // Inside tab
            ctx.lineTo(middleWidth + tabSizeW, toY);
            ctx.quadraticCurveTo(middleWidth + (tabSizeW*2), toY + (tabSizeH * multiple), middleWidth, toY + (tabSizeH * multiple))
            ctx.quadraticCurveTo(middleWidth - (tabSizeW*2), toY + (tabSizeH * multiple), middleWidth - tabSizeW, toY)
        }
        ctx.lineTo(this.x, toY);            // close Line
        

        // Left line
        tab = this.tabs.find(el => el.getPosition() === PUZZLE_TABS_LEFT);
        if (tab) {
            const multiple = tab.isInternal() ? 1 : -1;
            // Inside tab
            ctx.lineTo(this.x, middleHeight + tabSizeH);
            ctx.quadraticCurveTo(this.x + (tabSizeW * multiple), middleHeight + (tabSizeH * 2), this.x + (tabSizeW * multiple), middleHeight)
            ctx.quadraticCurveTo(this.x + (tabSizeW * multiple), middleHeight - (tabSizeH * 2), this.x, middleHeight - tabSizeH)
        }
        ctx.lineTo(this.x, this.y);         // close Line
        
        // Close path
        ctx.closePath();
        ctx.stroke();     // Print line.
        
        ctx.clip();

        // TODO: Take the required image 
        ctx.drawImage(this.img, this.imgx, this.imgy, this.width, this.height, this.x, this.y, this.width, this.height);

        ctx.restore();
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
                
                // TODO: create tabsin the correct position.
                const piece = new PiecePuzzle(img, randomX, randomY, x * imgW, y * imgH, imgW, imgH, [
                    new Tab(PUZZLE_TABS_UP),
                    new Tab(PUZZLE_TABS_RIGHT),
                    new Tab(PUZZLE_TABS_DOWN),
                    new Tab(PUZZLE_TABS_LEFT, true)
                ]);
                data.push(piece)
            }
        }

        return data;
    }
}