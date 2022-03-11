import { PUZZLE_TABS } from "../const";
import {Rendereable2D} from "../engine/rendereable";

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

        this.tabs = tabs || [];

        this._row = row;
        this._column = column;
        

        // Drag & Drop functionality
        this.drag_drop = false;
        this.drag_drop_start_x = 0;
        this.drag_drop_start_y = 0;

        this._init();
    }

    get column(){
        return this._column;
    }
    get row(){
        return this._row;
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
        this.updateDifference();
        
        this.sw = (this.sx + this.width + this.tabSizeW < this.img.width ? this.width + this.tabSizeW : this.width) + this.dxDiff;
        this.sh = (this.sy + this.height + this.tabSizeH < this.img.height ? this.height + this.tabSizeH : this.height) + this.dyDiff;
    }

    updateDifference() {
        this.dx = this.x - this.dxDiff;
        this.dy = this.y - this.dyDiff;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;


        this.updateDifference();
    }

    /**
     * Set starting Drag & Drop
     */
    startDragAndDrop(x,y){
        this.drag_drop = true;

        this.drag_drop_start_x = this.x - x;
        this.drag_drop_start_y = this.y - y;
    }


    /**
     * Stop drag & drop.
     */
    clearDragAndDrop() {
        this.drag_drop = false;
        this.drag_drop_start_x = 0;
        this.drag_drop_start_y = 0;
    }


    render(ctx) {
        // TODO: Fix drag&drop differences of positions
        // Get calculation values
        const x = this.x//  + this.drag_drop_start_x;
        const y = this.y//  + this.drag_drop_start_y;

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

    /**
     * Check Touch collision, to know if we are touching the piece
     * @param {TouchPosition} touchPos 
     * @returns {boolean}
     */
     checkTouchColission(touchPos) {
        return (
            touchPos.getX() >= this.x && touchPos.getX() <= this.x + this.width &&
            touchPos.getY() >= this.y && touchPos.getY() <= this.y + this.height
        )
    }

    /**
     * Check Collision between Pieces
     * 
     * @param {PiecePuzzleRender} piece 
     * @returns {boolean}
     */
    checkPieceCollision(piece){
        if(
            ((this.row + 1 === piece.row || this.row - 1 === piece.row) && this.column === piece.column) || 
            ((this.column + 1 === piece.column || this.column - 1 === piece.column ) && this.row === piece.row)
        ){
            // check collision
            return (
                piece.x < this.x + this.width &&
                piece.x + piece.width > this.x &&
                piece.y < this.y + this.height &&
                piece.height + piece.y > this.y
            )
        }
        return false;
    }
}