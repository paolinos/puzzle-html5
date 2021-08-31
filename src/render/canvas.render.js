export default class CanvasRender {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        //this.canvas.width = window.innerWidth;
        //this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext('2d');

        this.mouseDown = false;
        this.canvas.addEventListener("mousedown", this.onTouchDown.bind(this), false);
        this.canvas.addEventListener("mousemove", this.onTouchMove.bind(this), false);
        this.canvas.addEventListener("mouseup", this.onTouchUp.bind(this), false);
        this.canvas.addEventListener("mouseout", this.onTouchUp.bind(this), false);
        
    }

    /**
     * Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * @param {array of BaseRenderObject} obj 
     */
    render(obj = []) {
        // TODO: render only when is needed
        
        this.clear();

        for (const item of obj) {
            item.render(this.ctx);
        }       
    }

    onTouchDown(e) {
        //console.log("onTouchDown", e);
        this.mouseDown = true;
        
        if (!this.func) return;
        const rect = this.canvas.getBoundingClientRect();
        this.func(new TouchPosition(TOUCH_EVENT.DOWN, e.clientX -  rect.left, e.clientY - rect.top));
    }
    onTouchMove(e) {
        if (this.mouseDown) {
            //console.log("onTouchMove", e);

            if (!this.func) return;
            const rect = this.canvas.getBoundingClientRect();
            this.func(new TouchPosition(TOUCH_EVENT.MOVE, e.clientX -  rect.left, e.clientY - rect.top));
        }
    }
    onTouchUp(e) {
        if (!this.mouseDown) return;

        //console.log("onTouchUp", e);
        this.mouseDown = false;

        if (!this.func) return;
        const rect = this.canvas.getBoundingClientRect();
        this.func(new TouchPosition(TOUCH_EVENT.UP, e.clientX -  rect.left, e.clientY - rect.top));
    }


    addTouchEvent(func) {
        this.func = func;
    }
}