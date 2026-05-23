function buildLevel(def) {
  var plats = [], obstacles = [], baguettes = [];

  // Starting platform
  plats.push({ x: 0, y: 0, w: 380, h: 16, vx: 0, dir: 1, minX: 0, maxX: 0, ice: false });

  var cx = 380;
  for (var i = 0; i < 28; i++) {
    var gap      = def.gap + Math.random() * 40;
    cx          += gap;
    var w        = def.narrow ? 80 + Math.random() * 60 : 140 + Math.random() * 120;
    var y        = (Math.random() - 0.5) * 120;
    var isMoving = def.movingPlats && Math.random() < 0.55;
    var isIce    = def.iceSlide   && Math.random() < 0.45;
    var amp      = isMoving ? 40 + Math.random() * 60 : 0;

    plats.push({
      x: cx, y: y, w: w, h: 16,
      vx: isMoving ? (Math.random() < 0.5 ? 1 : -1) * 1.2 : 0,
      dir: 1, minX: cx - amp, maxX: cx + amp, ice: isIce,
    });

    // Optional muffin obstacle
    var obsX = null;
    if (def.obsFreq > 0 && Math.random() < def.obsFreq && w > 80) {
      obsX = cx + 20 + Math.random() * (w - 60);
      obstacles.push({ x: obsX, y: y - 36, w: 32, h: 36 });
    }

    // Baguettes — skip spots too close to a muffin
    var bc = Math.floor(Math.random() * 3) + 1;
    for (var b = 0; b < bc; b++) {
      var bx = cx + 20 + b * (w / (bc + 1));
      if (obsX !== null && Math.abs(bx - obsX) < SAFE_DIST) continue;
      baguettes.push({ x: bx, y: y - 55 - Math.random() * 30, w: 12, h: 38, collected: false, pulse: Math.random() * 60 });
    }

    cx += w;
  }

  // Goal platform
  cx += 60;
  plats.push({ x: cx, y: 0, w: 500, h: 16, vx: 0, dir: 1, minX: cx, maxX: cx, ice: false });

  return {
    plats:     plats,
    obstacles: obstacles,
    baguettes: baguettes,
    finish:    { x: cx + 380, y: -120 },
    def:       def,
  };
}

function updatePlatforms() {
  for (var i = 0; i < level.plats.length; i++) {
    var p = level.plats[i];
    if (!p.vx) continue;
    p.x += p.vx * p.dir;
    if (p.x > p.maxX || p.x < p.minX) p.dir *= -1;
  }
}

function checkObstacles() {
  var gnd = H * 0.72;
  for (var i = 0; i < level.obstacles.length; i++) {
    var o  = level.obstacles[i];
    var oy = gnd + o.y - o.h;
    var hitsX = player.x + player.w - 8 > o.x + 4 && player.x + 8 < o.x + o.w - 4;
    var hitsY = player.y + player.h - 6 > oy + 4   && player.y + 6 < oy + o.h - 4;
    if (hitsX && hitsY) player.dead = true;
  }
}

function checkFinish() {
  var gnd = H * 0.72, fy = gnd + level.finish.y;
  if (!player.finished && !player.dead &&
      player.x + player.w > level.finish.x - 55 &&
      player.y + player.h > fy - 10) {
    player.finished = true;
  }
}

function starsForTime(elapsed, levelNum) {
  var par = 20 + levelNum * 4;
  if (elapsed < par * 0.7) return 3;
  if (elapsed < par)       return 2;
  return 1;
}
