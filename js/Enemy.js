/* global ScreenObject, Bullet, PetBullet */

var Enemy = function(board, level) {
  ScreenObject.apply(this, arguments);
  this.level = level;

  this.speed = 0.004 * (1+level/10);
  this.radius = 0.02;

  this.auto();
  this.canDie = true;
  this.damage = 9;
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
  this.env.addRobot(new Bullet(this.env, this.x, this.y, this.env.getPlayers()), this.env.getPlayers());
  var context = this;
  var ti = setTimeout(function(){
    if (context.removed){
      window.clearTimeout(ti);
      return;
    }
    context.auto();
  }, Math.random() * 1000 + 500);
};

var Boss = function(){
  Enemy.apply(this, arguments);
  this.damage = 100;
  this.speed = 0.002 + this.level*0.001;
  this.radius = 0.1;
  this.energy = 1000 + Math.random()*this.level*100;
};

Boss.prototype = Object.create(Enemy.prototype);
Boss.prototype.constructor = Boss;

Boss.prototype.auto = function(){
  if (Math.random() < (0.03)){
    this.bulletScreen(3+this.level);
  } else if (Math.random() < (0.01*this.level)){
    this.env.createEnemy();
  } else if (Math.random() < (0.16)){
    this.bulletScreen(1);
  }
  Enemy.prototype.auto.apply(this);
};

Boss.prototype.bulletScreen = function(n){
  if (this.env.getPlayers().length === 0){
    return;
  }
  var target = this.env.getPlayers()[Math.floor(Math.random() * this.env.getPlayers().length)];
  var context = this;

  var strands = 6 + Math.pow(1.1, this.level);
  for (var i=1; i<=n; i++){
    setTimeout(function(){
      for (var i=(-1 * strands); i<= strands; i++){
        var bullet = new Bullet(context.env, context.x, context.y, [target]);
        context.env.addRobot(bullet, [target]);
        bullet.direction += Math.PI/2 * i/strands;
      }
    }, 1000/i);
  }
};

var Pet = function(env, master) {
  ScreenObject.apply(this, arguments);
  this.master = master;
  this.speed = 0.001;
  this.radius = 0.02;
  this.auto();

  this.damage = 16;
};

Pet.prototype = Object.create(ScreenObject.prototype);
Pet.prototype.constructor = Pet;

Pet.prototype.move = function(){
  this.direction = (this.direction + 0.1)%(2*Math.PI);
  var r = (this.radius + this.master.radius) * 3;
  this.x = this.master.x + r * Math.cos(this.direction);
  this.y = this.master.y + r * Math.sin(this.direction);
};

Pet.prototype.auto = function(){
  if (this.master.energy > this.master.energyMax * 0.2){
    this.env.addRobot(new PetBullet(this.env, this.x, this.y, this.env.getEnemies()), this.env.getEnemies);
  }
  var context = this;
  setTimeout(function(){
    context.auto();
  }, 300);
};


