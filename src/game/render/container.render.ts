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
    checkTouchColission(touchPos:TouchPosition): boolean {
        for (const piece of this._pieces) {
            // Check if click is within the piece's bounding box
            const pieceLeft = this.x + piece.destination.x;
            const pieceTop = this.y + piece.destination.y;
            const pieceRight = pieceLeft + piece.destination.width;
            const pieceBottom = pieceTop + piece.destination.height;
            
            if (
                touchPos.getX() >= pieceLeft && 
                touchPos.getX() <= pieceRight &&
                touchPos.getY() >= pieceTop && 
                touchPos.getY() <= pieceBottom
            ) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check collision with another container
     * Only pieces with matching tags should collide
     * Collision is checked at piece level, not container level
     */
    checkContainerCollision(container:Container):{collision: boolean, data?: any } {
        if(container.id === this.id) return { collision: false };

        // Check each piece in this container against pieces in other container
        for (const piece of this._pieces) {
            for (const otherPiece of container.pieces) {
                // Only check if pieces are from different containers
                if (piece.parent === container) continue;
                
                // Calculate absolute positions for each piece
                const pieceLeft = this.x + piece.destination.x;
                const pieceTop = this.y + piece.destination.y;
                const pieceRight = pieceLeft + piece.destination.width;
                const pieceBottom = pieceTop + piece.destination.height;
                
                const otherPieceLeft = container.x + otherPiece.destination.x;
                const otherPieceTop = container.y + otherPiece.destination.y;
                const otherPieceRight = otherPieceLeft + otherPiece.destination.width;
                const otherPieceBottom = otherPieceTop + otherPiece.destination.height;
                
                // Check if bounding boxes overlap
                const boxesOverlap = !(
                    pieceRight < otherPieceLeft ||
                    pieceLeft > otherPieceRight ||
                    pieceBottom < otherPieceTop ||
                    pieceTop > otherPieceBottom
                );
                
                // Only allow collision if pieces have matching tags
                if (boxesOverlap) {
                    const result = piece.tagInfo.check(otherPiece.tagInfo);
                    if(result){
                        const tagData = otherPiece.tagInfo.getTagCollision(result.toString());
                        return {
                            collision: true,
                            data: {
                                current: {
                                    piece,
                                },
                                other: {
                                    piece: otherPiece,
                                    tag: tagData,
                                    side: tagData
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
