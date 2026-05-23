function Player(def) {
  this.w = 58; this.h = 52;
  this.x = 60; this.y = -80;
  this.vx = 0; this.vy = 0;
  this.onGround = false; this.dead = false; this.finished = false;
  this.jumpCD = 0; this.squishY = 1; this.facing = 1;
  this.baguettes = 0; this.walkFrame = 0; this.walkT = 0;
  this.def = def; this.iceTimer = 0;
}

Player.prototype.update = function(plats) {
  if (this.dead || this.finished) return;

  var def = this.def, ax = 0;
  if (keys['ArrowLeft'])  ax = -1;
  if (keys['ArrowRight']) ax =  1;
  if (def.wind) ax += def.wind * Math.sin(tick * 0.03);

  if (this.iceTimer > 0) {
    this.vx += ax * 0.4;
    this.vx *= 0.98;
    this.iceTimer--;
  } else {
    this.vx = ax * def.speed;
  }

  if (ax > 0) this.facing =  1;
  if (ax < 0) this.facing = -1;

  if (keys['ArrowUp'] && this.onGround && this.jumpCD <= 0) {
    this.vy       = -def.jumpPow;
    this.onGround = false;
    this.jumpCD   = 12;
    this.squishY  = 0.72;
  }
  if (this.jumpCD > 0) this.jumpCD--;

  this.squishY += (1 - this.squishY) * 0.22;
  this.vy = Math.min(this.vy + GRAVITY, 18);
  this.x += this.vx;
  this.y += this.vy;

  var wasGround = this.onGround;
  this.onGround = false;
  var gnd = H * 0.72;

  for (var i = 0; i < plats.length; i++) {
    var p = plats[i], py = gnd + p.y;
    var hitsX = this.x + this.w > p.x + 4 && this.x < p.x + p.w - 4;
    var hitsY = this.y + this.h > py && this.y + this.h < py + 32 && this.vy >= 0;
    if (hitsX && hitsY) {
      this.y        = py - this.h;
      this.vy       = 0;
      this.onGround = true;
      if (!wasGround) this.squishY = 1.35;
      if (p.ice) {
        this.iceTimer = 40;
        this.vx += (ax || this.facing) * def.speed * 0.5;
      }
    }
  }

  if (this.y > H + 150) this.dead = true;
  if (this.x < 0) this.x = 0;

  // Walk animation
  if (Math.abs(this.vx) > 0.3 && this.onGround) {
    this.walkT++;
    if (this.walkT > 9) { this.walkFrame = (this.walkFrame + 1) % 4; this.walkT = 0; }
  } else if (this.onGround) {
    this.walkFrame = 0;
  }
};

Player.prototype.collectBaguettes = function(bags) {
  var gnd = H * 0.72;
  for (var i = 0; i < bags.length; i++) {
    var b = bags[i];
    if (b.collected) continue;
    var touchX = this.x + this.w > b.x && this.x < b.x + b.w;
    var touchY = this.y + this.h > gnd + b.y && this.y < gnd + b.y + b.h;
    if (touchX && touchY) { b.collected = true; this.baguettes++; }
  }
};

Player.prototype.draw = function(camX) {
  drawCroissant(this.x - camX + this.w / 2, this.y + this.h / 2, this.squishY, this.dead, this.walkFrame, this.facing);
};
