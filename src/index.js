import InputSettings from "./input.settings";
import PuzzleGame from "./puzzle.game";

const onInit = async () => {

    const settings = new InputSettings();
    settings.addEventOnStart((success, data) => {
        if (!success) {
            alert(data);
            return;
        }

        
        const game = new PuzzleGame("drawArea", data);
        game.start();

    });
}   
onInit();