/* global Board*/
/* exported global */
var global = {
  idCounter : 0
};
global.nextId = function(){
  return this.idCounter++;
};

Board.addPlayer();
