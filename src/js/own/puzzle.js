(function(){

  // Module Pattern
	var puzzleGame = (function(){
    //----------------------------
    //                  Variables
    var area = {
      w:0,
      h:0
    }
    var stage = null;
    var gameCanvas = null;
    var imageObj = null;
    var txtTime = null;

    var scaleEnable = false;

    var puzzleObject = {
      horizontalPieces:0,
      verticalPieces:0,
      pieceWidth:0,
      pieceHeight:0,
      width2:0,   // pieceWidth * 0.5
      height2:0,  // pieceHeight * 0.5
      piecesArray:[],
      collisionArray:[],
      groups:[],
      minScale:0.8,
      maxScale:0.9
    };

    var rendereableObj = {
      gameContainer:null,
      finalContainer:null
    };

    var gameOption = {
      startTime: 0,
      currentTime: 0,
      tempTime:0
    };

    var tipe = 0;
    //----------------------------

    //----------------------------
    //                  Private Methods
    /*
     * Init Engine
     */
		var __initEngine = function(){
      gameCanvas = document.getElementById("game");
      stage = new createjs.Stage(gameCanvas);

      rendereableObj.gameContainer = new createjs.Container();
      stage.addChild(rendereableObj.gameContainer);
      //rendereableObj.gameContainer.visible = false;

      rendereableObj.finalContainer = new createjs.Container();
      stage.addChild(rendereableObj.finalContainer);
      //rendereableObj.finalContainer.visible = false;

      txtTime = new createjs.Text("0", "32px Sans Bold", "#FFF");
  		txtTime.x = 505;
  		txtTime.y = 38;
  		txtTime.lineWidth = 105;
  		txtTime.textAlign = "right";
  		txtTime.textBaseline = "alphabetic";
      rendereableObj.finalContainer.addChild(txtTime);
    }

    var __renderStart = function(){
      createjs.Ticker.setFPS(30);
      createjs.Ticker.addEventListener("tick", __renderUpdate);
    }
    /*
     *
     */
    var __renderUpdate = function(ev){
      gameOption.tempTime = new Date().getTime();
      gameOption.currentTime = Math.round( (gameOption.tempTime - gameOption.startTime) * 0.001 );

      var sg = 0, minut=0;
    	if(tipe==1){
				if(gameOption.currentTime < 60){
					gameOption.currentTime = "00:"+__renderStr(gameOption.currentTime);
				}
				else
				{
					sg = gameOption.currentTime % 60;
					minut = gameOption.currentTime / 60;
					gameOption.currentTime = __renderStr(Math.round(minut))+":"+__renderStr(sg);
				}
      	txtTime.text = gameOption.currentTime;
      	stage.update(ev);
    	}else if(tipe==0){
    		if( gameOption.currentTime >= 4 ){

          /*
    			screenEnd.removeAllChildren();

    			bmpTime = new createjs.Bitmap( H.m02 )
    			bmpTime.x =360; bmpTime.y = 4;
    			screenEnd.addChild(bmpTime);
    			screenEnd.addChild(txtTime);
    			//bmpTime.image = H.m02;
    			screenGame.visible = true;
          */

    			tipe = 1;
    			gameOption.startTime = new Date().getTime();
    		}
    	}
      else{
        if( gameOption.currentTime >= 3 ){
          rendereableObj.finalContainer.removeAllChildren();
        	__renderStop();
    		}
    	}
    }
    var __renderStop = function(){
      createjs.Ticker.removeEventListener("tick", __renderUpdate);
    }

    var __createShape = function(x,y,w,h){
	    var tmpShape = new createjs.Shape();
			tmpShape.graphics.beginFill("#ff0000")
				.drawRect(x, y, w, h);
      tmpShape.setBounds(x, y, w, h);
      tmpShape.visible = false;
      return tmpShape;
		}
    var __renderStr = function(value){
			if(value > 9)
				return value;
			return "0"+value;
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
      //rendereableObj.finalContainer.addChild(bmpTime);

      //
      __generatePuzzle();

      // Start render
      __renderStart();
    }

    /*
     *  Create puzzle pieces and put in screen
     */
    var __generatePuzzle = function(){

      var piece = null;
      var pos = 0;
      var infoPiece = [];

      puzzleObject.width2 = puzzleObject.pieceWidth * 0.5;
      puzzleObject.height2 = puzzleObject.pieceHeight * 0.5;
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
            //console.log("Collisiona Derecha - Right Collision: " + collisionArray[pos][1]);
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
          __addPieceListener(piece);

          piece.id = pos;
          piece.name = pos;
          puzzleObject.piecesArray[pos] = piece;
          pos++;

          //	Randoms positions
          piece.x = puzzleObject.width2 + Math.random() * ( area.w - 20 - puzzleObject.width2);
          piece.y = puzzleObject.height2 + Math.random() * ( area.h - 20 - puzzleObject.height2);
        }
      }
    }

    /*
     *  Create piece
     * @x
     * @y
     * @w
     * @h
     * @data
     * @combine
     */
    var __createPiece = function(x,y,w,h,data,combine){

  		var container = new createjs.Container();
  		var subContainer = new createjs.Container();
  		var shape = new createjs.Shape();

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

        https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes#Quadratic_Bezier_curves
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

    var __addPieceListener = function(value){
      value.moving = false;
      value.group = -1;
      value.addEventListener("mousedown", function(evt) {
          // bump the target in front of its siblings:
          var o = evt.target.parent.parent;
          //console.log(o.parent);
          o.parent.addChild(o);
          o.offset = {x:o.x-evt.stageX, y:o.y-evt.stageY};
      });
      value.addEventListener("pressup", function(evt) {
        var o = evt.target.parent.parent;
        if(o.moving){
          o.moving = false;
          if(scaleEnable){
            o.scaleX = puzzleObject.minScale;
            o.scaleY = puzzleObject.minScale;
          }

          //  Check Mouse movement
          __checkMovement(o);
        }
      });

      // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
      value.addEventListener("pressmove", function(evt) {
        var o = evt.target.parent.parent;
        o.x = evt.stageX+ o.offset.x;
        o.y = evt.stageY+ o.offset.y;

        //	Check inside
        if(o.x < puzzleObject.width2 ){
          o.x = puzzleObject.width2;
        }else if((o.x + puzzleObject.width2) > area.w ){
          o.x = area.w - puzzleObject.width2;
        }

        if(o.y < puzzleObject.height2 ){
          o.y = puzzleObject.height2;
        }else if((o.y + puzzleObject.height2) > area.h ){
          o.y = area.h - puzzleObject.height2;
        }

        if(scaleEnable){
          o.scaleX = puzzleObject.maxScale;
          o.scaleY = puzzleObject.maxScale;
        }

        rendereableObj.gameContainer.setChildIndex(o, rendereableObj.gameContainer.getNumChildren() - 1);

        if(o.group >= 0){
          var tmpAr = puzzleObject.groups[o.group];
          var tmpPiece;
          var sums = [0,0];
          var sumsO = __getSums(o.id);

          for (var i = tmpAr.length - 1; i >= 0; i--) {
            if(o.id != tmpAr[i]){
              tmpPiece = puzzleObject.piecesArray[tmpAr[i]];
              sums = __getSums(tmpAr[i]);
              tmpPiece.scaleX = o.scaleX;
              tmpPiece.scaleY = o.scaleY;
              tmpPiece.x = o.x + (puzzleObject.pieceWidth * (sums[0] - sumsO[0] )* tmpPiece.scaleX);
              tmpPiece.y = o.y + (puzzleObject.pieceHeight * (sums[1] - sumsO[1])* tmpPiece.scaleY);
              rendereableObj.gameContainer.setChildIndex(tmpPiece, rendereableObj.gameContainer.getNumChildren() - 1);
            }
          };
        }
      o.moving = true;
      // indicate that the stage should be updated on the next tick:
      update = true;
      });
    }

    /*
     *
     */
    var __getSums = function(value){
      var tmp = [0,0];
      while(value >= puzzleObject.horizontalPieces){
        value -= puzzleObject.horizontalPieces;
        tmp[1]++;
      }
      tmp[0] = value;
      return tmp;
    }

    /*
     *  
     */
    var __checkMovement = function(obj){
      var tmpCol1 = null;
      var tmpCol2 = null;

      for (var j = obj.collisions.length - 1; j >= 0; j--){
        if(obj.collisionsActive[j]){
          var tmpObj = puzzleObject.piecesArray[obj.collisions[j]];
          tmpCol1 = obj.col[j]
          var inc = -1;
          switch(j){
            case 0:
              inc = 2;
              break;
            case 1:
              inc = 3;
              break;
            case 2:
              inc = 0;
              break;
            case 3:
              inc = 1;
              break;
          }
          tmpCol2 = tmpObj.col[inc];
          if(tmpCol2==null){
            //console.log("Error");
            //console.log(tmpCol2);
            break;
          }

          //	Check collision, using parent collisions
          if( __checkCollision( tmpCol1, tmpCol2 ) ){
            obj.collisionsActive[j] = false;
            tmpObj.collisionsActive[inc] = false;

            if(scaleEnable){
              tmpObj.scaleX = obj.scaleX = puzzleObject.minScale;
              tmpObj.scaleY = obj.scaleY = puzzleObject.minScale;
            }
            obj.x = tmpObj.x;
            obj.y = tmpObj.y;

            switch(j){
              case 0:
                obj.y = tmpObj.y + (puzzleObject.pieceHeight * tmpObj.scaleY);
                break;
              case 1:
                obj.x = tmpObj.x - (puzzleObject.pieceWidth * tmpObj.scaleX);
                break;
              case 2:
                obj.y = tmpObj.y - (puzzleObject.pieceHeight * tmpObj.scaleY);
                break;
              case 3:
                obj.x = tmpObj.x + (puzzleObject.pieceWidth * tmpObj.scaleX);
                break;
            }

            rendereableObj.gameContainer.setChildIndex(obj,0);
            rendereableObj.gameContainer.setChildIndex(tmpObj,0);

            if( tmpObj.group < 0 ){
              tmpObj.group = puzzleObject.groups.length;
              puzzleObject.groups[tmpObj.group] = [];
              __addToGroup(tmpObj.group,tmpObj.name);
            }

            if( obj.group >= 0 ){
              if(obj.group != tmpObj.group){
                var tmpPos = obj.group;
                var tmpAr = puzzleObject.groups[obj.group];

                for (var i = tmpAr.length - 1; i >= 0; i--) {
                  var tmpPiece = puzzleObject.piecesArray[tmpAr[i]];
                  tmpPiece.group = tmpObj.group;
                  __addToGroup(tmpObj.group,tmpPiece.name);
                  rendereableObj.gameContainer.setChildIndex(tmpPiece,0);
                };

                //	Reseteo el grupo anterior
                puzzleObject.groups[tmpPos] = [];
              }
            }

            obj.group = tmpObj.group;
            __addToGroup(tmpObj.group,obj.name);

            update = true;
            //	Check Game End
            if( puzzleObject.groups[tmpObj.group].length >= (puzzleObject.horizontalPieces * puzzleObject.verticalPieces) ){
              //console.log("Game Over!!!");
              //TODO: DELETE this
              //CallService(function(ev){},3);

              tipe = 3;
              rendereableObj.gameContainer.removeAllChildren();
              var tmpImg = new createjs.Bitmap( imageObj );
              rendereableObj.gameContainer.addChild(tmpImg);
              startTime = new Date().getTime();
              stage.update();
            }
          }else{
            /*if(scaleEnable){
              tmpObj.scaleX = obj.scaleY = minScale;
            }*/
          }
        }
      }
      __updatePiece(obj);
    }

    var __checkCollision = function(object1, object2){
  		var rect1 = object1.getBounds();
  		var rect2 = object2.getBounds();

  		var obj1 = new Object();
  		obj1.x = object1.x + rect1.x + object1.parent.x + object1.parent.parent.x;
  		obj1.y = object1.y + rect1.y + object1.parent.y + object1.parent.parent.y;
  		obj1.w = rect1.width;
  		obj1.h = rect1.height;

  		var obj2 = new Object();
  		obj2.x = object2.x + rect2.x + object2.parent.x + object2.parent.parent.x;
  		obj2.y = object2.y + rect2.y + object2.parent.y + object2.parent.parent.y;
  		obj2.w = rect2.width;
  		obj2.h = rect2.height;
  		//console.log("x:"+obj1.x+" -y:"+obj1.y+" -w:"+obj1.w + " h:"+obj1.h);
  		//console.log("x:"+obj2.x+" -y:"+obj2.y+" -w:"+obj2.w + " h:"+obj2.h);

  		if (obj1.x < obj2.x + obj2.w  && obj1.x + obj1.w  > obj2.x &&
  			obj1.y < obj2.y + obj2.h && obj1.y + obj1.h > obj2.y)
  			return true;
  		return false;
  	}

    /*
     *  Add to Main Group
     */
    var __addToGroup = function(groupPos,value){
      //console.log("addToGroup("+groupPos+","+value+")");
      var tmp = puzzleObject.groups[groupPos];
      if( tmp.indexOf(value) < 0){
        tmp[tmp.length] = value;
      }
    }

    /*
     *  Upudate piece
     */
    var __updatePiece = function(obj){
      if(obj.group >= 0){
        var tmpAr = puzzleObject.groups[obj.group];
        var tmpPiece;
        var sums = [0,0];
        var sumsO = __getSums(obj.id);
        for (var i = tmpAr.length - 1; i >= 0; i--) {
          if(obj.id != tmpAr[i]){
            tmpPiece = puzzleObject.piecesArray[tmpAr[i]];

            sums = __getSums(tmpAr[i]);

            tmpPiece.scaleX = obj.scaleX;
              tmpPiece.scaleY = obj.scaleY;
            tmpPiece.x = obj.x + (puzzleObject.pieceWidth * (sums[0] - sumsO[0] )* tmpPiece.scaleX);
            tmpPiece.y = obj.y + (puzzleObject.pieceHeight * (sums[1] - sumsO[1])* tmpPiece.scaleY);
          }
        };
      }
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
        area.w = window.innerWidth;
        area.h = window.innerHeight;
        gameCanvas.width = area.w;
        gameCanvas.height = area.h;
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
