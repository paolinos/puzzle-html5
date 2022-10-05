import { MainView } from "./views/main.view";
import { GameView } from "./views/game.view";
import { GeneratorView } from "./views/generator.view";
import { VIEWS } from "./const";

const onInit = async () => {

    const mainView = new MainView();
    const gameView = new GameView();
    const generatorView = new GeneratorView();

    mainView.onNext((data, type) => {        
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