/* global d3, Bullet, Enemy, Player */
/* exported Board */
var Board = {
  selector: '.board',
  tag: 'circle',
  data: {
    bullet: [],
    enemy: [],
    player: []
  },
  h: 600,
  w: 600
};

Board.scale = function(num){
  return num * window.innerHeight;
};

Board.getPlayers = function(){
  return this.data.player;
};

Board.getType = function(robot){
  if (robot instanceof Enemy){
    return 'enemy';
  }
  if (robot instanceof Bullet){
    return 'bullet';
  }
};
//add objects =============================================
Board.addPlayer = function() {
  var player = new Player();
  this.data.player.push(player);

  d3.select(Board.selector)
    .selectAll('.player')
    .data([player], Board.getId)
    .enter().append(Board.tag+'.player')
    .attr({
      r: Board.scale(0.05),
      cx: Board.scale(0.5),
      cy: Board.scale(0.5)
    })
    .call(this.drag());
};

//robots ==================================================
Board.addRobot = function(robot){
  var type = this.getType(robot);
  this.data[type].push(robot);
  var targets = this.data.player;
  d3.select(this.selector).selectAll(this.tag+'.'+type)
    .data([robot], Board.getId)
    .enter().append(this.tag)
    .attr('class', type)
    .attr('r', Board.scale(robot.radius))
    .attr({cx: Board.scale(robot.x), cy: Board.scale(robot.y)});
  var sel = d3.select(this.selector)
    .selectAll(this.tag+'.'+type)
    .data([robot], Board.getId);
  d3.timer(function(){
    if (robot.removed){
      return ;
    }
    robot.move();
    for (var i=0; i< targets.length; i++){
      Board.collision(
        parseFloat(this.attr('r')),
        parseFloat(this.attr('cx')),
        parseFloat(this.attr('cy')),
        Board.scale(targets[i].radius),
        Board.scale(targets[i].x),
        Board.scale(targets[i].y),
        function(collision){
          if (collision) {
            targets[i].score--;
          } else {
            targets[i].score++;
          }
        }
      );
    }
    if (robot.x < 0 || robot.x > 1 || robot.y < 0 || robot.y > 1){
      Board.removeRobot(robot);
    }
    sel.attr({cx: Board.scale(robot.x), cy: Board.scale(robot.y)});
  });

  robot.auto();
};

Board.removeRobot =  function(robot){
  var type = this.getType(robot);
  this.data[type].splice(this.data[type].indexOf(robot), 1);
  d3.selectAll('circle')
    .data([robot], Board.getId)
    .data([]).exit().remove();
  robot.removed = true;
};

//collision handling ======================================
Board.playerCollision = function(collision, player){
  if (collision) {
    player.score--;
  } else {
    player.score++;
  }
};

Board.robotCollision = function(collision, robot){
  if (!collision) {
    return;
  }
  Board.removeRobot(robot);
};
//helper methods ==========================================
Board.drag = function() {
  return d3.behavior.drag()
    .on('drag', function(d) {
      d.x += d3.event.dx;
      d.y += d3.event.dy;
      d3.select(this)
        .attr('transform', function(d) {
          return 'translate(' + [d3.event.dx, d3.event.dy] + ')';
        })
        .attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) {
          return d.y;
        });
    });
};

Board.collision = function(r1, x1, y1, r2, x2, y2, callback){
  callback (r1 + r2 > Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2)));
};

Board.getId = function(d){
  return d.id;
};
