(function(){

  // Module Pattern
	var puzzleGame = (function(){
    //----------------------------
    //                  Variables
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
      rendereableObj.gameContainer.visible = false;

      rendereableObj.finalContainer = new createjs.Container();
      stage.addChild(rendereableObj.finalContainer);
      //rendereableObj.finalContainer.visible = false;
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
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;
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
