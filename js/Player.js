/* global ScreenObject */
/* exported Player */
var Player = function() {
  ScreenObject.apply(this, arguments);
};

Player.protoype = Object.create(ScreenObject.prototype);
Player.prototype.constructor = Player;

Player.prototype.getOptions = function() {
  var temp = ScreenObject.prototype.getOptions();


  return temp;
};
