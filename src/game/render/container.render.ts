import { BoxDragDrop } from "./boxDragDrop.render";
import { RENDEREABLE_TYPE } from "../../engine/rendereable";
import { PieceRender } from "./piece.render";
import { TouchPosition } from "../../engine/touch.event";

export class Container extends BoxDragDrop {
    private _pieces:PieceRender[] = [];
    
    constructor(pieces:PieceRender[] = []){
        super(RENDEREABLE_TYPE.CONTAINER);

        this._pieces = pieces;
        for (const piece of this._pieces) {
            piece.parent = this;
        }
    }

    render(ctx:CanvasRenderingContext2D){
        for (const piece of this._pieces) {
            piece.render(ctx);
        }
    }

    setPos(x:number, y:number) {
        super.setPos(x,y);
    }

    /**
     * Check collision in the pieces
     * @param {TouchPosition} touchPos 
     * @returns {boolean} 
     */
    checkTouchColission(touchPos:TouchPosition) {
        for (const piece of this._pieces) {
            if (
                touchPos.getX() >= (this.x + piece.x) && touchPos.getX() <= (this.x + piece.x + piece.width) &&
                touchPos.getY() >= (this.y + piece.y) && touchPos.getY() <= (this.y + piece.y + piece.height)
            ) return true;
        }
        return false;
    }

    // TODO: New version
    checkContainerCollision(container:Container):{collision: boolean, data?: any } {
        if(container.id === this.id) {collision: false};

        // TODO: move this inside of piece
        const checkBoundingBoxCollisionWithParent = (itemA:PieceRender, itemB:PieceRender) => (
            itemB.parent && itemA.parent &&
            itemB.x + itemB.parent.x < itemA.x + itemA.parent.x + itemA.width &&
            itemB.x + itemB.parent.x + itemB.width > itemA.x + itemA.parent.x &&
            itemB.y + itemB.parent.y < itemA.y+ itemA.parent.y + itemA.height &&
            itemB.height + itemB.y + itemB.parent.y > itemA.y + itemA.parent.y
        );


        // TODO: foreach vs for vs reverse while vs forEach().... maybe not important for this
        for (const piece of this._pieces) {
            for (const otherPiece of container.pieces) {
                const result = piece.tagInfo.check(otherPiece.tagInfo);
                if(result){

                    if(checkBoundingBoxCollisionWithParent(piece, otherPiece)){
                        //console.log("Collision:", otherPiece.tagInfo, "with static:", piece.tagInfo)
                        return {
                            collision: true,
                            data: {
                                current: {
                                    piece,
                                },
                                other: {
                                    piece: otherPiece,
                                    //tag: result,
                                    //side: otherPiece.tagInfo.getTagCollision(result)
                                }
                            }
                        }
                    }
                }
            }
        }

        return { collision: false }
    }

    addPiece(piece:PieceRender){
        //if(!(piece instanceof Rendereable2D)) return;

        piece.parent = this;
        this._pieces.push(piece);
    }

    get pieces(){
        return this._pieces;
    }

    removePiece(piece:PieceRender){
        //if(!(piece instanceof Rendereable2D)) return;

        const index = this._pieces.findIndex(q => q.id === piece.id);
        if(index >= 0){
            this._pieces.splice(index, 1);
            piece.parent = undefined;
        }
    }

    mergeGroup(group:Container|any){
        if(!(group instanceof Container)) return;

        for (const piece of group.pieces) {
            //group.pieces.removePiece(piece);

            this.addPiece(piece);
        }
    }
}