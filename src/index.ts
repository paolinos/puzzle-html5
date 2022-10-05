import { IView } from "./views/view";
import { MainView } from "./views/main.view";
import { GameView } from "./views/game.view";
import { GeneratorView } from "./views/generator.view";
import { VIEWS } from "./const"
import { IGameSettings } from "./models/gameSettings";

const onInit = async () => {

    console.log("on init");

    const mainView:IView = new MainView();
    const gameView:IView = new GameView();
    const generatorView:IView = new GeneratorView();

    mainView.onNext((data?:IGameSettings, type?:string) => {

        if(!data || !type){
            throw new Error("Unexpected behavior");
        }

        mainView.clear();

        if(type === VIEWS.GAME){
            gameView.start(data);
        }else {
            generatorView.start(data);   
        }
    });

    const goToMain = () => {
        gameView.clear();
        generatorView.clear();

        mainView.start();
    }
    gameView.onNext(goToMain);
    generatorView.onNext(goToMain);
}   
onInit();