import { PUZZLE_TABS } from "../../const";
import { ImagePosition } from "../models/imagePosition";
import { TagData, TagInfo } from "../models/tagInfo";
import { Container } from "../render/container.render";
import ImageRender from "../render/image.render";
import { PieceRender } from "../render/piece.render";

export default class PiecePuzzleTool{

    /**
     * Cut image in pieces and return a list of GroupRender
     * @param {ImageRendering} image
     * @param {number} horizontal horizontal/column
     * @param {number} vertical vertical/row
     * @returns {Array of GroupRender} GroupRender array
     */
    static createFromImage(image:ImageRender, horizontal:number, vertical:number, maxWidth:number, maxHeight:number) {
        const data:Container[] = [];

        const img = image.getImg();
        const imgW = img.width / horizontal;
        const imgH = img.height / vertical;

        // Calculate optimal piece size based on available space
        // Ensure pieces are visible and not too small
        const minPieceSize = Math.min(maxWidth, maxHeight) / (horizontal + vertical + 2);
        const scaledImgW = Math.min(imgW, minPieceSize);
        const scaledImgH = Math.min(imgH, minPieceSize);
        
        // Add some padding to make pieces more visible
        const padding = 5;
        const maxWidth = maxWidth - (padding * 2);
        const maxHeight = maxHeight - (padding * 2);

        for (let x = 0; x < horizontal; x++) {
            for (let y = 0; y < vertical; y++) {
                const imgX = x * scaledImgW;
                const imgY = y * scaledImgH;

                const name = (x+1) + (horizontal*y);
                const tags:number[] = [];
                const tagCollision:Record<string, TagData> = {};
                
                if(x > 0){
                    const tmp = name - 1;
                    tags.push(tmp);
                    tagCollision[PUZZLE_TABS.LEFT] = {
                        value: tmp,
                        isInternal: () => true
                    };
                }
                if(x+1 < horizontal){
                    const tmp = name + 1;
                    tags.push(tmp);
                    tagCollision[PUZZLE_TABS.RIGHT] = {
                        value: tmp,
                        isInternal: () => false
                    };
                }

                if(y > 0){
                    const tmp = name - vertical;
                    tags.push(tmp);
                    tagCollision[PUZZLE_TABS.UP] = {
                        value: tmp,
                        isInternal: () => true
                    }
                }
                if(y+1 < vertical){
                    const tmp = name + vertical;
                    tags.push(tmp);
                    tagCollision[PUZZLE_TABS.DOWN] = {
                        value: tmp,
                        isInternal: () => false
                    };
                }

                const container = new Container([
                    new PieceRender(img, 
                        new ImagePosition(imgX,imgY, scaledImgW, scaledImgH), 
                        new ImagePosition(imgX,imgY, scaledImgW, scaledImgH),
                        new TagInfo(name, tags, tagCollision)
                    )
                ]);

                // Set random position within available space
                const availableWidth = maxWidth - scaledImgW;
                const availableHeight = maxHeight - scaledImgH;
                const newX = Math.random() * availableWidth;
                const newY = Math.random() * availableHeight;
                container.setPos(newX,newY);
                data.push(container);
            }
        }

        return data;
    }


    // TODO: refactor here
    static createPrintableFromImage(image:ImageRender, horizontal:number, vertical:number) {
        const data:Container[] = [];

        const img = image.getImg();
        const imgW = img.width / horizontal;
        const imgH = img.height / vertical;
        console.log(`image size: ${img.width}x${img.height}`);

        const totalW = img.width + (imgW * 0.15 * horizontal);
        const totalH = img.height + (imgH * 0.20 * vertical);
        console.log(`totalW:${totalW} - totalH: ${totalH}`);

        for (let x = 0; x < horizontal; x++) {
            for (let y = 0; y < vertical; y++) {
                const imgX = x * imgW;
                const imgY = y * imgH;

                const name = (x+1) + (horizontal*y);
                const tags:number[] = [];
                const tagCollision:Record<string, TagData> = {};
                
                if(x > 0){
                    const tmp = name - 1;
                    tags.push(tmp);
                    tagCollision[PUZZLE_TABS.LEFT] = {
                        value: tmp,
                        isInternal: () => true
                    };
                }
                if(x+1 < horizontal){
                    const tmp = name + 1;
                    tags.push(tmp);
                    tagCollision[PUZZLE_TABS.RIGHT] = {
                        value: tmp,
                        isInternal: () => false
                    };
                }

                if(y > 0){
                    const tmp = name - vertical;
                    tags.push(tmp);
                    tagCollision[PUZZLE_TABS.UP] = {
                        value: tmp,
                        isInternal: () => true
                    }
                }
                if(y+1 < vertical){
                    const tmp = name + vertical;
                    tags.push(tmp);
                    tagCollision[PUZZLE_TABS.DOWN] = {
                        value: tmp,
                        isInternal: () => false
                    };
                }

                const container = new Container([
                    new PieceRender(img, 
                        new ImagePosition(imgX,imgY, imgW, imgH), 
                        new ImagePosition(imgX,imgY, imgW, imgH),
                        new TagInfo(name, tags, tagCollision)
                    )
                ]);

                console.log(`name: ${name} - img:{${imgX}, ${imgY}} - size:{${imgW}, ${imgH}}`);

                console.log(`imgW * x,imgH * y => x:${x}, y:${y}, ${imgW * x},${imgH * y}`);

                console.log(`container: `, container);

                //totalW += imgW + (x * imgW * 0.15);
                //totalH += imgH + (y * imgH * 0.20);

                container.setPos(x * imgW * 0.15, y * imgH * 0.20);
                data.push(container);
            }
        }

        return {data: data, width: totalW, height: totalH };
    }

}
