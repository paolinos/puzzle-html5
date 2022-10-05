/**
 * Generate a printable version of puzzle
 */
import { View } from "./view";
import { VIEWS } from "../const";
import PuzzleGeneratorPrint from "../game/puzzle.generator-print";
import { IGameSettings } from "../models/gameSettings";

export class GeneratorView extends View{

    private readonly generator:PuzzleGeneratorPrint;
    private printBtn: HTMLElement;


    constructor(visible:boolean=false){
        super(VIEWS.GAME, "generator_view", visible);

        const padding =  50;
        this.generator = new PuzzleGeneratorPrint("generatorArea", {
            width: window.innerWidth - padding,
            height: window.innerHeight - padding
        });
        
        this.printBtn = document.getElementById("printBtn") as HTMLElement;
        this.printBtn.addEventListener("click", this._print.bind(this));
    }

    start(inputSettings:IGameSettings){
        this.show();
        
        this.generator.load(inputSettings);
    }

    clear(){
        this.hide();

        this.generator.clear();
    }

    // TODO: move this to tool 
    printImage(elem:HTMLImageElement)
    {
        const mywindow = window.open('', 'PRINT', `height=${elem.height},width=${elem.width}`) as any;

        mywindow.document.write('<html><head><title>print</title>');
        mywindow.document.write('</head><body >');
        //mywindow.document.write(document.getElementById(elem).innerHTML);
        mywindow.document.write('<image src="'+elem.src+'">');
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.print();
        mywindow.close();

        return true;
    }

    _print(){
        var img = document.createElement("img");
        img.src = this.generator.createImageFromCanvas();
        //document.body.appendChild(img);
        img.addEventListener("load", () => {
            this.printImage(img);
        });
    }
}