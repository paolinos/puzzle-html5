import { MainView } from "./views/main.view";
import { GameView } from "./views/game.view";

const onInit = async () => {

    const mainView = new MainView();
    const gameView = new GameView();

    mainView.onNext((data) => {        
        mainView.clear();
        gameView.start(data);
    });

    gameView.onNext(() => {
        gameView.clear();
        mainView.start();
    });
}   
onInit();