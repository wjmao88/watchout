/* global global, d3*/
/* exported ScreenObject */

var ScreenObject = function(env){
  this.env = env;
  this.id = global.nextId();
  this.valid = true;

  this.x = Math.random();
  this.y = Math.random();
  this.direction = Math.random() * 2 * Math.PI;

  this.speed = 0.01;
  this.radius = 0.05;

  this.energy = 100;
};

ScreenObject.prototype.auto = function(){
  var context = this;
  this.move();
  setTimeout(function(){
    context.auto();
  }, Math.random()*1000 + 500);
};

ScreenObject.prototype.move = function(){
  this.direction += (Math.random() - 0.5) * Math.PI/8;
  this.x += this.speed * Math.cos(this.direction);
  this.y += this.speed * Math.sin(this.direction);
};
