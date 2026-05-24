var croissantImg = new Image();
croissantImg.src = 'croissant.png';

var muffinImg = new Image();
muffinImg.src = 'muffin.png';

var baguetteImg = new Image();
baguetteImg.src = 'baguette.png';

var bakeryImg = new Image();
bakeryImg.src = 'bakery.png';

function drawCroissant(centerX, centerY, squishScale, dead, _walkFrame, facing) {
    if (!croissantImg.complete || !croissantImg.naturalWidth) { return; }
    var drawWidth = 72;
    var drawHeight = 72;
    ctx.save();
    ctx.translate(Math.round(centerX), Math.round(centerY));
    ctx.scale(facing, squishScale);
    if (dead) { ctx.rotate(Math.PI / 2); }
    ctx.drawImage(croissantImg, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
}

function drawMuffin(x, y) {
    if (!muffinImg.complete || !muffinImg.naturalWidth) { return; }
    ctx.drawImage(muffinImg, x, y, 45, 50);
}

function drawBaguette(x, y, bobOffset) {
    if (!baguetteImg.complete || !baguetteImg.naturalWidth) { return; }
    ctx.drawImage(baguetteImg, x, y + bobOffset, 12, 38);
}

function drawBakery(centerX, groundY) {
    if (!bakeryImg.complete || !bakeryImg.naturalWidth) { return; }
    ctx.drawImage(bakeryImg, centerX - 65, groundY - 162, 130, 162);
}

var backgroundSparkles = [];

function initStars() {
    backgroundSparkles = [];
    for (var i = 0; i < 50; i++) {
        backgroundSparkles.push({
            x: Math.random() * 3000,
            y: Math.random() * canvasHeight * 0.45,
            radius: Math.random() * 2 + 1,
        });
    }
}

function drawClouds(cameraX) {
    var cloudPositions = [[200, 55], [520, 30], [980, 58], [1460, 38], [2050, 52], [2650, 34], [3300, 48]];
    var puffs = [[0, 0, 40], [30, 0, 32], [60, 4, 28], [-22, 4, 24], [80, 8, 20]];
    for (var i = 0; i < cloudPositions.length; i++) {
        var cloudX = cloudPositions[i][0];
        var cloudY = cloudPositions[i][1];
        var scrolled = (cloudX - cameraX * 0.18) % (canvasWidth + 400);
        var cloudScreenX = (scrolled + canvasWidth + 400) % (canvasWidth + 400) - 200;
        ctx.fillStyle = 'rgba(255,255,255,0.78)';
        for (var j = 0; j < puffs.length; j++) {
            var puff = puffs[j];
            ctx.beginPath();
            ctx.ellipse(cloudScreenX + puff[0], cloudY + puff[1], puff[2], puff[2] * 0.72, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawBackground(cameraX) {
    ctx.fillStyle = '#fce8f0';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight * 0.28);
    ctx.fillStyle = '#f8dce8';
    ctx.fillRect(0, canvasHeight * 0.28, canvasWidth, canvasHeight * 0.15);
    ctx.fillStyle = '#f4d8d0';
    ctx.fillRect(0, canvasHeight * 0.43, canvasWidth, canvasHeight * 0.15);
    ctx.fillStyle = '#f0e0c8';
    ctx.fillRect(0, canvasHeight * 0.58, canvasWidth, canvasHeight * 0.14);
    ctx.fillStyle = 'rgba(255,210,230,0.4)';
    for (var i = 0; i < backgroundSparkles.length; i++) {
        var sparkle = backgroundSparkles[i];
        ctx.beginPath();
        ctx.arc((sparkle.x - cameraX * 0.05 + 3000) % canvasWidth, sparkle.y, sparkle.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    drawClouds(cameraX);
}

function drawGround(groundY) {
    ctx.fillStyle = '#d8c8a8';
    ctx.fillRect(0, groundY, canvasWidth, canvasHeight - groundY);
    ctx.fillStyle = '#c8b898';
    ctx.fillRect(0, groundY + 18, canvasWidth, canvasHeight - groundY - 18);
    ctx.fillStyle = '#b8a888';
    ctx.fillRect(0, groundY + 38, canvasWidth, canvasHeight - groundY - 38);
}

function drawIcePlatform(screenX, screenY, width, height) {
    ctx.fillStyle = '#ddf0f8';
    ctx.beginPath();
    ctx.roundRect(screenX, screenY, width, height + 10, 4);
    ctx.fill();
    ctx.strokeStyle = '#a8d8ec';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillRect(screenX, screenY, width, 4);
}

function drawNormalPlatform(screenX, screenY, width, height) {
    ctx.fillStyle = '#ede0cc';
    ctx.beginPath();
    ctx.roundRect(screenX, screenY, width, height + 10, 4);
    ctx.fill();
    ctx.strokeStyle = '#d4b898';
    ctx.lineWidth = 1;
    ctx.stroke();
    for (var gx = 0; gx < width; gx += 8) {
        ctx.fillStyle = gx % 16 === 0 ? '#c0dca0' : '#b0cc90';
        ctx.fillRect(screenX + gx, screenY, 8, 5);
    }
}

function drawPlatforms(cameraX, groundY) {
    for (var i = 0; i < level.plats.length; i++) {
        var platform = level.plats[i];
        var screenX = platform.x - cameraX;
        var screenY = groundY + platform.y;
        if (screenX + platform.w < -80 || screenX > canvasWidth + 80) { continue; }
        if (platform.ice) {
            drawIcePlatform(screenX, screenY, platform.w, platform.h);
        } else {
            drawNormalPlatform(screenX, screenY, platform.w, platform.h);
        }
    }
}

function drawBaguettes(cameraX, groundY) {
    for (var i = 0; i < level.baguettes.length; i++) {
        var baguette = level.baguettes[i];
        if (baguette.collected) { continue; }
        var screenX = baguette.x - cameraX;
        if (screenX < -40 || screenX > canvasWidth + 40) { continue; }
        baguette.pulse++;
        var bobOffset = Math.sin(baguette.pulse * 0.06) * 5;
        drawBaguette(screenX, groundY + baguette.y, bobOffset);
        ctx.strokeStyle = 'rgba(220,160,60,0.22)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(screenX + 6, groundY + baguette.y + 19 + bobOffset, 14, 24, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function drawObstacles(cameraX, groundY) {
    for (var i = 0; i < level.obstacles.length; i++) {
        var obstacle = level.obstacles[i];
        var screenX = obstacle.x - cameraX;
        var screenY = groundY + obstacle.y - obstacle.h;
        if (screenX < -60 || screenX > canvasWidth + 60) { continue; }
        drawMuffin(screenX, screenY);
    }
}

function drawGoal(cameraX, groundY) {
    var screenX = level.finish.x - cameraX;
    var screenY = groundY + level.finish.y;
    if (screenX > -200 && screenX < canvasWidth + 200) {
        drawBakery(screenX, screenY);
    }
}

function drawHazardIndicators() {
    ctx.font = '12px Courier New';
    ctx.textAlign = 'left';
    if (level.def.wind > 0) {
        ctx.fillStyle = 'rgba(140,160,220,0.7)';
        ctx.fillText('~ wind ~', 10, canvasHeight - 20);
    }
    if (level.def.iceSlide) {
        ctx.fillStyle = 'rgba(100,190,230,0.8)';
        ctx.fillText('* ice *', 10, canvasHeight - 38);
    }
}

function drawScene(cameraX) {
    var groundY = canvasHeight * 0.72;
    drawBackground(cameraX);
    drawGround(groundY);
    drawPlatforms(cameraX, groundY);
    drawBaguettes(cameraX, groundY);
    drawObstacles(cameraX, groundY);
    drawGoal(cameraX, groundY);
    drawHazardIndicators();
}
