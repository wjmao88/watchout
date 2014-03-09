/* global ScreenObject, d3 */
/* exported Player */
var Player = function() {
  this.x = 0;
  this.y = 0;
  this.radius = 0.05;
  this.color = 'red';
  this.highScore = 0;
  this.score = 0;
  this.collisionCount = 0;
};

Player.prototype.resetScore = function() {
  this.highScore = Math.max(this.highScore, this.score);
  this.score = 0;
};

