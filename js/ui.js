function buildLevelGrid() {
  var grid = document.getElementById('level-grid');
  grid.innerHTML = '';
  for (var n = 1; n <= 10; n++) {
    var btn      = document.createElement('button');
    btn.className = 'lvl-btn';
    var unlocked = n <= maxUnlocked;
    var done     = levelStars[n - 1] > 0;

    if (!unlocked) {
      btn.className += ' locked';
      btn.innerHTML  = '<span class="lnum">' + n + '</span><span class="lstar">🔒</span>';
    } else if (done) {
      btn.className += ' unlocked done';
      var stars = '';
      for (var s = 0; s < levelStars[n - 1]; s++) stars += '★';
      for (var s = levelStars[n - 1]; s < 3; s++)  stars += '☆';
      btn.innerHTML = '<span class="lnum">' + n + '</span><span class="lstar">' + stars + '</span>';
      (function(num) { btn.onclick = function() { startLevel(num); }; })(n);
    } else {
      btn.className += ' unlocked';
      btn.innerHTML  = '<span class="lnum">' + n + '</span><span class="lstar">— — —</span>';
      (function(num) { btn.onclick = function() { startLevel(num); }; })(n);
    }

    grid.appendChild(btn);
  }
}

function showMenu() {
  gameRunning = false;
  buildLevelGrid();
  document.getElementById('menu').style.display      = 'flex';
  document.getElementById('win').style.display       = 'none';
  document.getElementById('gameover').style.display  = 'none';
  document.getElementById('levelcard').style.display = 'none';
  document.getElementById('hud').style.display       = 'none';
}

function startLevel(num) {
  if (num > maxUnlocked) return;
  pendingLevel = num;
  var def = LEVEL_DEFS[num - 1];

  document.getElementById('menu').style.display      = 'none';
  document.getElementById('win').style.display       = 'none';
  document.getElementById('gameover').style.display  = 'none';
  document.getElementById('lc-title').textContent    = 'Level ' + num + ': ' + def.name;
  document.getElementById('lc-desc').textContent     = def.desc;

  var filled = Math.ceil(num / 2), diff = '';
  for (var i = 0; i < filled; i++) diff += '▪';
  for (var i = filled; i < 5; i++) diff += '▫';
  document.getElementById('lc-diff').textContent     = diff;
  document.getElementById('levelcard').style.display = 'flex';
}

function beginLevel() {
  var num = pendingLevel, def = LEVEL_DEFS[num - 1];
  currentLevel = num;

  document.getElementById('levelcard').style.display = 'none';
  document.getElementById('hud').style.display       = 'flex';

  level     = buildLevel(def);
  player    = new Player(def);
  gameOver  = false;
  startTime = Date.now();
  tick      = 0;
  gameRunning = true;

  if (animId) cancelAnimationFrame(animId);
  gameLoop();
}
