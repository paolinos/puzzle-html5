(function(){

  // Module Pattern
	var puzzleGame = (function(){
    //----------------------------
    //                  Variables
    var areas = {
      w:0,
      h:0
    }
    var stage = null;
    var gameCanvas = null;
    var imageObj = null;

    var puzzleObject = {
      horizontalPieces:0,
      verticalPieces:0,
      pieceWidth:0,
      pieceHeight:0,
      piecesArray:[],
      collisionArray:[]
    };

    var rendereableObj = {
      gameContainer:null,
      finalContainer:null
    };

    //----------------------------

    //----------------------------
    //                  Private Methods
    /*
     * Init Engine
     */
		var __initEngine = function(){
      gameCanvas = document.getElementById("game");
      stage = new createjs.Stage(gameCanvas);
      createjs.Ticker.setFPS(30);

      rendereableObj.gameContainer = new createjs.Container();
      stage.addChild(rendereableObj.gameContainer);
      //rendereableObj.gameContainer.visible = false;

      rendereableObj.finalContainer = new createjs.Container();
      stage.addChild(rendereableObj.finalContainer);
      rendereableObj.finalContainer.visible = false;
    }

    var __createShape = function(x,y,w,h){
	    var tmpShape = new createjs.Shape();
			tmpShape.graphics.beginFill("#ff0000")
				.drawRect(x, y, w, h);
      tmpShape.setBounds(x, y, w, h);
      tmpShape.visible = false;
      return tmpShape;
		}

    /*
     * Load puzzle image
     * @data Bitmap or source of the Url to load
     */
    var __loadImage = function(data){
      if(typeof data === 'string'){
        imageObj = new Image();
        imageObj.src = data;
        imageObj.onload = function(){
          __initGame();
        }
      }
      else{
        imageObj = data;
        __initGame();
      }
    }

    /*
     * Initialize Game and settings
     */
    var __initGame = function(){
      // Hardcode values
      puzzleObject.horizontalPieces = 4;
      puzzleObject.verticalPieces = 3;
      puzzleObject.pieceWidth = imageObj.width / puzzleObject.horizontalPieces;
      puzzleObject.pieceHeight = imageObj.height / puzzleObject.verticalPieces;
      puzzleObject.piecesArray = [];
      puzzleObject.collisionArray = [];

      var bmpTime = new createjs.Bitmap( imageObj );
      rendereableObj.finalContainer.addChild(bmpTime);
  		stage.update();

      __generatePuzzle();
      stage.update();
    }

    /*
     *  Create puzzle pieces and put in screen
     */
    var __generatePuzzle = function(){

      var piece = null;
      var pos = 0;
      var infoPiece = [];

      var width2 = puzzleObject.pieceWidth * 0.5;
      var height2 = puzzleObject.pieceHeight * 0.5;
      //	Create the dynamic jigsaw pieces
      for (var v = 0; v < puzzleObject.verticalPieces; v++)
      {
        for (var h = 0; h < puzzleObject.horizontalPieces; h++)
        {
          puzzleObject.collisionArray[pos] = [-1,-1,-1,-1];

          infoPiece = [0,0,0,0];

          // Panza Bottom
          if(v < puzzleObject.verticalPieces - 1 ){
            infoPiece[2] = 1;
            puzzleObject.collisionArray[pos][2] = pos + puzzleObject.horizontalPieces;
            //console.log("Collisiona Abajo con: " + collisionArray[pos][2]);
          }
          // Panza Top
          if(v != 0 && v < puzzleObject.verticalPieces ){
            infoPiece[0] = -1;
            puzzleObject.collisionArray[pos][0] = pos - puzzleObject.horizontalPieces;
            //console.log("Collisiona Arriba con: " + collisionArray[pos][0]);
          }
          // Panza Rigth
          if(h < puzzleObject.horizontalPieces - 1 ){
            infoPiece[1] = 1;
            puzzleObject.collisionArray[pos][1] = pos + 1;
            //console.log("Collisiona Derecha: " + collisionArray[pos][1]);
          }
          //	Panza Left
          if(h != 0 && h < puzzleObject.horizontalPieces ){
            infoPiece[3] = -1;
            puzzleObject.collisionArray[pos][3] = pos - 1;
            //console.log("Collisiona Izquierda: " + collisionArray[pos][3]);
          }

          piece = __createPiece( h * puzzleObject.pieceWidth,
                              v * puzzleObject.pieceHeight,
                              puzzleObject.pieceWidth,
                              puzzleObject.pieceHeight,
                              infoPiece);
          piece.collisions = puzzleObject.collisionArray[pos];
          piece.collisionsActive = []
          for (var z = 0; z < piece.collisions.length; z++) {
            //console.log(piece.collisions[z]);
            piece.collisionsActive[z] = piece.collisions[z] > -1 ? true : false;
          };

          rendereableObj.gameContainer.addChild(piece);
          //addListener(piece);

          piece.id = pos;
          piece.name = pos;
          puzzleObject.piecesArray[pos] = piece;
          pos++;

          //	Randoms positions
          piece.x = width2 + Math.random() * ( areas.w - 20 - width2);
          piece.y = height2 + Math.random() * ( areas.h - 20 - height2);
        }
      }
    }

    var __createPiece = function(x,y,w,h,data,combine){
  		var container = new createjs.Container();
  		var subContainer = new createjs.Container();
  		var shape = new createjs.Shape();

  		//container.addChild(shape);

  		subContainer.addChild(shape);
  		container.addChild(subContainer);

  		//	Array with collisions
  		container.col = [];

  		var w2 = w * 0.5;			//	La mitad del ancho
  		var h2 = h * 0.5;			//	La mitad del alto
  		//console.log("w2: " + w2 + " - h2: " + h2);
  		var inx = w2 * 0.25;		//	Un cuarto de la mitad. Esto es para restar o incrementar para generar la panza
  		var iny = h2 * 0.25;		//	Un cuarto de la mitad. Esto es para restar o incrementar para generar la panza
  		//inx = iny;
  		//console.log("inx: " + inx + " - iny: " + iny);
  		var wp = w2 * 0.25;			//	Aca sacamos 1/4 del ancho, para saber cuan ancho es la panza
  		var hp = h2 * 0.25;			//	Aca sacamos 1/4 del alto, para saber cuan alto es la panza

  		//	Check which value is bigger, and equal both to see a nice jigsaw.
  		if(wp > hp)
  			hp = wp
  		else
  			wp = hp;
  		//console.log("wp: " + wp + " - hp: " + hp);

  		if(combine == undefined)
  			combine = [0,0,0,0]
  		/*

  			http://www.w3schools.com/tags/canvas_quadraticcurveto.asp

  		*/
  		var g = new createjs.Graphics().beginBitmapFill(imageObj);
  		var sign = 1;
  		g.beginStroke("#FFF")
  			.moveTo(x,y);

  		var tmpX1 = 0;
  		var tmpY1 = 0;
  		var tmpX2 = 0;
  		var tmpY2 = 0;
  		var tmpW = 0;
  		var tmpH = 0;

  		//	Panza de arriba(Top) o linea
  		if(Math.abs(data[0]) == 1){
  			sign = data[0];
  			tmpX1 = x+w2-(inx*2);
  			tmpY1 = y-(hp*sign);
  			tmpW = x+w2;

  			g.lineTo(x+w2-inx,y)
  			.quadraticCurveTo(tmpX1,tmpY1,tmpW,tmpY1)
  			.quadraticCurveTo(x+w2+(inx*2),tmpY1,tmpW+inx,y);

  			container.col[0] = __createShape( tmpX1-5,
                                          y-5,
                                          (inx*4)+5,
                                          -((hp+10)*sign));
  			subContainer.addChild( container.col[0] );
  		}
  		g.lineTo(x+w,y);

  		//	Parte Derecha - Rigth Area
  		if(Math.abs(data[1]) == 1){
  			sign = data[1];

  			tmpX1 = x+w+(wp*sign);
  			tmpY1 = y+h2-(iny*2);
  			tmpW = x+w2;

  			g.lineTo(x+w,y+h2-iny)
  			.quadraticCurveTo(tmpX1,tmpY1,tmpX1,y+h2)
  			.quadraticCurveTo(tmpX1,y+h2+(iny*2),x+w,y+h2+iny);

  			container.col[1] = __createShape(x+w-5,tmpY1-5,((wp+10)*sign),(iny*4)+5);
  			subContainer.addChild( container.col[1] );
  		}
  		g.lineTo(x+w,y+h);

  		//	Abajo - Botton
  		if(Math.abs(data[2]) == 1){
  			sign = data[2];
  			tmpX1 = x+w2+(inx*2);
  			tmpX2 = x+w2-(inx*2);

  			g.lineTo(x+w2+inx,y+h)
  			.quadraticCurveTo(tmpX1,y+h+(hp*sign),x+w2,y+h+(hp*sign))
  			.quadraticCurveTo(tmpX2,y+h+(hp*sign),x+w2-inx,y+h);

  			container.col[2] = __createShape(tmpX2-5,y+h-5,(inx*4)+5,((hp+10)*sign));
  			subContainer.addChild( container.col[2] );
  		}
  		g.lineTo(x,y+h);

  		//	Izquierda - Left
  		if(Math.abs(data[3]) == 1){
  			sign = data[3];

  			g.lineTo(x,y+h2+iny)
  			.quadraticCurveTo(x-(wp*sign),y+h2+(iny*2),x-(wp*sign),y+h2)
  			.quadraticCurveTo(x-(wp*sign),y+h2-(iny*2),x,y+h2-iny);

  			container.col[3] = __createShape(x-5,y+h2-(iny*2)-5,-((wp+10)*sign),(iny*4)+5);
  			subContainer.addChild( container.col[3] );
  		}
  		g.lineTo(x,y)
  			.endStroke();

  		shape.graphics = g;


  		//*CHANGED*//
  		shape.setBounds(0,0,w,h);
  		subContainer.x = -x - w * 0.5;
  		subContainer.y = -y - h * 0.5;
  		//*-------*//

  		container.area = shape;
  		return container;
  	}

    var __checkInside = function(obj1, obj2){
  		if(
  			( obj1[0] >= obj2[0] && obj1[0] <= (obj2[0] + obj2[2]) ) &&
  			( obj1[1] >= obj2[1] && obj1[1] <= (obj2[1] + obj2[3]) )
  			)
  			return true;
  		return false;
  	}
    //----------------------------

    __initEngine();

		return {
      //----------------------------
      //                  Public Methods
			init : function(src){
        areas.w = window.innerWidth;
        areas.h = window.innerHeight;
        gameCanvas.width = areas.w;
        gameCanvas.height = areas.h;
        __loadImage(src);
			}
      //----------------------------
		}
	}());

  //
  puzzleGame.init("img/robot-kirobo.jpg");

  /*
  console.log( screen.width, screen.height );
  console.log( screen.availWidth, screen.availHeight );
  console.log( window.innerWidth, window.innerHeight );
  console.log( window.outerWidth, window.outerHeight );
  */
}());
