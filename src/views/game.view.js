import { VIEWS } from "../const";
import PuzzleGame from "../game/puzzle.game";
import { View } from "./view";


export class GameView extends View{
    constructor(visible=false){
        super(VIEWS.GAME, "game_view", visible);

        this.game = new PuzzleGame("drawArea");
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