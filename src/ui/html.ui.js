/**
 * To update UI
 */
export default class HtmlUI{
    constructor() {
        this.timeTxt = document.getElementById("time");
        this.setTime();
    }

    setTime(value="") {
        this.timeTxt.innerHTML = value;
    }
}