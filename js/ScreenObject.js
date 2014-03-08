/* global global */
/* exported ScreenObject */

var ScreenObject = function(x, y, radius, color){
  this.id = global.nextId();
  this.x = x;
  this.y = y;
  this.radius = radius || 10;
  this.color = color || 'black';
};

ScreenObject.prototype.options = {
  cx: 'x',
  cy: 'y',
  r: 'radius',
  fill: 'color'
};

ScreenObject.prototype.setPosition = function(x, y){
  this.x = x;
  this.y = y;
};
