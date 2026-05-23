// ── Canvas ───────────────────────────────────────────────────
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// ── Game state ───────────────────────────────────────────────
var gameRunning  = false;
var animId;
var tick         = 0;
var currentLevel = 1;
var pendingLevel = 1;
var maxUnlocked  = 1;
var levelStars   = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var level, player, gameOver = false, startTime;
var keys = {};

// ── Game loop ────────────────────────────────────────────────
function gameLoop() {
  if (!gameRunning) return;
  tick++;
  ctx.clearRect(0, 0, W, H);

  updatePlatforms();
  var camX = Math.max(0, player.x - W * 0.35);
  drawScene(camX);
  player.update(level.plats);
  player.collectBaguettes(level.baguettes);
  checkObstacles();
  checkFinish();
  player.draw(camX);

  // HUD update
  var elapsed = (Date.now() - startTime) / 1000;
  document.getElementById('h-timer').textContent = elapsed.toFixed(1) + 's';
  document.getElementById('h-level').textContent = 'Level ' + currentLevel;
  document.getElementById('h-bags').textContent  = 'Baguettes: ' + player.baguettes;

  if (!gameOver) {
    if (player.finished) {
      onLevelComplete(elapsed);
    } else if (player.dead) {
      onPlayerDead();
    }
  }

  animId = requestAnimationFrame(gameLoop);
}

function onLevelComplete(elapsed) {
  gameOver = true;
  var t      = elapsed.toFixed(1);
  var st     = starsForTime(elapsed, currentLevel);

  if (st > levelStars[currentLevel - 1]) levelStars[currentLevel - 1] = st;
  if (currentLevel >= maxUnlocked && currentLevel < 10) maxUnlocked = currentLevel + 1;

  var starStr = '';
  for (var i = 0; i < st; i++) starStr += '★';
  for (var i = st; i < 3; i++) starStr += '☆';

  var lvl = currentLevel;
  setTimeout(function() {
    if (lvl >= 10) {
      document.getElementById('win-title').textContent = 'You did it!';
      document.getElementById('win-sub').textContent   = 'All 10 levels cleared!\n' + t + 's | ' + player.baguettes + ' baguettes | ' + starStr;
      document.getElementById('win-next').textContent  = 'Play Again';
      document.getElementById('win-next').onclick      = function() { showMenu(); };
    } else {
      var nl = lvl + 1;
      document.getElementById('win-title').textContent = 'Level ' + lvl + ' Clear!';
      document.getElementById('win-sub').textContent   = t + 's  |  ' + player.baguettes + ' baguettes  |  ' + starStr;
      document.getElementById('win-next').textContent  = 'Next Level';
      document.getElementById('win-next').onclick      = function() { startLevel(nl); };
    }
    document.getElementById('win').style.display = 'flex';
    document.getElementById('hud').style.display = 'none';
    buildLevelGrid();
  }, 700);
}

function onPlayerDead() {
  gameOver = true;
  var lvl  = currentLevel;
  setTimeout(function() {
    document.getElementById('go-sub').textContent      = 'Level ' + lvl + '  |  ' + player.baguettes + ' baguettes collected';
    document.getElementById('go-retry').textContent    = 'Retry Level ' + lvl;
    document.getElementById('go-retry').onclick        = function() { startLevel(lvl); };
    document.getElementById('gameover').style.display  = 'flex';
    document.getElementById('hud').style.display       = 'none';
  }, 600);
}

// ── Input ────────────────────────────────────────────────────
var keyFwd = { 'z': 'ArrowUp', 'Z': 'ArrowUp' };

window.addEventListener('keydown', function(e) {
  var k = keyFwd[e.key] || e.key;
  keys[k] = true;
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].indexOf(e.key) > -1) e.preventDefault();
});
window.addEventListener('keyup', function(e) {
  var k = keyFwd[e.key] || e.key;
  keys[k] = false;
});

// ── Boot ─────────────────────────────────────────────────────
initStars();
buildLevelGrid();
ctx.fillStyle = '#fce8f0';
ctx.fillRect(0, 0, W, H);
