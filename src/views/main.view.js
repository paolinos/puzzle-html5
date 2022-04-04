import { VALIDATION_INPUT_FILE_LENGTH, VALIDATION_INPUT_MIN_VALUE, VIEWS } from "../const";
import { GameSettings } from "../models/gameSettings";
import { View } from "./view";

/**
 * Validate input fields
 * @param {HTMLElement} horizontalInput 
 * @param {HTMLElement} verticalInput 
 * @param {HTMLElement} file 
 * @returns 
 */
const isValid = (horizontalInput, verticalInput, file) => {
 
    const h = parseInt(horizontalInput.value);
    const v = parseInt(verticalInput.value);
    return h >= VALIDATION_INPUT_MIN_VALUE && v >= VALIDATION_INPUT_MIN_VALUE && file.value.length > VALIDATION_INPUT_FILE_LENGTH
}

/**
 * Main/Setting view
 */
export class MainView extends View{

    constructor(visible=true){
        super(VIEWS.MAIN, "setting_view", visible);

        // Html elements
        this._horizontalInput = document.getElementById("horizontal-input");
        this._verticalInput = document.getElementById("vertical-input");
        this._file = document.getElementById("imageSrc");
        this._startBtn = document.getElementById("startBtn");
        this._errorMessage = document.getElementById("error-msg");

        this._startBtn.addEventListener("click", () => {
            if (this._fn) {
                
                this._updateErrorMessage();

                if(isValid(this._horizontalInput, this._verticalInput, this._file)){
                    this._fn(
                        new GameSettings({
                            image: this._file.files[0],
                            horizontal: parseInt(this._horizontalInput.value),
                            vertical: parseInt(this._verticalInput.value) 
                        })
                    );
                }else{
                    this._updateErrorMessage(true, "Input values are not correct. try again.");
                }
            }
        });
    }

    clear(){
        this._verticalInput.value = VALIDATION_INPUT_MIN_VALUE;
        this._verticalInput.value = VALIDATION_INPUT_MIN_VALUE;
        this._file.value = '';
        
        this.hide();
    }


    _updateErrorMessage(show=false, msg=""){
        this._errorMessage.style.display = show ? "block" : "none";
        this._errorMessage.innerHTML = msg;
    }
}