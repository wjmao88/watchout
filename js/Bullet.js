/* global ScreenObject */

var Bullet = function(env, x, y, targets) {
  ScreenObject.apply(this, arguments);
  this.x = x;
  this.y = y;
  this.radius = 0.01;
  this.color = 'yellow';
  this.speed = 0.012;
  this.direction = 0;

  this.damage = 12;

  this.short = true;
  if (targets.length > 0){
    this.setDirection(targets[Math.floor(Math.random() * targets.length)]);
  }
};

Bullet.prototype = Object.create(ScreenObject.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.setDirection = function(target){
  var x = target.x - this.x;
  var y = target.y - this.y;
  this.direction = Math.atan2(y, x);
};

Bullet.prototype.move = function(){
  this.x += this.speed * Math.cos(this.direction);
  this.y += this.speed * Math.sin(this.direction);
};

var PetBullet = function() {
  Bullet.apply(this, arguments);
};

PetBullet.prototype = Object.create(Bullet.prototype);
PetBullet.prototype.constructor = PetBullet;
