import { VIEWS } from "../const";
import PuzzleGame, { GAME_EVENTS } from "../game/puzzle.game";
import { IGameSettings } from "../models/gameSettings";
import { View } from "./view";


export class GameView extends View{

    private timeTxt:HTMLInputElement;
    private game:PuzzleGame;

    constructor(visible=false){
        super(VIEWS.GAME, "game_view", visible);

        this.timeTxt = document.getElementById("time") as HTMLInputElement;

        const padding =  50;
        this.game = new PuzzleGame("drawArea", {
            width: window.innerWidth - padding,
            height: window.innerHeight - padding
        });

        this.game.onEvent((event, data) => {
            if(event === GAME_EVENTS.UPDATE_UI){
                this.timeTxt.innerHTML = data;
            }else if(event === GAME_EVENTS.END){

                // Wait 5seconds and continue
                setTimeout(() => {
                    if(this._fn) this._fn();
                }, 5000);
            }
        })
    }

    start(inputSettings:IGameSettings){
        this.show();
        
        this.game.load(inputSettings);
    }

    clear(){
        this.hide();

        this.game.clear();
    }
}