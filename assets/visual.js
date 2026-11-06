/* 三维讲解页面：切换场景、渲染控件、实时读数、驱动渲染循环 */
(function () {
  'use strict';

  var SCENES = window.SCENES || [];
  var LESSONS = window.LESSONS || [];
  var app = document.getElementById('vizapp');

  var renderer = null, scene = null, state = null;
  var spinning = false;

  function byId(id) {
    for (var i = 0; i < SCENES.length; i++) if (SCENES[i].id === id) return SCENES[i];
    return null;
  }
  function lessonOf(topicId) {
    for (var i = 0; i < LESSONS.length; i++) if (LESSONS[i].id === topicId) return LESSONS[i];
    return null;
  }
  function idFromHash() {
    var raw = (location.hash || '').replace(/^#\/?/, '');
    return raw || (SCENES[0] && SCENES[0].id);
  }
  function defaults(sc) {
    var s = {};
    (sc.controls || []).forEach(function (c) { s[c.key] = c.value; });
    return s;
  }
  function valText(c, v) { return c.fmt ? c.fmt(v) : String(v); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch];
    });
  }
  /* 场景文本里允许 <b> 标签，其余转义 */
  function rich(s) {
    return esc(s).replace(/&lt;b&gt;/g, '<b>').replace(/&lt;\/b&gt;/g, '</b>');
  }

  function tabLabel(sc) {
    var t = sc.title.split('：')[0];
    return t.length > 9 ? t.slice(0, 9) : t;
  }

  function build(sc) {
    var les = lessonOf(sc.topic);
    var tabs = SCENES.map(function (s) {
      return '<a href="#' + s.id + '"' + (s.id === sc.id ? ' class="on"' : '') + '>' + esc(tabLabel(s)) + '</a>';
    }).join('');

    var controls = (sc.controls || []).map(function (c) {
      if (c.type === 'seg') {
        var btns = c.options.map(function (o) {
          return '<button data-seg="' + esc(c.key) + '" data-val="' + esc(o.v) + '"' +
            (o.v === state[c.key] ? ' class="on"' : '') + '>' + esc(o.label) + '</button>';
        }).join('');
        return '<div class="ctl"><label>' + esc(c.label) + '</label><div class="seg">' + btns + '</div></div>';
      }
      return '<div class="ctl"><label for="ctl-' + esc(c.key) + '">' + esc(c.label) + ' <b id="v-' + esc(c.key) + '">' + esc(valText(c, state[c.key])) + '</b></label>' +
        '<input id="ctl-' + esc(c.key) + '" type="range" data-key="' + esc(c.key) + '" min="' + c.min + '" max="' + c.max + '" step="' + c.step + '" value="' + state[c.key] + '"></div>';
    }).join('');

    var qlinks = (sc.questionIds || []).map(function (qid) {
      return '<a href="index.html#/q/' + esc(qid) + '">做这题 · ' + esc(qid) + '</a>';
    }).join('');

    app.innerHTML =
      '<div class="scene-tabs">' + tabs + '</div>' +
      '<div class="crumb2">' + esc(les ? les.title : '') + ' · ' + esc(sc.kp) + '</div>' +
      '<h1 class="viz-h1">' + esc(sc.title) + '</h1>' +
      '<p class="one-liner">' + esc(sc.oneLiner) + '</p>' +
      '<div class="stage-wrap">' +
        '<canvas id="stage" aria-label="' + esc(sc.title) + '，可拖动旋转，使用缩放按钮调整大小">你的浏览器不支持画布，请参考下方文字说明。</canvas>' +
        '<div class="stage-tools">' +
          '<button data-act="zoom-in" aria-label="放大">＋</button>' +
          '<button data-act="zoom-out" aria-label="缩小">－</button>' +
          '<button data-act="reset">重置视角</button>' +
          '<button data-act="spin" aria-pressed="' + spinning + '">' + (spinning ? '停止旋转' : '自动旋转') + '</button>' +
        '</div>' +
        '<div class="stage-hint">拖动旋转 · 滚轮或按钮缩放</div>' +
      '</div>' +
      '<div class="controls">' + controls + '</div>' +
      '<div class="readout"><table><tbody id="ro"></tbody></table></div>' +
      '<div class="plain-box"><h2>人话版（先看这个）</h2><ol>' +
        (sc.plain || []).map(function (p) { return '<li>' + rich(p) + '</li>'; }).join('') +
      '</ol></div>' +
      '<div class="inq">' +
        '<div class="box-t">在题目里长这样</div>' +
        '<p>' + rich(sc.inQuestion || '') + '</p>' +
        '<div class="qlist">' + qlinks + '</div>' +
      '</div>' +
      (sc.formal ? '<details class="formal"><summary>课本原话（现在再看，就不那么难读了）</summary><p>' + esc(sc.formal) + '</p></details>' : '') +
      (les ? '<a class="lessonlink" href="index.html#/learn/' + sc.topic + (sc.section ? '#' + sc.section : '') + '">← 回到这一讲的文字讲解</a>' : '');

    if (renderer) renderer.destroy();
    var canvas = document.getElementById('stage');
    renderer = window.Viz.create(canvas);
    renderer.setAutoRotate(spinning);
    updateReadout();
    renderer.render(scene, state);
  }

  function updateReadout() {
    var box = document.getElementById('ro');
    if (!box || !scene) return;
    var rows = [];
    try {
      rows = scene.readout ? scene.readout(state) : [];
    } catch (e) {
      rows = [['读数出错', e.message]];
    }
    box.innerHTML = rows.map(function (r) {
      return '<tr><th>' + esc(r[0]) + '</th><td>' + esc(String(r[1])) + '</td></tr>';
    }).join('');
  }

  /* ---- 事件 ---- */
  app.addEventListener('input', function (e) {
    var input = e.target.closest ? e.target.closest('input[type=range]') : null;
    if (!input) return;
    var key = input.getAttribute('data-key');
    state[key] = parseFloat(input.value);
    var lbl = document.getElementById('v-' + key);
    if (lbl) {
      var c = null;
      (scene.controls || []).forEach(function (cc) { if (cc.key === key) c = cc; });
      if (c) lbl.textContent = valText(c, state[key]);
    }
    updateReadout();
    if (renderer) renderer.repaint();
  });

  app.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('button') : null;
    if (btn) {
      var segKey = btn.getAttribute('data-seg');
      if (segKey) {
        state[segKey] = btn.getAttribute('data-val');
        var sibs = btn.parentNode.querySelectorAll('button');
        for (var i = 0; i < sibs.length; i++) sibs[i].classList.toggle('on', sibs[i] === btn);
        updateReadout();
        if (renderer) renderer.repaint();
        return;
      }
      var act = btn.getAttribute('data-act');
      if (act === 'reset' && renderer) { renderer.reset(); return; }
      if (act === 'zoom-in' && renderer) { renderer.zoom(0.8); return; }
      if (act === 'zoom-out' && renderer) { renderer.zoom(1.25); return; }
      if (act === 'spin' && renderer) {
        spinning = !spinning;
        renderer.setAutoRotate(spinning);
        btn.setAttribute('aria-pressed', String(spinning));
        btn.classList.toggle('on', spinning);
        btn.textContent = spinning ? '停止旋转' : '自动旋转';
        return;
      }
    }
  });

  /* ---- 启动 ---- */
  function show() {
    var sc = byId(idFromHash()) || SCENES[0];
    if (!sc) {
      app.innerHTML = '<p>没有可用的场景。</p>';
      return;
    }
    if (sc !== scene) { scene = sc; state = defaults(sc); }
    build(sc);
  }

  window.addEventListener('hashchange', function () {
    var sc = byId(idFromHash());
    if (sc && sc !== scene) show();
  });

  /* 自动旋转用定时器驱动：requestAnimationFrame 在后台/隐藏面板里会被挂起 */
  function step() {
    if (renderer && renderer.tickSpin()) renderer.repaint();
  }

  show();
  setInterval(step, 33);
})();
