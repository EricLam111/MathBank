/* 极小的 3D 渲染器：透视投影 + 画家算法排序，只画线 / 多边形 / 圆点 / 文字。
 * 只用 Canvas 2D，不依赖任何库，够讲数学分析。
 * 用法：const R = Viz.create(canvas); R.render(scene, state)
 * scene.draw(state, V) 里用 V.line / V.poly / V.box / V.dot / V.label 画东西。 */
(function () {
  'use strict';

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  function create(canvas) {
    var ctx = canvas.getContext('2d');
    var cam = { az: -0.62, el: 0.42, dist: 9.6, fov: 0.95, target: [0, 0, 0] };
    var W = 2, H = 2, f = 1, dpr = 1;
    var items = [];
    var dirty = true;
    var curScene = null, curState = null;
    var autoRotate = false;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      var r = canvas.getBoundingClientRect();
      var w = Math.max(1, Math.round(r.width * dpr));
      var h = Math.max(1, Math.round(r.height * dpr));
      if (w !== W || h !== H) {
        W = w; H = h;
        canvas.width = W; canvas.height = H;
        dirty = true;
      }
      f = (H / 2) / Math.tan(cam.fov / 2);
    }

    /* 世界坐标 → 屏幕坐标。返回 null 表示在相机后面。 */
    function project(p) {
      var x = p[0] - cam.target[0], y = p[1] - cam.target[1], z = p[2] - cam.target[2];
      var ca = Math.cos(cam.az), sa = Math.sin(cam.az);
      var x1 = x * ca - z * sa;
      var z1 = x * sa + z * ca;
      var ce = Math.cos(cam.el), se = Math.sin(cam.el);
      var y2 = y * ce - z1 * se;
      var z2 = y * se + z1 * ce;
      var d = cam.dist - z2;
      if (d < 0.3) return null;
      return { x: W / 2 + f * x1 / d, y: H / 2 - f * y2 / d, d: d, s: f / d };
    }

    function fade(d) { return clamp(cam.dist / d, 0.55, 1); }

    function pushLine(pts, opt) {
      opt = opt || {};
      var s = [], dsum = 0, q;
      for (var i = 0; i < pts.length; i++) {
        q = project(pts[i]);
        if (!q) return;
        s.push(q); dsum += q.d;
      }
      if (s.length < 2) return;
      var d = dsum / s.length;
      items.push({
        d: d, paint: function (c) {
          c.save();
          c.globalAlpha = (opt.alpha == null ? 1 : opt.alpha) * fade(d);
          c.strokeStyle = opt.color || '#1c2230';
          c.lineWidth = (opt.width || 2) * dpr;
          if (opt.dash) c.setLineDash(opt.dash.map(function (v) { return v * dpr; }));
          c.lineJoin = 'round'; c.lineCap = 'round';
          c.beginPath();
          c.moveTo(s[0].x, s[0].y);
          for (var k = 1; k < s.length; k++) c.lineTo(s[k].x, s[k].y);
          c.stroke();
          c.restore();
        }
      });
    }

    function pushPoly(pts, opt) {
      opt = opt || {};
      var s = [], dsum = 0, q;
      for (var i = 0; i < pts.length; i++) {
        q = project(pts[i]);
        if (!q) return;
        s.push(q); dsum += q.d;
      }
      if (s.length < 3) return;
      var d = dsum / s.length;
      items.push({
        d: d, paint: function (c) {
          c.save();
          c.globalAlpha = clamp((opt.alpha == null ? 0.2 : opt.alpha) * fade(d), 0, 1);
          c.beginPath();
          c.moveTo(s[0].x, s[0].y);
          for (var k = 1; k < s.length; k++) c.lineTo(s[k].x, s[k].y);
          c.closePath();
          if (opt.fill) { c.fillStyle = opt.fill; c.fill(); }
          if (opt.stroke) {
            c.strokeStyle = opt.stroke;
            c.lineWidth = (opt.width || 1.2) * dpr;
            if (opt.dash) c.setLineDash(opt.dash.map(function (v) { return v * dpr; }));
            c.stroke();
          }
          c.restore();
        }
      });
    }

    function pushDot(p, r, opt) {
      opt = opt || {};
      var q = project(p);
      if (!q) return;
      items.push({
        d: q.d - 0.002, paint: function (c) {
          var R = Math.max(1.4 * dpr, r * q.s);
          c.save();
          c.globalAlpha = (opt.alpha == null ? 1 : opt.alpha) * fade(q.d);
          if (opt.ring) {
            c.strokeStyle = opt.ring;
            c.lineWidth = 2 * dpr;
            c.beginPath(); c.arc(q.x, q.y, R + 3 * dpr, 0, 6.2832); c.stroke();
          }
          c.fillStyle = opt.color || '#0f766e';
          c.beginPath(); c.arc(q.x, q.y, R, 0, 6.2832); c.fill();
          c.restore();
        }
      });
    }

    function pushLabel(p, text, opt) {
      opt = opt || {};
      var q = project(p);
      if (!q) return;
      items.push({
        d: q.d - 0.004, paint: function (c) {
          c.save();
          c.globalAlpha = (opt.alpha == null ? 1 : opt.alpha) * fade(q.d);
          c.font = (opt.size || 13) * dpr + 'px -apple-system, "Noto Sans SC", "PingFang SC", sans-serif';
          c.textAlign = opt.align || 'left';
          c.textBaseline = 'middle';
          var x = q.x + (opt.dx || 0) * dpr, y = q.y + (opt.dy || 0) * dpr;
          c.lineWidth = 3.5 * dpr;
          c.strokeStyle = 'rgba(255,255,255,0.9)';
          c.lineJoin = 'round';
          c.strokeText(text, x, y);
          c.fillStyle = opt.color || '#1c2230';
          c.fillText(text, x, y);
          c.restore();
        }
      });
    }

    /* 立方体：6 个面，用不同亮度做出体积感 */
    function pushBox(x0, x1, y0, y1, z0, z1, opt) {
      opt = opt || {};
      var base = opt.color || '#0f766e';
      var a = opt.alpha == null ? 0.14 : opt.alpha;
      var top = opt.top || base, side = opt.side || base;
      pushPoly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], { fill: top, alpha: a * 1.5, stroke: opt.stroke });
      pushPoly([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], { fill: top, alpha: a * 0.7, stroke: opt.stroke });
      pushPoly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], { fill: side, alpha: a * 1.25, stroke: opt.stroke });
      pushPoly([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], { fill: side, alpha: a * 0.8, stroke: opt.stroke });
      pushPoly([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], { fill: side, alpha: a, stroke: opt.stroke });
      pushPoly([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], { fill: side, alpha: a * 0.9, stroke: opt.stroke });
    }

    var V = {
      line: pushLine,
      poly: pushPoly,
      dot: pushDot,
      label: pushLabel,
      box: pushBox,
      /* 屏幕空间的图例文字 */
      legend: function (text, x, y, opt) {
        opt = opt || {};
        items.push({
          d: 1e9, paint: function (c) {
            c.save();
            c.font = (opt.size || 12) * dpr + 'px -apple-system, "Noto Sans SC", sans-serif';
            c.textAlign = 'left'; c.textBaseline = 'top';
            c.fillStyle = opt.color || '#5a6478';
            c.fillText(text, x * dpr, y * dpr);
            c.restore();
          }
        });
      },
      /* 简单的三轴指示器（画在左下角） */
      axes: function (opt) {
        opt = opt || {};
        var L = opt.len || 1.1;
        pushLine([[0, 0, 0], [L, 0, 0]], { color: '#b3261e', width: 2 });
        pushLine([[0, 0, 0], [0, L, 0]], { color: '#177245', width: 2 });
        pushLine([[0, 0, 0], [0, 0, L]], { color: '#2b5fa8', width: 2 });
        pushLabel([L, 0, 0], opt.x || 'x', { color: '#b3261e', size: 12, dx: 4 });
        pushLabel([0, L, 0], opt.y || 'y', { color: '#177245', size: 12, dx: 4 });
        pushLabel([0, 0, L], opt.z || 'z', { color: '#2b5fa8', size: 12, dx: 4 });
      }
    };

    function render(scene, state) {
      curScene = scene; curState = state;
      resize();
      ctx.clearRect(0, 0, W, H);
      items = [];
      try {
        scene.draw(state || {}, V);
      } catch (err) {
        items = [];
        pushLabel([0, 0, 0], '场景出错：' + err.message, { color: '#b3261e', size: 14 });
      }
      items.sort(function (a, b) { return b.d - a.d; });
      for (var i = 0; i < items.length; i++) items[i].paint(ctx);
      dirty = false;
    }
    /* 立即重画：不依赖 requestAnimationFrame，后台标签页也能刷新 */
    function repaint() { if (curScene) render(curScene, curState); }

    /* ---- 交互：拖动旋转、滚轮/双指缩放 ---- */
    var dragging = false, lastX = 0, lastY = 0;
    canvas.style.touchAction = 'none';
    canvas.style.cursor = 'grab';

    canvas.addEventListener('pointerdown', function (e) {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      canvas.style.cursor = 'grabbing';
      try { canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); } catch (err) {}
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      cam.az -= (e.clientX - lastX) * 0.0085;
      cam.el = clamp(cam.el + (e.clientY - lastY) * 0.0075, -0.35, 1.35);
      lastX = e.clientX; lastY = e.clientY;
      repaint();
    });
    function endDrag() { dragging = false; canvas.style.cursor = 'grab'; }
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);
    canvas.addEventListener('wheel', function (e) {
      e.preventDefault();
      cam.dist = clamp(cam.dist * (1 + (e.deltaY > 0 ? 0.09 : -0.09)), 3.2, 30);
      repaint();
    }, { passive: false });

    function onResize() { repaint(); }
    window.addEventListener('resize', onResize);

    return {
      render: render,
      destroy: function () { window.removeEventListener('resize', onResize); },
      isDirty: function () { return dirty || autoRotate; },
      markDirty: function () { dirty = true; },
      repaint: repaint,
      setAutoRotate: function (v) { autoRotate = !!v; },
      tickSpin: function () {
        if (!autoRotate) return false;
        cam.az += 0.0042;
        return true;
      },
      reset: function () {
        cam.az = -0.62; cam.el = 0.42; cam.dist = 9.6;
        repaint();
      },
      zoom: function (k) { cam.dist = clamp(cam.dist * k, 3.2, 30); repaint(); }
    };
  }

  window.Viz = { create: create };
})();
