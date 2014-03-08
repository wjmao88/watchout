/* global */
/* exported global */
var global = {
  idCounter : 0
};
global.nextId = function(){
  return this.idCounter++;
};

var board = new Board('.board');

board.addBullets(1);
board.addPlayer();

setInterval(function() {
  board.moveAllBullets();
  console.log('moved all');
}, 1000);
