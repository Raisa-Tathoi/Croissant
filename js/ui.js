function buildStarDisplay(stars) {
    var display = '';
    for (var i = 0; i < stars; i++) {
        display += '★';
    }
    for (var i = stars; i < 3; i++) {
        display += '☆';
    }
    return display;
}

function applyLockedStyle(button, levelNum) {
    button.className += ' locked';
    button.innerHTML = '<span class="lnum">' + levelNum + '</span><span class="lstar">...</span>';
}

function applyCompletedStyle(button, levelNum) {
    button.className += ' unlocked done';
    var starDisplay = buildStarDisplay(levelStars[levelNum - 1]);
    button.innerHTML = '<span class="lnum">' + levelNum + '</span><span class="lstar">' + starDisplay + '</span>';
    (function(num) {
        button.onclick = function() { startLevel(num); };
    }(levelNum));
}

function applyUnlockedStyle(button, levelNum) {
    button.className += ' unlocked';
    button.innerHTML = '<span class="lnum">' + levelNum + '</span><span class="lstar">— — —</span>';
    (function(num) {
        button.onclick = function() { startLevel(num); };
    }(levelNum));
}

function buildLevelButton(levelNum) {
    var button = document.createElement('button');
    button.className = 'lvl-btn';
    var isUnlocked = levelNum <= maxUnlocked;
    var isCompleted = levelStars[levelNum - 1] > 0;
    if (!isUnlocked) {
        applyLockedStyle(button, levelNum);
    } else if (isCompleted) {
        applyCompletedStyle(button, levelNum);
    } else {
        applyUnlockedStyle(button, levelNum);
    }
    return button;
}

function buildLevelGrid() {
    var grid = document.getElementById('level-grid');
    grid.innerHTML = '';
    for (var levelNum = 1; levelNum <= 10; levelNum++) {
        grid.appendChild(buildLevelButton(levelNum));
    }
}

function showMenu() {
    gameRunning = false;
    buildLevelGrid();
    document.getElementById('menu').style.display = 'flex';
    document.getElementById('win').style.display = 'none';
    document.getElementById('gameover').style.display = 'none';
    document.getElementById('levelcard').style.display = 'none';
    document.getElementById('hud').style.display = 'none';
    document.getElementById('progress-bar').style.display = 'none';
    document.getElementById('mobile-controls').style.display = 'none';
}

function startLevel(levelNum) {
    if (levelNum > maxUnlocked) { return; }
    pendingLevel = levelNum;
    var levelDef = LEVEL_DEFS[levelNum - 1];
    document.getElementById('menu').style.display = 'none';
    document.getElementById('win').style.display = 'none';
    document.getElementById('gameover').style.display = 'none';
    document.getElementById('lc-title').textContent = 'Level ' + levelNum + ': ' + levelDef.name;
    document.getElementById('lc-desc').textContent = levelDef.desc;
    var dotsFilled = Math.ceil(levelNum / 2);
    var difficultyText = '';
    for (var i = 0; i < dotsFilled; i++) {
        difficultyText += '▪';
    }
    for (var i = dotsFilled; i < 5; i++) {
        difficultyText += '▫';
    }
    document.getElementById('lc-diff').textContent = difficultyText;
    document.getElementById('levelcard').style.display = 'flex';
}

function beginLevel() {
    var levelNum = pendingLevel;
    var levelDef = LEVEL_DEFS[levelNum - 1];
    currentLevel = levelNum;
    document.getElementById('levelcard').style.display = 'none';
    document.getElementById('hud').style.display = 'flex';
    document.getElementById('progress-bar').style.display = 'block';
    document.getElementById('progress-fill').style.width = '0%';
    if (isTouchDevice) { document.getElementById('mobile-controls').style.display = 'flex'; }
    level = buildLevel(levelDef);
    player = new Player(levelDef);
    gameOver = false;
    tick = 0;
    gameRunning = true;
    if (animationFrameId) { cancelAnimationFrame(animationFrameId); }
    gameLoop();
}
