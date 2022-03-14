import { PUZZLE_TABS } from "../const";
import { GroupRender } from "../render/piece.group.render";
import PiecePuzzleRender from "../render/piecepuzzle.render";
import TabSetting from "../settings/tab.setting";

export default class PiecePuzzleTool{

    /**
     * Cut image in pieces and return a list of GroupRender
     * @param {ImageRendering} image
     * @param {number} horizontal horizontal/column
     * @param {number} vertical vertical/row
     * @returns {Array of GroupRender} GroupRender array
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

                const group = new GroupRender([new PiecePuzzleRender(img, 0, 0, x * imgW, y * imgH, imgW, imgH, tabs, x, y)]);
                group.setPos(randomX, randomY);
                data.push(group);
            }
        }

        return data;
    }
}