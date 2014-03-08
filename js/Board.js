/* global d3, Bullet, Player */
/* exported Board */
var Board = function(selector){
  this.selector = selector;
  this.data = {
    bullets: [],
    players: []
  };
  this.height = 600;
  this.width = 600;

  d3.select(selector)
    .attr('height', this.height)
    .attr('width', this.width);
};

Board.prototype.selectors = {
  bullets: 'bullet',
  players: 'player'
};

Board.prototype.objectPropertyMap = {
  cx: 'x',
  cy: 'y',
  r: 'radius',
  fill: 'color'
};

Board.prototype.screenObjectTag = 'circle';

Board.prototype.update = function(){
  for (var key in this.data) {
    var selection = d3.select(this.selector)
      .selectAll('.' + this.selectors[key])
      .data(this.data[key], function(d) {
        return d.id;
      });

    //remove exit elemets
    selection.exit().remove();

    ////add enter elements
    selection.enter().append(this.screenObjectTag)
      .attr('class', this.selectors[key]);

    //redraw all elements still existing
    var map = this.objectPropertyMap;
// debugger;
    for (var attrKey in map){
      selection
        .attr(attrKey, function(d){
          return d[map[attrKey]];
        });
    }
  }
};

Board.prototype.moveAllBullets = function(){
  var board = this;
  for(var i=0; i< this.data.bullets.length; i++){
    this.data.bullets[i]
      .setPosition(this.randomX(), this.randomY());
  }
  d3.select(this.selector)
    .selectAll('.' + this.selectors.bullets)
    .data(this.data.bullets, function(d) {
      return d.id;
    })
    .transition()
    .duration(2000)
    .tween('custom', function(endData) {
      var bullet = d3.select(this);
      var startX = bullet.attr('cx');
      var startY = bullet.attr('cy');
      var endX = endData.x;
      var endY = endData.y;
      return function(t) {
        for (var i = 0; i < board.data.players.length; i++) {
          var radiusSum = parseFloat(bullet.attr('r')) + board.data.players[i].radius;
          var xDiff = parseFloat(bullet.attr('cx')) - board.data.players[i].x;
          var yDiff = parseFloat(bullet.attr('cy')) - board.data.players[i].y;
          var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

          if (separation < radiusSum) {
            console.log('collide');
          }
        }
      };
    })
    .attr('cx', function(d) {
      return d.x;
    })
    .attr('cy', function(d) {
      return d.y;
    });
};

Board.prototype.drag = function() {
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

Board.prototype.addPlayer = function() {
  this.data.players.push(new Player(this.width / 2, this.height / 2));
  this.update();

  d3.select('.' + this.selectors.players)
    .call(this.drag());
};

Board.prototype.addBullets = function(n){
  n = n || 1;
  for (var i = 0; i < n; i++) {
    this.data.bullets.push(new Bullet(this.randomX(), this.randomY()));
  }
  this.update();
};

Board.prototype.randomX = function(){
  return Math.random() * this.width;
};

Board.prototype.randomY = function(){
  return Math.random() * this.height;
};
