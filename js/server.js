var server = {};
server.data = {
  players: [],
  enemies: []
};

var cycle = function(){


  setTimeout(function(){
    cycle();
  }, 1000);
}
