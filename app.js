var myGamePiece=[];
var cols = [0,0,0,0,0,0,0];
var turn = 1;
var flag = 0;
var win = 0;

function startGame() {
  myGameArea.start();
  var i,j ;

  for (j=0; j<=5; j++)
  {
    for (i=0; i<=6; i++)
    {
      var obj = new component(50,50,"black",60*i+85, 60*j+70);
      myGamePiece.push(obj);
    }
  }
}


function changeColor(piece,pos,color){
  piece[pos].color=color;
  ctx = myGameArea.context;
  ctx.fillStyle = color;
  ctx.fillRect(piece[pos].x, piece[pos].y, piece[pos].width, piece[pos].height);
}


function play(){
  var randnum, pos;

    if(turn==0)
    {
      turn=1
      xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status==200){
          if(flag == 0){
            var move = xhr.responseText;
	    move = parseInt(move)
            console.log(move);
            if(cols[move]<6)
            {
              pos = move + (5-cols[move])*7;
              cols[move] += 1;
              changeColor(myGamePiece,pos,"blue");
            }
	    var board = boardState();
	    checkwinner(board);
            flag = 1;
          }
        }
      };

	  var board = boardState();
	  xhr.open("POST","http://localhost:5000/getmove",true);
	  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	  xhr.send(JSON.stringify({"gameState": board.toString()}));


    }
    else
    {
      //randnum = Math.floor(Math.random()*7);
      randnum = prompt('enter col');
      randnum = parseInt(randnum);
      if(cols[randnum]<6)
      {
	pos = randnum + (5-cols[randnum])*7;
	cols[randnum] += 1;
	changeColor(myGamePiece,pos,"red");
        turn = 0;
        flag = 0;
      }
      var board = boardState();
      checkwinner(board);
    }

}

function checkwinner(board){
  xhr2 = new XMLHttpRequest();
  xhr2.onreadystatechange = function(){
    if(xhr2.readyState == 4 && xhr2.status==200){
      var res = xhr2.responseText;
      var res = parseInt(res);
      if(res == -1 || res == 1){
        //clearInterval(myVar);
        if(res == 1)
	  {
            alert("Blue Won");
	    location.reload(true);
	  }

        else
	  {
            alert("Red Won");
	    location.reload(true);
	  }
      }
    }
  };

  xhr2.open("POST","http://localhost:5000/test_check",true);

  xhr2.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr2.send(JSON.stringify({"gameState": board.toString(),"format":'0'}));

}


function boardState(){
  var board = [];
  var i;
  for (i=0; i<42; i++)
  {
    if(myGamePiece[i].color=='black')
      board.push(0);
    else if(myGamePiece[i].color=='blue')
      board.push(1);
    else
      board.push(-1);
  }
  console.log(board);
  return board;
}

function component(width, height, color, x, y){
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.color = color;
  ctx = myGameArea.context;
  ctx.fillStyle = color;
  ctx.fillRect(this.x, this.y, this.width, this.height)
}

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 580;
    this.canvas.height = 500;
    this.context = this.canvas.getContext("2d");
    document.getElementById("canvas-container").appendChild(this.canvas);
  }
}
