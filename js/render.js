// ── Rounded-rect helper (used by all sprite draw functions) ──
function rr(x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);   ctx.quadraticCurveTo(x + w, y,     x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);   ctx.quadraticCurveTo(x,     y + h, x,     y + h - r);
  ctx.lineTo(x, y + r);        ctx.quadraticCurveTo(x,     y,     x + r, y);
  ctx.closePath();
}

// ── Sprites ──────────────────────────────────────────────────

function drawCroissant(cx, cy, squishY, dead, walkFrame, facing) {
  ctx.save();
  ctx.translate(Math.round(cx), Math.round(cy));
  ctx.scale(facing, squishY);

  var S  = 3;
  var dk = '#7a3200', md = '#c86010', mn = '#e07820', lt = '#f0a040', pl = '#f8c870', wh = '#ffffff';

  var body = [
    [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,1,3,3,3,3,4,4,5,5,4,3,3,3,1,0,0,0,0,0,0],
    [0,0,0,1,3,3,4,6,6,4,1,1,4,6,4,3,3,3,1,0,0,0,0,0],
    [0,0,1,3,3,4,6,6,1,1,2,2,1,1,6,4,3,3,3,1,0,0,0,0],
    [0,1,2,3,4,4,1,1,2,2,3,3,2,2,1,1,4,4,3,2,1,0,0,0],
    [1,2,2,3,4,1,1,3,3,3,3,3,3,3,3,1,1,4,3,2,2,1,0,0],
    [1,2,3,3,1,1,3,4,4,4,4,4,4,4,4,3,1,1,3,3,2,1,0,0],
    [1,2,3,1,1,3,4,5,5,1,1,1,5,5,4,3,1,1,3,3,2,1,0,0],
    [1,2,3,1,3,4,5,5,1,2,2,2,1,5,5,4,3,1,3,3,2,1,0,0],
    [0,1,2,1,3,4,4,1,1,3,3,3,1,1,4,4,3,1,3,2,1,0,0,0],
    [0,0,1,1,3,3,4,1,1,3,3,3,1,1,4,3,3,1,1,1,0,0,0,0],
    [0,0,0,1,2,3,3,1,3,3,3,3,3,1,3,3,2,1,0,0,0,0,0,0],
    [0,0,0,0,1,2,3,3,3,4,4,4,3,3,3,2,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,2,2,3,3,3,3,3,2,2,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
  ];
  var cm = { 1: dk, 2: md, 3: mn, 4: lt, 5: pl, 6: wh };
  var bw = 24 * S, bh = 16 * S, ox = -bw / 2, oy = -bh / 2;

  for (var r = 0; r < body.length; r++) {
    for (var c = 0; c < body[r].length; c++) {
      var v = body[r][c];
      if (!v) continue;
      ctx.fillStyle = cm[v];
      ctx.fillRect(ox + c * S, oy + r * S, S, S);
    }
  }

  // Croissant tips (left and right horns)
  var tipG = [[0,1,1,0],[1,3,2,1],[1,4,3,1],[1,3,2,1],[0,1,1,0]];
  var tcm  = { 1: dk, 2: md, 3: mn, 4: lt };
  for (var r2 = 0; r2 < tipG.length; r2++) {
    for (var c2 = 0; c2 < tipG[r2].length; c2++) {
      var v2 = tipG[r2][c2];
      if (!v2) continue;
      ctx.fillStyle = tcm[v2];
      ctx.fillRect(ox - 4 * S + c2 * S,      oy + 9 * S + r2 * S, S, S);
      ctx.fillRect(ox + 24 * S + c2 * S - 2, oy + 7 * S + r2 * S, S, S);
    }
  }

  // Eyes (normal or dead X)
  if (!dead) {
    ctx.fillStyle = '#111111';
    ctx.fillRect(ox + 4 * S, oy + 5 * S, 16 * S, S);
    ctx.fillStyle = '#333333';
    ctx.fillRect(ox + 4 * S,      oy + 5 * S, 6 * S, 3 * S);
    ctx.fillRect(ox + 10 * S + 2, oy + 5 * S, 6 * S, 3 * S);
    for (var gr = 0; gr < 2; gr++) {
      for (var gc = 0; gc < 3; gc++) {
        if ((gr + gc) % 2 === 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.fillRect(ox + 5 * S  + gc * S, oy + 5 * S + gr * S, S, S);
          ctx.fillRect(ox + 11 * S + gc * S, oy + 5 * S + gr * S, S, S);
        }
      }
    }
    ctx.fillStyle = '#111111';
    ctx.fillRect(ox - 2 * S, oy + 5 * S, 3 * S, S);
    ctx.fillRect(ox + 21 * S, oy + 5 * S, 3 * S, S);
  } else {
    ctx.strokeStyle = '#cc3030';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ox + 5 * S, oy + 5 * S); ctx.lineTo(ox + 8 * S, oy + 8 * S); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox + 8 * S, oy + 5 * S); ctx.lineTo(ox + 5 * S, oy + 8 * S); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox + 12 * S, oy + 5 * S); ctx.lineTo(ox + 15 * S, oy + 8 * S); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox + 15 * S, oy + 5 * S); ctx.lineTo(ox + 12 * S, oy + 8 * S); ctx.stroke();
  }

  // Walking legs
  var legOff = [0, 3, -3, 0];
  var lL = legOff[walkFrame % 4], lR = legOff[(walkFrame + 2) % 4];
  ctx.fillStyle = '#111111';
  ctx.fillRect(ox + 8  * S, bh / 2,            S * 2, 10 + lL);
  ctx.fillRect(ox + 6  * S, bh / 2 + 10 + lL,  S * 3, S);
  ctx.fillRect(ox + 14 * S, bh / 2,            S * 2, 10 + lR);
  ctx.fillRect(ox + 14 * S, bh / 2 + 10 + lR,  S * 3, S);

  ctx.restore();
}

function drawMuffin(x, y) {
  var S = 4;
  var rows = [
    [0,0,1,1,1,1,1,0,0],
    [0,1,1,2,2,2,1,1,0],
    [1,1,2,2,3,2,2,1,1],
    [1,1,2,3,2,2,2,1,1],
    [0,1,1,1,1,1,1,1,0],
    [0,2,2,2,2,2,2,2,0],
    [0,2,3,2,2,3,2,2,0],
    [0,2,2,2,3,2,2,2,0],
    [0,0,2,2,2,2,2,0,0],
  ];
  var cm = { 1: '#f5dfa0', 2: '#d07040', 3: '#f0a060' };
  for (var r = 0; r < rows.length; r++) {
    for (var c = 0; c < rows[r].length; c++) {
      var v = rows[r][c];
      if (!v) continue;
      ctx.fillStyle = cm[v];
      ctx.fillRect(x + c * S, y + r * S, S, S);
    }
  }
}

function drawBaguette(x, y, bob) {
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.fillStyle = '#c87818'; rr(0, 0, 12, 38, 5); ctx.fill();
  ctx.fillStyle = '#e8a030'; rr(2, 3,  8, 32, 4); ctx.fill();
  ctx.strokeStyle = '#a05610'; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
  var marks = [8, 14, 20, 26];
  for (var m = 0; m < marks.length; m++) {
    ctx.beginPath(); ctx.moveTo(2, marks[m]); ctx.lineTo(10, marks[m] + 3); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,240,160,0.5)'; rr(3, 4, 3, 16, 2); ctx.fill();
  ctx.fillStyle = '#d4882a';
  ctx.beginPath(); ctx.ellipse(6,  2, 5, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(6, 36, 5, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawBakery(fx, fy) {
  // Building body
  ctx.fillStyle = '#f5e0d0'; rr(fx - 55, fy - 110, 110, 110, 6); ctx.fill();
  ctx.strokeStyle = '#d4a888'; ctx.lineWidth = 1.5; ctx.stroke();

  // Roof
  ctx.fillStyle = '#e8b4a0';
  ctx.beginPath(); ctx.moveTo(fx - 65, fy - 110); ctx.lineTo(fx, fy - 150); ctx.lineTo(fx + 65, fy - 110); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#c8907a'; ctx.lineWidth = 1.5; ctx.stroke();

  // Chimney and smoke
  ctx.fillStyle = '#d4a888'; ctx.fillRect(fx + 20, fy - 158, 16, 32);
  ctx.fillStyle = '#f5e0d0'; ctx.fillRect(fx + 17, fy - 162, 22, 8);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath(); ctx.ellipse(fx + 28, fy - 173, 7, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(fx + 34, fy - 184, 5, 5, 0, 0, Math.PI * 2); ctx.fill();

  // Sign
  ctx.fillStyle = '#f0c080'; rr(fx - 32, fy - 102, 64, 22, 4); ctx.fill();
  ctx.strokeStyle = '#c89040'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = '#7a4a10'; ctx.font = 'bold 9px Courier New'; ctx.textAlign = 'center';
  ctx.fillText('BOULANGERIE', fx, fy - 86);

  // Left window (with croissant display)
  ctx.fillStyle = '#d0eaff'; rr(fx - 48, fy - 90, 30, 28, 4); ctx.fill();
  ctx.strokeStyle = '#90b8d8'; ctx.lineWidth = 1; ctx.stroke();
  ctx.strokeStyle = '#b8d8f0';
  ctx.beginPath(); ctx.moveTo(fx - 33, fy - 90); ctx.lineTo(fx - 33, fy - 62); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(fx - 48, fy - 76); ctx.lineTo(fx - 18, fy - 76); ctx.stroke();
  ctx.fillStyle = '#e8a030';
  ctx.beginPath(); ctx.ellipse(fx - 39, fy - 72, 7, 4, 0.3, 0, Math.PI * 2); ctx.fill();

  // Right window (with baguette display)
  ctx.fillStyle = '#d0eaff'; rr(fx + 18, fy - 90, 30, 28, 4); ctx.fill();
  ctx.strokeStyle = '#90b8d8'; ctx.lineWidth = 1; ctx.stroke();
  ctx.strokeStyle = '#b8d8f0';
  ctx.beginPath(); ctx.moveTo(fx + 33, fy - 90); ctx.lineTo(fx + 33, fy - 62); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(fx + 18, fy - 76); ctx.lineTo(fx + 48, fy - 76); ctx.stroke();
  ctx.fillStyle = '#c87818'; rr(fx + 26, fy - 79, 18, 5, 2); ctx.fill();

  // Door
  ctx.fillStyle = '#c8907a'; rr(fx - 13, fy - 60, 26, 60, 4); ctx.fill();
  ctx.strokeStyle = '#a07060'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = '#f0d0b8';
  ctx.beginPath(); ctx.arc(fx + 8, fy - 35, 2.5, 0, Math.PI * 2); ctx.fill();

  // Awning
  ctx.fillStyle = '#f4b8c0';
  ctx.beginPath(); ctx.moveTo(fx - 58, fy - 68); ctx.lineTo(fx + 58, fy - 68); ctx.lineTo(fx + 54, fy - 55); ctx.lineTo(fx - 54, fy - 55); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#e090a0'; ctx.lineWidth = 1; ctx.stroke();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
  for (var i = -40; i <= 40; i += 14) {
    ctx.beginPath(); ctx.moveTo(fx + i, fy - 68); ctx.lineTo(fx + i + 4, fy - 55); ctx.stroke();
  }
  ctx.fillStyle = '#c87050';
  ctx.fillRect(fx - 52, fy - 55, 24, 8);
  ctx.fillRect(fx + 28, fy - 55, 24, 8);
  var fcols = ['#f4a0b0', '#f0d060', '#c0e080'];
  for (var fi = 0; fi < fcols.length; fi++) {
    ctx.fillStyle = fcols[fi];
    ctx.beginPath(); ctx.ellipse(fx - 46 + fi * 8, fy - 58, 4, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(fx + 32 + fi * 8, fy - 58, 4, 4, 0, 0, Math.PI * 2); ctx.fill();
  }

  // Finish banner
  ctx.fillStyle = '#f0e0ff'; rr(fx - 48, fy - 150, 96, 16, 4); ctx.fill();
  ctx.strokeStyle = '#c0a0e0'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = '#8060b0'; ctx.font = 'bold 9px Courier New'; ctx.textAlign = 'center';
  ctx.fillText('FINISH!', fx, fy - 139);
  var dotcols = ['#f4d060', '#f4a0b0', '#a0d0f0'];
  for (var di = 0; di < dotcols.length; di++) {
    ctx.fillStyle = dotcols[di];
    ctx.beginPath(); ctx.arc(fx - 38 + di * 38, fy - 150, 4, 0, Math.PI * 2); ctx.fill();
  }
}

// ── Background / scene ────────────────────────────────────────

var bgStars = [];

function initStars() {
  bgStars = [];
  for (var i = 0; i < 50; i++) {
    bgStars.push({ x: Math.random() * 3000, y: Math.random() * H * 0.45, r: Math.random() * 2 + 1 });
  }
}

function drawScene(camX) {
  // Pastel sky bands
  ctx.fillStyle = '#fce8f0'; ctx.fillRect(0, 0,        W, H * 0.28);
  ctx.fillStyle = '#f8dce8'; ctx.fillRect(0, H * 0.28, W, H * 0.15);
  ctx.fillStyle = '#f4d8d0'; ctx.fillRect(0, H * 0.43, W, H * 0.15);
  ctx.fillStyle = '#f0e0c8'; ctx.fillRect(0, H * 0.58, W, H * 0.14);

  // Parallax sparkle dots
  ctx.fillStyle = 'rgba(255,210,230,0.4)';
  for (var si = 0; si < bgStars.length; si++) {
    var s = bgStars[si];
    ctx.beginPath();
    ctx.arc((s.x - camX * 0.05 + 3000) % W, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Parallax clouds
  var cloudBases = [[200,55],[520,30],[980,58],[1460,38],[2050,52],[2650,34],[3300,48]];
  for (var ci = 0; ci < cloudBases.length; ci++) {
    var bx = cloudBases[ci][0], by = cloudBases[ci][1];
    var sx = ((bx - camX * 0.18) % (W + 400) + W + 400) % (W + 400) - 200;
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    var puffs = [[0,0,40],[30,0,32],[60,4,28],[-22,4,24],[80,8,20]];
    for (var oi = 0; oi < puffs.length; oi++) {
      ctx.beginPath();
      ctx.ellipse(sx + puffs[oi][0], by + puffs[oi][1], puffs[oi][2], puffs[oi][2] * 0.72, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  var gnd = H * 0.72;

  // Ground layers
  ctx.fillStyle = '#d8c8a8'; ctx.fillRect(0, gnd,      W, H - gnd);
  ctx.fillStyle = '#c8b898'; ctx.fillRect(0, gnd + 18, W, H - gnd - 18);
  ctx.fillStyle = '#b8a888'; ctx.fillRect(0, gnd + 38, W, H - gnd - 38);
  for (var gx = 0; gx < W; gx += 8) {
    ctx.fillStyle = gx % 16 === 0 ? '#c0dca0' : '#b0cc90';
    ctx.fillRect(gx, gnd, 8, 11);
  }

  // Platforms
  for (var pi = 0; pi < level.plats.length; pi++) {
    var p = level.plats[pi], px = p.x - camX, py = gnd + p.y;
    if (px + p.w < -80 || px > W + 80) continue;
    if (p.ice) {
      ctx.fillStyle = '#ddf0f8'; rr(px, py, p.w, p.h + 10, 4); ctx.fill();
      ctx.strokeStyle = '#a8d8ec'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(px, py, p.w, 4);
    } else {
      ctx.fillStyle = '#ede0cc'; rr(px, py, p.w, p.h + 10, 4); ctx.fill();
      ctx.strokeStyle = '#d4b898'; ctx.lineWidth = 1; ctx.stroke();
      for (var gx2 = 0; gx2 < p.w; gx2 += 8) {
        ctx.fillStyle = gx2 % 16 === 0 ? '#c0dca0' : '#b0cc90';
        ctx.fillRect(px + gx2, py, 8, 5);
      }
    }
  }

  // Collectible baguettes
  for (var bi = 0; bi < level.baguettes.length; bi++) {
    var b = level.baguettes[bi];
    if (b.collected) continue;
    var bx2 = b.x - camX;
    if (bx2 < -40 || bx2 > W + 40) continue;
    b.pulse++;
    var bob = Math.sin(b.pulse * 0.06) * 5;
    drawBaguette(bx2, gnd + b.y, bob);
    ctx.strokeStyle = 'rgba(220,160,60,0.22)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(bx2 + 6, gnd + b.y + 19 + bob, 14, 24, 0, 0, Math.PI * 2); ctx.stroke();
  }

  // Obstacle muffins
  for (var oi2 = 0; oi2 < level.obstacles.length; oi2++) {
    var o = level.obstacles[oi2], ox2 = o.x - camX, oy2 = gnd + o.y - o.h;
    if (ox2 < -60 || ox2 > W + 60) continue;
    drawMuffin(ox2, oy2);
  }

  // Goal bakery
  var fx = level.finish.x - camX, fy = gnd + level.finish.y;
  if (fx > -200 && fx < W + 200) drawBakery(fx, fy);

  // Active hazard indicators (bottom-left)
  if (level.def.wind > 0) {
    ctx.fillStyle = 'rgba(140,160,220,0.7)'; ctx.font = '12px Courier New'; ctx.textAlign = 'left';
    ctx.fillText('~ wind ~', 10, H - 20);
  }
  if (level.def.iceSlide) {
    ctx.fillStyle = 'rgba(100,190,230,0.8)'; ctx.font = '12px Courier New'; ctx.textAlign = 'left';
    ctx.fillText('* ice *', 10, H - 38);
  }
}
