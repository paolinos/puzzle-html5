import { VIEWS } from "../const";
import PuzzleGame from "../game/puzzle.game";
import { View } from "./view";


export class GameView extends View{
    constructor(visible=false){
        super(VIEWS.GAME, "game_view", visible);

        const padding =  50;
        this.game = new PuzzleGame("drawArea", {
            width: window.innerWidth - padding,
            height: window.innerHeight - padding
        });

        this.game.onEnd(() => {
            if(this._fn) this._fn();
        })
    }

    start(inputSettings){
        this.show();
        
        this.game.load(inputSettings);
    }

    clear(){
        this.hide();

        this.game.clear();
    }
}