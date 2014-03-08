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
    var map = ScreenObject.prototype.options;
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
    .attr('cx', function(d) {
      return d.x;
    })
    .attr('cy', function(d) {
      return d.y;
    });
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
