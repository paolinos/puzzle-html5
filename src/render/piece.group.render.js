import {Rendereable2D, RENDEREABLE_TYPE} from "../engine/rendereable";

/**
 * abstract class
 * DragAndDropRender to draggable object
 */
export class DragAndDropRender extends Rendereable2D{

    constructor(type){
        super(type);

        this._drag_drop = {
            active: false,
            diff_x: 0,
            diff_y: 0
        };
    }
    
    render(ctx){
        throw new Error("Not implemented");
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    startDragAndDrop(x,y){
        this._drag_drop.active = true;
        this._drag_drop.diff_x = x - this.x;
        this._drag_drop.diff_y = y - this.y;
    }

    clearDragAndDrop() {
        this._drag_drop.active = false;
        
        // Update x,y pos
        this.x -= this._drag_drop.diff_x;
        this.y -= this._drag_drop.diff_y;

        this._drag_drop.diff_x = 0;
        this._drag_drop.diff_y = 0;
    }

    isDragAndDrop(){
        return this._drag_drop.active;
    }
} 



export class GroupRender extends DragAndDropRender {
    _pieces = [];
    
    constructor(pieces = []){
        super(RENDEREABLE_TYPE.GROUP);

        this._pieces = pieces;
    }

    render(ctx){
        for (const piece of this._pieces) {
            piece.render(ctx);
        }
    }

    setPos(x, y) {
        super.setPos(x,y)

        // update childrens positions
        for (const piece of this._pieces) {
            piece.setPos(this.x - this._drag_drop.diff_x, this.y - this._drag_drop.diff_y);
        }
    }

    /**
     * Check Touch collision, to know if we are touching the piece
     * @param {TouchPosition} touchPos 
     * @returns {boolean}
     */
     checkTouchColission(touchPos) {
        for (const piece of this._pieces) {
            if (
                touchPos.getX() >= piece.x && touchPos.getX() <= piece.x + piece.width &&
                touchPos.getY() >= piece.y && touchPos.getY() <= piece.y + piece.height
            ) return true;
        }
        return false;
    }

    /**
     * Check Collision between Pieces
     * 
     * @param {PiecePuzzleRender} piece 
     * @returns {boolean}
     */
    checkPieceCollision(group){
        
        for (const piece of group.pieces) {
            for (const item of this._pieces) {
                if(
                    ((item.row + 1 === piece.row || item.row - 1 === piece.row) && item.column === piece.column) || 
                    ((item.column + 1 === piece.column || item.column - 1 === piece.column ) && item.row === piece.row)
                ){
                    // check collision
                    if(
                        piece.x < item.x + item.width &&
                        piece.x + piece.width > item.x &&
                        piece.y < item.y + item.height &&
                        piece.height + piece.y > item.y
                    ) return true;
                }
            }
        }
        return false;
    }


    addPiece(piece){
        if(!(piece instanceof Rendereable2D)) return;

        this._pieces.push(piece);
    }

    get pieces(){
        return this._pieces;
    }

    removePiece(piece){
        if(!(piece instanceof Rendereable2D)) return;

        const index = this._pieces.findIndex(q => q.id === piece.id);
        if(index >= 0){
            this._pieces.splice(index, 1);
        }
    }

    mergeGroup(group){
        console.log("mergeGroup - 1");
        if(!(group instanceof PieceGroupRender)) return;

        // TODO:
        console.log("mergeGroup - 2");
    }
}