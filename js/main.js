var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var canvasWidth, canvasHeight;

function resize() {
    canvasWidth = canvas.width = window.innerWidth;
    canvasHeight = canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);

var gameRunning = false;
var animationFrameId;
var tick = 0;
var currentLevel = 1;
var pendingLevel = 1;
var maxUnlocked = 1;
var levelStars = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var level, player, gameOver = false;
var keys = {};
var lastTime = 0;
var deltaTime = 1;

function saveProgress() {
    localStorage.setItem('maxUnlocked', maxUnlocked);
    localStorage.setItem('levelStars', JSON.stringify(levelStars));
}

function loadProgress() {
    var savedMax = localStorage.getItem('maxUnlocked');
    var savedStars = localStorage.getItem('levelStars');
    if (savedMax !== null) {
        maxUnlocked = parseInt(savedMax, 10);
    }
    if (savedStars !== null) {
        levelStars = JSON.parse(savedStars);
    }
}

function updateHud() {
    document.getElementById('h-level').textContent = 'Level ' + currentLevel;
    document.getElementById('h-bags').textContent = 'Baguettes: ' + player.baguettes;
    var levelProgress = Math.min(1, player.x / level.finish.x) * 100;
    document.getElementById('progress-fill').style.width = levelProgress + '%';
}

function gameLoop(timestamp) {
    if (!gameRunning) { return; }
    if (lastTime === 0) { lastTime = timestamp; }
    deltaTime = Math.min((timestamp - lastTime) / 16.667, 2.0);
    lastTime = timestamp;
    tick += deltaTime;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    updatePlatforms();
    var cameraX = Math.max(0, player.x - canvasWidth * 0.35);
    drawScene(cameraX);
    player.update(level.plats);
    player.collectBaguettes(level.baguettes);
    checkObstacles();
    checkFinish();
    player.draw(cameraX);
    updateHud();

    if (!gameOver && player.finished) {
        onLevelComplete();
    } else if (!gameOver && player.dead) {
        onPlayerDead();
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

function showWinScreen(levelNum, collected, total, starDisplay) {
    if (levelNum >= 10) {
        document.getElementById('win-title').textContent = 'You did it!';
        var allClear = 'All 10 levels cleared!  ' + collected + ' / ' + total + ' baguettes  |  ' + starDisplay;
        document.getElementById('win-sub').textContent = allClear;
        document.getElementById('win-next').textContent = 'Play Again';
        document.getElementById('win-next').onclick = function() { showMenu(); };
    } else {
        var nextLevelNum = levelNum + 1;
        document.getElementById('win-title').textContent = 'Level ' + levelNum + ' Clear!';
        var progress = collected + ' / ' + total + ' baguettes  |  ' + starDisplay;
        document.getElementById('win-sub').textContent = progress;
        document.getElementById('win-next').textContent = 'Next Level';
        document.getElementById('win-next').onclick = function() { startLevel(nextLevelNum); };
    }
    document.getElementById('win').style.display = 'flex';
    document.getElementById('hud').style.display = 'none';
    document.getElementById('progress-bar').style.display = 'none';
    document.getElementById('mobile-controls').style.display = 'none';
    buildLevelGrid();
}

function onLevelComplete() {
    gameOver = true;
    var total = level.baguettes.length;
    var stars = starsForBaguettes(player.baguettes, total);

    if (stars > levelStars[currentLevel - 1]) {
        levelStars[currentLevel - 1] = stars;
    }
    if (currentLevel >= maxUnlocked && currentLevel < 10) {
        maxUnlocked = currentLevel + 1;
    }

    saveProgress();
    var starDisplay = buildStarDisplay(stars);
    var levelNum = currentLevel;
    var collected = player.baguettes;
    setTimeout(function() { showWinScreen(levelNum, collected, total, starDisplay); }, 700);
}

function onPlayerDead() {
    gameOver = true;
    var levelNum = currentLevel;
    setTimeout(function() {
        var summary = 'Level ' + levelNum + '  |  ' + player.baguettes + ' baguettes collected';
        document.getElementById('go-sub').textContent = summary;
        document.getElementById('go-retry').textContent = 'Retry Level ' + levelNum;
        document.getElementById('go-retry').onclick = function() { startLevel(levelNum); };
        document.getElementById('gameover').style.display = 'flex';
        document.getElementById('hud').style.display = 'none';
        document.getElementById('progress-bar').style.display = 'none';
        document.getElementById('mobile-controls').style.display = 'none';
    }, 600);
}

var keyAliases = {
    'z': 'ArrowUp', 'Z': 'ArrowUp',
    'w': 'ArrowUp', 'W': 'ArrowUp',
    'a': 'ArrowLeft', 'A': 'ArrowLeft',
    'd': 'ArrowRight', 'D': 'ArrowRight'
};

window.addEventListener('keydown', function(e) {
    var mappedKey = keyAliases[e.key] || e.key;
    keys[mappedKey] = true;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].indexOf(e.key) > -1) {
        e.preventDefault();
    }
});

window.addEventListener('keyup', function(e) {
    var mappedKey = keyAliases[e.key] || e.key;
    keys[mappedKey] = false;
});

var isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0);

function setupTouchBtn(buttonId, keyName) {
    var button = document.getElementById(buttonId);
    button.addEventListener('touchstart', function(e) {
        e.preventDefault();
        keys[keyName] = true;
    }, { passive: false });
    button.addEventListener('touchend', function(e) {
        e.preventDefault();
        keys[keyName] = false;
    }, { passive: false });
    button.addEventListener('touchcancel', function(e) {
        e.preventDefault();
        keys[keyName] = false;
    }, { passive: false });
}

if (isTouchDevice) {
    setupTouchBtn('btn-jump', 'ArrowUp');
    setupTouchBtn('btn-right', 'ArrowRight');
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
}

loadProgress();
initStars();
buildLevelGrid();
ctx.fillStyle = '#fce8f0';
ctx.fillRect(0, 0, canvasWidth, canvasHeight);
