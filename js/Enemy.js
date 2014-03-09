/* global ScreenObject, Bullet */

var Enemy = function() {
  ScreenObject.apply(this, arguments);

  this.speed = 0.01;
  this.radius = 0.05;
  this.color = 'red';
  this.auto();
};

Enemy.prototype = Object.create(ScreenObject.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.move = function(){
  ScreenObject.prototype.move.apply(this, arguments);
  if (this.x < 0 || this.x > 1 || this.y < 0 || this.y > 1){
    this.x < 0? this.x *= -1:'';
    this.y < 0? this.y *= -1:'';
    this.x > 1? this.x = 2 - this.x :'';
    this.y > 1? this.y = 2 - this.y :'';
    this.direction = (this.direction + Math.PI) % (2 * Math.PI);
  }
};

Enemy.prototype.auto = function(){
  this.env.addRobot(new Bullet(this.env, this.x, this.y));
  var context = this;
  setTimeout(function(){
    context.auto();
  }, 500);
};


