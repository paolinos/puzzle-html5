import { PUZZLE_TABS } from "../const";
import DragAndDropRenderDispatcher from "./draganddrop.render";

export default class PiecePuzzleRender extends DragAndDropRenderDispatcher {
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

        // TODO: implement this as event, when change the render engine
        //this.dragAndDrop = new DragAndDrop(x,y);
        this._init();
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
        // TODO: update drag & drop event
        /*
        this.dragAndDrop.update(x, y);
        
        this.x = this.dragAndDrop.getX();
        this.y = this.dragAndDrop.getY();
        */
        
        // TODO: implement drag & drop event
        this.x = x;
        this.y = y;

        // TODO: refactor here, repeated code
        this.toX = this.x + this.width;
        this.toY = this.y + this.height;
        this.middleWidth = this.x + (this.width * 0.5);
        this.middleHeight = this.y + (this.height * 0.5);

        this.updateDifference();
    }

    /**
     * Clear drag & drop. 
     * // TODO: remove this when object has drag & drop implementation directly
     */
    clearDragAndDrop() {
        //this.dragAndDrop.clear();
    }


    render(ctx) {
        if (!this.ready) return;

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
        tab = this.tabs.find(el => el.getPosition() === PUZZLE_TABS.UP);
        if (tab) {
            const multiple = tab.isInternal() ? 1 : -1;
            // Inside tab
            ctx.lineTo(middleWidth - tabSizeW, this.y);
            ctx.quadraticCurveTo(middleWidth - (tabSizeW*2), this.y + (tabSizeH * multiple), middleWidth, this.y + (tabSizeH * multiple))
            ctx.quadraticCurveTo(middleWidth + (tabSizeW*2), this.y + (tabSizeH * multiple), middleWidth + tabSizeW, this.y)
        }
        ctx.lineTo(toX, this.y);            // close Line    
        

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
        ctx.lineTo(this.x, toY);            // close Line
        

        // Left line
        tab = this.tabs.find(el => el.getPosition() === PUZZLE_TABS.LEFT);
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
    checkColission(touchPos) {
        return (
            touchPos.getX() >= this.x && touchPos.getX() <= this.x + this.width &&
            touchPos.getY() >= this.y && touchPos.getY() <= this.y + this.height
        )
    }
}