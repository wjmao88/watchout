/* global d3, Bullet, Enemy, Player, Pet, PetBullet, Boss */
/* exported Board */
var Board = {
  selector: '.board',
  tag: 'circle',
  data: {
    bullet: [],
    enemy: [],
    player: [],
    pet: [],
    petBullet: [],
    boss: []
  },
  h: 300,
  w: 300,
  level: 1
};

d3.select(Board.selector)
  .style('width', Board.w+'px')
  .style('height', Board.h+'px');

//=========================================================
Board.scale = function(num){
  return num * Board.h;
};

Board.getPlayers = function(){
  return this.data.player;
};

Board.getEnemies = function(){
  return this.data.enemy;
};

Board.getType = function(robot){
  if (robot instanceof PetBullet){
    return 'petBullet';
  }
  if (robot instanceof Bullet){
    return 'bullet';
  }
  if (robot instanceof Boss){
    return 'boss';
  }
  if (robot instanceof Enemy){
    return 'enemy';
  }
  if (robot instanceof Pet){
    return 'pet';
  }
};
//add objects =============================================
Board.createPlayer = function() {
  var player = new Player();
  this.data.player.push(player);
  player.x = 0.5;
  player.y = 0.5;

  d3.select(Board.selector)
    .selectAll('.player')
    .data([player], Board.getId)
    .enter().append(Board.tag)
    .attr('class', 'player')
    .attr({
      r: Board.scale(player.radius),
      cx: Board.scale(player.x),
      cy: Board.scale(player.y)
    })
    .call(this.drag());

  Board.createPet(player);
};

Board.createPet = function(player) {
  this.addRobot(new Pet(Board, player), this.getEnemies());
};

Board.createEnemy = function(){
  this.addRobot(new Enemy(Board, Board.level), this.getPlayers());
};

Board.scheduleBoss = function(){
  var time = 16;
  for (var i=0; i<16; i++){
    setTimeout(function(){
      time--;
      d3.select('.timer').select('span')
        .text(time);
    }, i*1000);
  }

  setTimeout(function(){
    for (var i=0; i< Board.level; i++){
      Board.addRobot(new Boss(Board, Board.level), Board.getPlayers());
    }
  }, 16000);
};
//robots ==================================================
Board.addRobot = function(robot, targets){
  var type = this.getType(robot);
  this.data[type].push(robot);
  if (type === 'boss'){
    this.data['enemy'].push(robot);
  }
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
        parseFloat(sel.attr('r')),
        parseFloat(sel.attr('cx')),
        parseFloat(sel.attr('cy')),
        Board.scale(targets[i].radius),
        Board.scale(targets[i].x),
        Board.scale(targets[i].y),
        function(collision){
          if (collision) {
            targets[i].energy -= robot.damage;
            if (targets[i].updateEnergy){
              targets[i].updateEnergy();
            }
            if (robot.short){
              Board.removeRobot(robot);
            }
          }
        }
      );
    }
    if( robot.short && (robot.x < 0 || robot.x > 1 || robot.y < 0 || robot.y > 1 )){
      Board.removeRobot(robot);
    }
    if (robot.energy <= 0 && robot.canDie){
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

  if (type === 'boss' || type === 'enemy'){
    var players = this.getPlayers();
    for (var i=0; i< players.length; i++){
      players[i].score += (type === 'boss'? 6000: 600) * Board.level;
    }
  }

  if (type === 'boss' && Board.data.boss.length === 0){
    Board.scheduleBoss();
    Board.level++;
  }

  if (type === 'enemy' && this.data.enemy.length < 10){
    setTimeout(function(){
      Board.createEnemy();
    }, Math.random() * 10000);
  }
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
      d.x += d3.event.dx/Board.scale(1);
      d.y += d3.event.dy/Board.scale(1);
      d3.select(this)
        .attr('cx', function(d) {
          return Math.max(Math.min(Board.scale(d.x), Board.scale(1)), 0);
        })
        .attr('cy', function(d) {
          return Math.max(Math.min(Board.scale(d.y), Board.scale(1)), 0);
        });
    });
};

Board.collision = function(r1, x1, y1, r2, x2, y2, callback){
  callback (r1 + r2 > Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2)));
};

Board.getId = function(d){
  return d.id;
};
