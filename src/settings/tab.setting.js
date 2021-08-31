/**
 * TabSetting is to know when we need to create the tab for the puzzle
 */
export default class TabSetting{
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