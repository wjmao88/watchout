/* global ScreenObject */

var Bullet = function(env, x, y) {
  ScreenObject.apply(this, arguments);
  this.x = x;
  this.y = y;
  this.radius = 0.02;
  this.color = 'yellow';
  this.speed = 0.05;
  this.direction = 0;

  this.short = true;

  if (env.getPlayers.length > 0){
    var index = Math.floor(Math.random() * env.getPlayers.length);
    this.setDirection(env.getPlayers[index]);
  }
};

Bullet.prototype = Object.create(ScreenObject.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.setDirection = function(player){
  var x = player.x - this.x;
  var y = player.y - this.y;
  this.direction = Math.atan(y/x);
};

Bullet.prototype.move = function(){
  this.x += this.speed * Math.cos(this.direction);
  this.y += this.speed * Math.sin(this.direction);
};
