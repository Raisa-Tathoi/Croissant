function Player(levelDef) {
    this.width = 58;
    this.height = 52;
    this.x = 60;
    this.y = -80;
    this.velocityX = 0;
    this.velocityY = 0;
    this.onGround = false;
    this.dead = false;
    this.finished = false;
    this.jumpCooldown = 0;
    this.squishScale = 1;
    this.facing = 1;
    this.baguettes = 0;
    this.walkFrame = 0;
    this.walkTimer = 0;
    this.iceSlideDuration = 0;
    this.def = levelDef;
}

Player.prototype.computeDirection = function(levelDef) {
    var dir = 0;
    if (keys['ArrowLeft']) { dir = -1; }
    if (keys['ArrowRight']) { dir = 1; }
    if (levelDef.wind) { dir += levelDef.wind * Math.sin(tick * 0.03); }
    return dir;
};

Player.prototype.applyMovement = function(moveDir, levelDef) {
    if (this.iceSlideDuration > 0) {
        this.velocityX += moveDir * 0.4 * deltaTime;
        this.velocityX *= Math.pow(0.98, deltaTime);
        this.iceSlideDuration -= deltaTime;
    } else {
        this.velocityX = moveDir * levelDef.speed;
    }
    if (moveDir > 0) { this.facing = 1; }
    if (moveDir < 0) { this.facing = -1; }
};

Player.prototype.applyJump = function(levelDef) {
    if (keys['ArrowUp'] && this.onGround && this.jumpCooldown <= 0) {
        this.velocityY = -levelDef.jumpPow;
        this.onGround = false;
        this.jumpCooldown = 12;
        this.squishScale = 0.72;
    }
    if (this.jumpCooldown > 0) { this.jumpCooldown -= deltaTime; }
};

Player.prototype.applyPhysics = function() {
    this.squishScale += (1 - this.squishScale) * 0.22 * deltaTime;
    this.velocityY = Math.min(this.velocityY + GRAVITY * deltaTime, 18);
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;
    if (this.y > canvasHeight + 150) { this.dead = true; }
    if (this.x < 0) { this.x = 0; }
};

Player.prototype.checkPlatforms = function(platforms, moveDir, levelDef) {
    var groundY = canvasHeight * 0.72;
    var wasOnGround = this.onGround;
    this.onGround = false;
    for (var i = 0; i < platforms.length; i++) {
        var platform = platforms[i];
        var platTop = groundY + platform.y;
        var overlapsX = this.x + this.width > platform.x + 4 && this.x < platform.x + platform.w - 4;
        var overlapsY = this.y + this.height > platTop && this.y + this.height < platTop + 40 && this.velocityY >= 0;
        if (overlapsX && overlapsY) {
            this.y = platTop - this.height;
            this.velocityY = 0;
            this.onGround = true;
            if (!wasOnGround) { this.squishScale = 1.35; }
            if (platform.ice) {
                this.iceSlideDuration = 40;
                this.velocityX += (moveDir || this.facing) * levelDef.speed * 0.5;
            }
        }
    }
};

Player.prototype.updateWalkAnim = function() {
    if (Math.abs(this.velocityX) > 0.3 && this.onGround) {
        this.walkTimer += deltaTime;
        if (this.walkTimer > 9) {
            this.walkFrame = (this.walkFrame + 1) % 4;
            this.walkTimer = 0;
        }
    } else if (this.onGround) {
        this.walkFrame = 0;
    }
};

Player.prototype.update = function(platforms) {
    if (this.dead || this.finished) { return; }
    var levelDef = this.def;
    var moveDir = this.computeDirection(levelDef);
    this.applyMovement(moveDir, levelDef);
    this.applyJump(levelDef);
    this.applyPhysics();
    this.checkPlatforms(platforms, moveDir, levelDef);
    this.updateWalkAnim();
};

Player.prototype.collectBaguettes = function(allBaguettes) {
    var groundY = canvasHeight * 0.72;
    for (var i = 0; i < allBaguettes.length; i++) {
        var baguette = allBaguettes[i];
        if (baguette.collected) { continue; }
        var overlapsX = this.x + this.width > baguette.x && this.x < baguette.x + baguette.w;
        var overlapsY = this.y + this.height > groundY + baguette.y && this.y < groundY + baguette.y + baguette.h;
        if (overlapsX && overlapsY) {
            baguette.collected = true;
            this.baguettes++;
        }
    }
};

Player.prototype.draw = function(cameraX) {
    drawCroissant(
        this.x - cameraX + this.width / 2,
        this.y + this.height / 2,
        this.squishScale,
        this.dead,
        this.walkFrame,
        this.facing
    );
};
