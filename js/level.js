function addPlatform(platforms, cursorX, platOffsetY, platWidth, levelDef) {
    var isMoving = levelDef.movingPlats && Math.random() < 0.55;
    var isIcy = levelDef.iceSlide && Math.random() < 0.45;
    var amp = isMoving ? 40 + Math.random() * 60 : 0;
    platforms.push({
        x: cursorX, y: platOffsetY, w: platWidth, h: 16,
        vx: isMoving ? (Math.random() < 0.5 ? 1 : -1) * 1.2 : 0,
        dir: 1, minX: cursorX - amp, maxX: cursorX + amp, ice: isIcy,
    });
}

function addObstacle(obstacles, cursorX, platOffsetY, platWidth, levelDef) {
    if (levelDef.obsFreq <= 0 || Math.random() >= levelDef.obsFreq || platWidth <= 180) {
        return null;
    }
    var muffinX = cursorX + 70 + Math.random() * (platWidth - 176);
    obstacles.push({ x: muffinX, y: platOffsetY - 36, w: 32, h: 36 });
    return muffinX;
}

function addBaguettes(baguettes, cursorX, platOffsetY, platWidth, muffinX) {
    var count = Math.floor(Math.random() * 3) + 1;
    for (var b = 0; b < count; b++) {
        var bx = cursorX + 20 + b * (platWidth / (count + 1));
        if (muffinX !== null && Math.abs(bx - muffinX) < SAFE_DIST) { continue; }
        baguettes.push({
            x: bx, y: platOffsetY - 55 - Math.random() * 30,
            w: 12, h: 38, collected: false, pulse: Math.random() * 60,
        });
    }
}

function buildMiddlePlatforms(levelDef) {
    var platforms = [], obstacles = [], baguettes = [];
    var cursorX = 380;
    for (var i = 0; i < 28; i++) {
        cursorX += levelDef.gap + Math.random() * 40;
        var platWidth = levelDef.narrow ? 80 + Math.random() * 60 : 140 + Math.random() * 120;
        var platOffsetY = (Math.random() - 0.5) * 120;
        addPlatform(platforms, cursorX, platOffsetY, platWidth, levelDef);
        var muffinX = addObstacle(obstacles, cursorX, platOffsetY, platWidth, levelDef);
        addBaguettes(baguettes, cursorX, platOffsetY, platWidth, muffinX);
        cursorX += platWidth;
    }
    return { platforms: platforms, obstacles: obstacles, baguettes: baguettes, endX: cursorX };
}

function buildLevel(levelDef) {
    var mid = buildMiddlePlatforms(levelDef);
    var endX = mid.endX + 60;
    var startPlat = { x: 0, y: 0, w: 380, h: 16, vx: 0, dir: 1, minX: 0, maxX: 0, ice: false };
    var goalPlat = { x: endX, y: 0, w: 500, h: 16, vx: 0, dir: 1, minX: endX, maxX: endX, ice: false };
    var platforms = [startPlat].concat(mid.platforms).concat([goalPlat]);
    return {
        plats: platforms,
        obstacles: mid.obstacles,
        baguettes: mid.baguettes,
        finish: { x: endX + 380, y: -120 },
        def: levelDef,
    };
}

function updatePlatforms() {
    for (var i = 0; i < level.plats.length; i++) {
        var platform = level.plats[i];
        if (!platform.vx) { continue; }
        platform.x += platform.vx * platform.dir * deltaTime;
        if (platform.x > platform.maxX || platform.x < platform.minX) {
            platform.dir *= -1;
        }
    }
}

function checkObstacles() {
    var groundY = canvasHeight * 0.72;
    for (var i = 0; i < level.obstacles.length; i++) {
        var obstacle = level.obstacles[i];
        var obstacleTop = groundY + obstacle.y - obstacle.h;
        var overlapsX = player.x + player.width - 8 > obstacle.x + 4 && player.x + 8 < obstacle.x + obstacle.w - 4;
        var overlapsY = player.y + player.height - 6 > obstacleTop + 4 && player.y + 6 < obstacleTop + obstacle.h - 4;
        if (overlapsX && overlapsY) { player.dead = true; }
    }
}

function checkFinish() {
    var groundY = canvasHeight * 0.72;
    var finishScreenY = groundY + level.finish.y;
    var reachedX = player.x + player.width > level.finish.x - 55;
    var reachedY = player.y + player.height > finishScreenY - 10;
    if (!player.finished && !player.dead && reachedX && reachedY) {
        player.finished = true;
    }
}

function starsForBaguettes(collected, total) {
    var ratio = total > 0 ? collected / total : 0;
    if (ratio > 0.66) { return 3; }
    if (ratio > 0.33) { return 2; }
    return 1;
}
