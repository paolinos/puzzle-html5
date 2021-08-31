## Description
This is a Jigsaw Puzzle that run pure JS & Canvas.

Running the app, you can dynamic configure the amount of pieces that you want (x,y) and the image to play.

The code will take that image, create each piece and rendering each one.


```
// run webpack watch and the open the './dist/index.html'
npm run watch
``` 




#### OLD - Description
This was a game that I made more than year ago.
So I clean a bit the code and put in a better way.

This is a puzzle game, using Html5 canvas, using the [CreateJS](http://www.createjs.com) .

So, the idea is load the image, and generate all the pieces dynamically.
```
// So to Initialize the game we need to pass the parameters
puzzleGame.init(src, w=0,h=0,horizontal=4,vertical=3);

src = url or image object
w = width of the game.    (optional)
h = height of the game.   (optional)
horizontal= horizontal pieces count.  (optional)
vertical= vertical pieces count.      (optional)

// Loading image
puzzleGame.init("img/robot-kirobo.jpg",0,0,5,5);
```
