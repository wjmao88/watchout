/* global d3 */
/* exported Player*/
var Player = function() {
  this.x = 0;
  this.y = 0;
  this.radius = 0.03;
  this.energy = 100;
  this.energyMax = 300;
  this.score = 0;
  this.highScore = 0;

  this.updateEnergy();
  this.autoUpdate();
  this.regenerate();
};

Player.prototype.updateEnergy = function(){
  var top = (1-(this.energy/this.energyMax))*(window.innerHeight/2);
  d3.select('.energy')
    .style('height', window.innerHeight/2+'px')
    .select('.bar')
    .style('top', top+'px');
};

Player.prototype.autoUpdate = function(){
  this.score += (this.energy - this.energyMax/3);
  if (this.score > this.highScore){
    this.highScore = this.score;
  }
  d3.select('.scoreboard').select('.high').select('span').text(this.highScore);
  d3.select('.scoreboard').select('.current').select('span').text(this.score);

  var player = this;
  setTimeout(function(){
    player.autoUpdate();
  }, 1000);
};

Player.prototype.regenerate = function(){
  if (this.energy < this.energyMax){
    this.energy += this.energyMax/10;
    if (this.energy > this.energyMax){
      this.energy = this.energyMax;
    }
    if (this.energy < 0){
      this.energy = 0;
    }
    this.updateEnergy();
  }
  var player = this;
  setTimeout(function(){
    player.regenerate();
  }, 500);
};
