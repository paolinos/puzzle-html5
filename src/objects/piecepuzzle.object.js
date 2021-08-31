import { PUZZLE_TABS } from "../const";
import PiecePuzzleRender from "../render/piecepuzzle.render";
import TabSetting from "../settings/tab.setting";

export default class PiecePuzzleObject extends PiecePuzzleRender{
    constructor(img, x,y, imgx, imgy, width, height, tags) {
        super(img, x, y, imgx, imgy, width, height, tags);
    }

    // TODO: move logic here

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
                // TODO: Calculate random positions
                const randomX = x * imgW //Math.random() * img.width;
                const randomY = y * imgH //Math.random() * img.height;

                let tabs = [];
                if (x !== 0) {
                    tabs.push(new TabSetting(PUZZLE_TABS.LEFT, true));
                }
                if (y !== 0) {
                    tabs.push(new TabSetting(PUZZLE_TABS.UP, true));
                }
                if (x + 1 < horizontal) {
                    tabs.push(new TabSetting(PUZZLE_TABS.RIGHT));
                }
                if (y + 1 < vertical) {
                    tabs.push(new TabSetting(PUZZLE_TABS.DOWN));
                }

                data.push(new PiecePuzzleObject(img, randomX, randomY, x * imgW, y * imgH, imgW, imgH, tabs));
            }
        }

        return data;
    }
}