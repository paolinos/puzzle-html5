import { VALIDATION_INPUT_FILE_LENGTH, VALIDATION_INPUT_MIN_VALUE } from "./const";


export class InputData {
    constructor(file, horizontal, vertical) {
        this._imageFile = URL.createObjectURL(file);
        this._horizontal = horizontal;
        this._vertical = vertical;
    }

    /**
     * @returns {int} horizontal input 
     */
    getHorizontal() {
        return this._horizontal;
    }

    /**
     * @returns {int} vertical input 
     */
    getVertical() {
        return this._vertical;
    }

    /**
     * @returns {string} path to load local image
     */
    getImageFile() {
        return this._imageFile;
    }
}

export default class InputSettings {
    constructor() {
        this.func = null;

        this.horizontalInput = document.getElementById("horizontal-input");
        this.verticalInput = document.getElementById("vertical-input");
        
        this.file = document.getElementById("imageSrc");
        this.file.addEventListener("change", () => {

        }, false);

        this.startBtn = document.getElementById("startBtn");
        this.startBtn.addEventListener("click", () => {
            if (this.func) {
                console.log("this.horizontalInput:", this.horizontalInput.value, "this.verticalInput:", this.verticalInput.value,
                    "this.file:", this.file.value
                );

                const success = this.isValid();
                
                this.func(success , success ? this.getInput() : "Input values are not correct. try again.");
            }
        });

    }

    isValid() {
        // TODO: validation
        const h = parseInt(this.horizontalInput.value);
        const v = parseInt(this.verticalInput.value);
        return h >= VALIDATION_INPUT_MIN_VALUE && v >= VALIDATION_INPUT_MIN_VALUE && this.file.value.length > VALIDATION_INPUT_FILE_LENGTH
    }

    getInput() {
        const h = parseInt(this.horizontalInput.value);
        const v = parseInt(this.verticalInput.value);
        
        return new InputData(this.file.files[0], h, v);
    }

    addEventOnStart(func) {
        this.func = func;
    }

}