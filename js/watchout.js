/* global Board, d3*/
/* exported global */
var global = {
  idCounter : 0
};
global.nextId = function(){
  return this.idCounter++;
};

var game = function(){
  Board.createPlayer();
  Board.scheduleBoss();
  for (var key in d3.range(8)){
    setTimeout(function(){
      Board.createEnemy();
    }, 1600*key);
  }
};

game();
