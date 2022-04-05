import { PUZZLE_TABS } from "../../const";
import { Rendereable2D, RENDEREABLE_TYPE } from "../../engine/rendereable";
import { ImagePosition } from "../models/imagePosition";
import { TagInfo } from "../models/tagInfo";

export class PieceRender extends Rendereable2D{

    constructor(img, source, destination, tagInfo){
        super(RENDEREABLE_TYPE.PIECE);

        if(!(
            source instanceof ImagePosition || 
            destination instanceof ImagePosition ||
            tags instanceof TagInfo
            )
        ) throw new Error("Wrong implementation");
        
        this.img = img;
        this.source = source;
        this.destination = destination;
        this.tagInfo = tagInfo;

        this.parent = null;

        
        // calculate tab sizes.
        this.tabSizeW = this.width * 0.10; // 10 percent
        this.tabSizeH = this.height * 0.10; // 10 percent
        if (this.tabSizeW > this.tabSizeH) {
            this.tabSizeH = this.tabSizeW;
        } else {
            this.tabSizeW = this.tabSizeH;
        }
    }

    get x(){ return this.destination.x; }
    set x(value){ this.destination.x = value; }

    get y(){ return this.destination.y; }
    set y(value){ this.destination.y = value; }

    get width(){ return this.destination.width; }
    get height(){ return this.destination.height; }

    render(ctx){
        // Get calculation values
        let x = this.x;
        let y = this.y;
        if(this.parent){
            x += this.parent.x;
            y += this.parent.y;
        }

        const toX = x + this.width;
        const toY = y + this.height;
        const middleWidth = x + (this.width * 0.5);
        const middleHeight = y + (this.height * 0.5);
        const tabSizeW = this.tabSizeW;
        const tabSizeH = this.tabSizeW;

        //console.log();

        // Tab to find
        let tab = null;

        ctx.save();

        ctx.beginPath();
        // Move to x,y position
        ctx.moveTo(x, y);

        // TOP Line
        tab = this.tagInfo.getTagCollision(PUZZLE_TABS.UP);
        if (tab) {
            const multiple = tab.isInternal() ? 1 : -1;
            // Inside tab
            ctx.lineTo(middleWidth - tabSizeW, y);
            ctx.quadraticCurveTo(middleWidth - (tabSizeW*2), y + (tabSizeH * multiple), middleWidth, y + (tabSizeH * multiple))
            ctx.quadraticCurveTo(middleWidth + (tabSizeW*2), y + (tabSizeH * multiple), middleWidth + tabSizeW, y)
        }
        ctx.lineTo(toX, y);            // close Line    
        

        // Right Line
        tab = this.tagInfo.getTagCollision(PUZZLE_TABS.RIGHT);
        if (tab) {
            const multiple = tab.isInternal() ? -1 : 1;
            // Inside tab
            ctx.lineTo(toX, middleHeight - tabSizeH);
            ctx.quadraticCurveTo(toX + (tabSizeW * multiple), middleHeight - (tabSizeH * 2), toX + (tabSizeW * multiple), middleHeight)
            ctx.quadraticCurveTo(toX + (tabSizeW * multiple), middleHeight + (tabSizeH * 2), toX, middleHeight + tabSizeH)
        }
        ctx.lineTo(toX, toY);               // close Line
        
        
        // Bottom line
        tab = this.tagInfo.getTagCollision(PUZZLE_TABS.DOWN);
        if (tab) {
            const multiple = tab.isInternal() ? -1 : 1;
            // Inside tab
            ctx.lineTo(middleWidth + tabSizeW, toY);
            ctx.quadraticCurveTo(middleWidth + (tabSizeW*2), toY + (tabSizeH * multiple), middleWidth, toY + (tabSizeH * multiple))
            ctx.quadraticCurveTo(middleWidth - (tabSizeW*2), toY + (tabSizeH * multiple), middleWidth - tabSizeW, toY)
        }
        ctx.lineTo(x, toY);            // close Line
        

        // Left line
        tab = this.tagInfo.getTagCollision(PUZZLE_TABS.LEFT);
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
        ctx.stroke();           // Print line.
        
        // Create the mask for the image
        ctx.clip();

        // Draw Image
        ctx.drawImage(
            this.img, 
            this.source.x, this.source.y, this.source.width + this.tabSizeW, this.source.height + this.tabSizeH, 
            x, y, this.destination.width + this.tabSizeW, this.destination.height + this.tabSizeH
        );

        ctx.restore();
    }
}