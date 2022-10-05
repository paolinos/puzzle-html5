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
const isValid = (horizontalInput:HTMLInputElement, verticalInput:HTMLInputElement, file:HTMLInputElement) => {
 
    const h = parseInt(horizontalInput.value);
    const v = parseInt(verticalInput.value);
    return h >= VALIDATION_INPUT_MIN_VALUE && v >= VALIDATION_INPUT_MIN_VALUE && file.value.length > VALIDATION_INPUT_FILE_LENGTH
}

/**
 * Main/Setting view
 */
export class MainView extends View{
    private _horizontalInput: HTMLInputElement;
    private _verticalInput: HTMLInputElement;
    private _file: HTMLInputElement;
    private _startBtn: HTMLElement;
    private _generateBtn: HTMLElement;
    private _errorMessage: HTMLElement;

    constructor(visible=true){
        super(VIEWS.MAIN, "setting_view", visible);

        // Html elements
        this._horizontalInput = document.getElementById("horizontal-input") as HTMLInputElement;
        this._verticalInput = document.getElementById("vertical-input") as HTMLInputElement;
        this._file = document.getElementById("imageSrc") as HTMLInputElement;
        this._startBtn = document.getElementById("startBtn") as HTMLElement;
        this._generateBtn = document.getElementById("generateBtn") as HTMLElement;
        this._errorMessage = document.getElementById("error-msg") as HTMLElement;


        this._startBtn.addEventListener("click", () => { this._validateInputs(VIEWS.GAME) });

        this._generateBtn.addEventListener("click", () => { this._validateInputs(VIEWS.GENERATOR) });

        //this.clear();
    }

    clear(){
        this._horizontalInput.value = VALIDATION_INPUT_MIN_VALUE.toString();
        this._verticalInput.value = VALIDATION_INPUT_MIN_VALUE.toString();
        this._file.value = "";

        this.hide();
    }


    _updateErrorMessage(show=false, msg=""){
        this._errorMessage.style.display = show ? "block" : "none";
        this._errorMessage.innerHTML = msg;
    }

    private _validateInputs(type:VIEWS) {
        if (this._fn) {
                
            this._updateErrorMessage();

            if(isValid(this._horizontalInput, this._verticalInput, this._file)){
                this._fn(
                    new GameSettings({
                        image: this._file.files![0],
                        horizontal: parseInt(this._horizontalInput.value),
                        vertical: parseInt(this._verticalInput.value) 
                    }),
                    type 
                );
            }else{
                this._updateErrorMessage(true, "Input values are not correct. try again.");
            }
        }
    }
}