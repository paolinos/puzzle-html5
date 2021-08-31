import AutoIncrement from "../common/autoincrement.common";

/**
 * Base Rendereable Object
 */
export default class BaseObjectRender {
    constructor(ready=true) {
        this.ready = ready;
        this.id = AutoIncrement.getId();
    }

    render(ctx) {
        throw new Error("Not implemented");
    }

    /**
     * Is object ready
     * @returns {boolean}
     */
    isReady() {
        return this.ready;
    }
    
    /**
     * @returns {int} id
     */
    getId() {
        return this.id;
    }
}