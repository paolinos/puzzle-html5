import { PUZZLE_TABS } from "../const";
import {Rendereable2D, RENDEREABLE_TYPE} from "../engine/rendereable";

// TODO: Review,Clean,Refactor this

export default class PiecePuzzleRender extends Rendereable2D {
    /**
     * 
     * @param {Image} img 
     * @param {int} x Position X in the canvas
     * @param {int} y Position y in the canvas
     * @param {int} imgx
     * @param {int} imgy
     * @param {int} width 
     * @param {int} height 
     * @param {array of Tabs} tabs tabs to each position to create
     */
    constructor(img, x, y, imgx, imgy, width, height, tabs, row, column) {
        super(RENDEREABLE_TYPE.PIECE);

        this.img = img;

        //  Position of the piece
        this.x = x;
        this.y = y;

        // Rendering settings
        this.imgx = imgx;
        this.imgy = imgy;
        this._width = width;
        this._height = height;

        this.tabs = tabs || [];

        this._row = row;
        this._column = column;
        
        this._init();
    }

    get column(){
        return this._column;
    }
    get row(){
        return this._row;
    }

    get width(){
        return this._width;
    }

    get height(){
        return this._height;
    }

    /**
     * Private method to calculate interval props
     */
    _init() {
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

        // Calculate area to take the image and render.
        //  as we have tabs, we need to take more space to the image.
        //  -----------
        //  | ------- |
        //  | |Image| |
        //  | |     | |
        //  | ------- |
        //
        
        this.dxDiff = 0;
        if (this.imgx - this.tabSizeW > 0) {
            this.dxDiff = this.tabSizeW;
        }
        this.dyDiff = 0;
        if (this.imgy - this.tabSizeH > 0) {
            this.dyDiff = this.tabSizeH;            
        }
        
        this.sx = this.imgx - this.dxDiff;
        this.sy = this.imgy - this.dyDiff;

        this.sw = (this.sx + this.width + this.tabSizeW < this.img.width ? this.width + this.tabSizeW : this.width) + this.dxDiff;
        this.sh = (this.sy + this.height + this.tabSizeH < this.img.height ? this.height + this.tabSizeH : this.height) + this.dyDiff;

        this._updateDifference();
    }

    _updateDifference() {
        this.dx = this.x - this.dxDiff;
        this.dy = this.y - this.dyDiff;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;

        this._updateDifference();
    }


    render(ctx) {
        // Get calculation values
        const x = this.x;
        const y = this.y;

        const toX = x + this.width;
        const toY = y + this.height;
        const middleWidth = x + (this.width * 0.5);
        const middleHeight = y + (this.height * 0.5);
        const tabSizeW = this.tabSizeW;
        const tabSizeH = this.tabSizeW;

        // Tab to find
        let tab = null;

        ctx.save();

        ctx.beginPath();
        // Move to x,y position
        ctx.moveTo(x, y);

        // TOP Line
        tab = this.tabs.find(el => el.getPosition() === PUZZLE_TABS.UP);
        if (tab) {
            const multiple = tab.isInternal() ? 1 : -1;
            // Inside tab
            ctx.lineTo(middleWidth - tabSizeW, y);
            ctx.quadraticCurveTo(middleWidth - (tabSizeW*2), y + (tabSizeH * multiple), middleWidth, y + (tabSizeH * multiple))
            ctx.quadraticCurveTo(middleWidth + (tabSizeW*2), y + (tabSizeH * multiple), middleWidth + tabSizeW, y)
        }
        ctx.lineTo(toX, y);            // close Line    
        

        // Right Line
        tab = this.tabs.find(el => el.getPosition() === PUZZLE_TABS.RIGHT);
        if (tab) {
            const multiple = tab.isInternal() ? -1 : 1;
            // Inside tab
            ctx.lineTo(toX, middleHeight - tabSizeH);
            ctx.quadraticCurveTo(toX + (tabSizeW * multiple), middleHeight - (tabSizeH * 2), toX + (tabSizeW * multiple), middleHeight)
            ctx.quadraticCurveTo(toX + (tabSizeW * multiple), middleHeight + (tabSizeH * 2), toX, middleHeight + tabSizeH)
        }
        ctx.lineTo(toX, toY);               // close Line
        
        
        // Bottom line
        tab = this.tabs.find(el => el.getPosition() === PUZZLE_TABS.DOWN);
        if (tab) {
            const multiple = tab.isInternal() ? -1 : 1;
            // Inside tab
            ctx.lineTo(middleWidth + tabSizeW, toY);
            ctx.quadraticCurveTo(middleWidth + (tabSizeW*2), toY + (tabSizeH * multiple), middleWidth, toY + (tabSizeH * multiple))
            ctx.quadraticCurveTo(middleWidth - (tabSizeW*2), toY + (tabSizeH * multiple), middleWidth - tabSizeW, toY)
        }
        ctx.lineTo(x, toY);            // close Line
        

        // Left line
        tab = this.tabs.find(el => el.getPosition() === PUZZLE_TABS.LEFT);
        if (tab) {
            const multiple = tab.isInternal() ? 1 : -1;
            // Inside tab
            ctx.lineTo(x, middleHeight + tabSizeH);
            ctx.quadraticCurveTo(x + (tabSizeW * multiple), middleHeight + (tabSizeH * 2), x + (tabSizeW * multiple), middleHeight)
            ctx.quadraticCurveTo(x + (tabSizeW * multiple), middleHeight - (tabSizeH * 2), x, middleHeight - tabSizeH)
        }
        ctx.lineTo(x, y);         // close Line
        
        // Close path
        ctx.closePath();
        ctx.stroke();     // Print line.
        
        // Create the mask for the image
        ctx.clip();

        // Draw Image
        ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.sw, this.sh);

        ctx.restore();
    }
}