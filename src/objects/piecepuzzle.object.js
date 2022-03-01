import { PUZZLE_TABS } from "../const";
import PiecePuzzleRender from "../render/piecepuzzle.render";
import TabSetting from "../settings/tab.setting";

export default class PiecePuzzleObject extends PiecePuzzleRender{
    constructor(img, x,y, imgx, imgy, width, height, tags) {
        super(img, x, y, imgx, imgy, width, height, tags);
    }

    // TODO: move logic here

    /**
     * Cut image in pieces and returned a list of PiecePuzzleObject
     * @param {ImageRendering} image
     * @param {number} horizontal
     * @param {number} vertical
     * @returns {Array of PiecePuzzleObject} PiecePuzzleObject array
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
                const randomX = x * imgW;
                const randomY = y * imgH;

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