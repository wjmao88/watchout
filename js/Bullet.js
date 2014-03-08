var Bullet = function() {
  ScreenObject.apply(this, arguments);
};

Bullet.protoype = Object.create(ScreenObject.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.getOptions = function() {
  var temp = ScreenObject.prototype.getOptions();


  return temp;
};
