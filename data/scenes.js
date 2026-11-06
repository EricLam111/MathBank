/* 三维讲解场景：每个场景 = 一句话直觉 + 人话解释 + 可调参数 + 场景绘制函数。
 * 每个场景绑定到课程里的一讲（topic/section），并可关联具体题目（questionIds）。
 * draw(state, V) 里用 V.line / V.poly / V.box / V.dot / V.label 画东西。 */
window.SCENES = [

  /* ===================== 1. ε-N ===================== */
  {
    id: 'eps-n', topic: 't1', section: 's1', kp: 'ε-N 定义',
    title: 'ε-N：考官给容忍度，你交出「从第几项开始」',
    oneLiner: '极限不是「到达」，而是「迟早一直贴着」。',
    plain: [
      '把 ε 想成考官手里的<b>误差容忍度</b>。他问：从第几项之后，能保证后面的每一项都落在 ±ε 里？',
      '你的回答就是 N。ε 越小，你能交出的 N 就越大——所以 <b>N 是 ε 的函数</b>，这就是定义里 N 排在 ε 后面的原因。',
      '拖一下下面的 ε：夹子变窄，绿色的点（进入夹子的部分）就往后缩。N 一旦确定，右边<b>所有</b>点都必须绿。',
      '定义里那些符号只是在给这段对话做记录：∀ε 是考官开口，∃N 是你作答，"∀n>N" 是"从此以后"。'
    ],
    inQuestion: 'q1-2 中 |aₙ−2| = 5/(n+3)。直接解得 n > 5/ε−3，可取 N = max(1, ⌈5/ε−3⌉)；也可用 5/n 放大误差，取较保守的 ⌈5/ε⌉。',
    formal: '∀ε>0, ∃N∈ℕ, ∀n>N: |aₙ − A| < ε',
    questionIds: ['q1-1', 'q1-2', 'q1-3'],
    controls: [{ key: 'eps', label: 'ε（考官给的容忍度）', min: 0.05, max: 1.2, step: 0.01, value: 0.3, fmt: function (v) { return v.toFixed(2); } }],
    readout: function (s) {
      var N = Math.max(1, Math.ceil(5 / s.eps - 3));
      return [
        ['ε', s.eps.toFixed(2)],
        ['需要从第几项开始（N）', '第 ' + N + ' 项之后全部进夹子'],
        ['误差', '|aₙ−2| = 5/(n+3) < ε  ⟺  n > 5/ε−3 ≈ ' + (5 / s.eps - 3).toFixed(2)],
        ['所以', 'N = max(1, ⌈5/ε−3⌉) = ' + N]
      ];
    },
    draw: function (s, V) {
      var eps = s.eps, NMAX = 40, KX = 3.0, KY = 1.6;
      var N = Math.max(1, Math.ceil(5 / eps - 3));
      var xn = function (n) { return (n - 1) / (NMAX - 1) * 2 * KX - KX; };
      var an = function (n) { return (2 * n + 1) / (n + 3); };

      /* ε 夹子 */
      V.box(-KX - 0.15, KX + 0.15, -eps * KY, eps * KY, -0.7, 0.7,
        { color: '#0f766e', alpha: 0.09, stroke: 'rgba(15,118,110,0.35)' });
      /* 极限线 */
      V.line([[-KX - 0.15, 0, 0.7], [KX + 0.15, 0, 0.7]], { color: '#1c2230', width: 2.5 });
      V.label([KX + 0.2, 0, 0.7], '极限 A = 2', { size: 13, color: '#1c2230', dx: 6 });
      V.label([-KX + 0.05, eps * KY + 0.16, 0.7], '上边界 A+ε', { size: 11, color: '#0f766e' });
      V.label([-KX + 0.05, -eps * KY - 0.16, 0.7], '下边界 A−ε', { size: 11, color: '#0f766e' });

      /* 数列的点 */
      for (var n = 1; n <= NMAX; n++) {
        var inside = Math.abs(an(n) - 2) < eps;
        V.dot([xn(n), (an(n) - 2) * KY, 0.7], 0.055,
          { color: inside ? '#177245' : '#9aa3b2', alpha: inside ? 1 : 0.85 });
      }
      /* N 的位置 */
      var xN = xn(Math.min(N, NMAX));
      V.line([[xN, -1.45, 0.7], [xN, 0.55, 0.7]], { color: '#b3261e', width: 2, dash: [6, 5] });
      V.label([xN, 0.72, 0.7], N > NMAX ? 'N=' + N + '（超出画面）' : 'N=' + N + '，此项之后全部进入', { size: 12, color: '#b3261e', align: 'center' });

      V.label([-KX, -1.62, 0.7], 'n = 1', { size: 11, color: '#5a6478' });
      V.label([KX, -1.62, 0.7], 'n = 40', { size: 11, color: '#5a6478', align: 'right' });
      V.legend('灰点 = 还没进夹子   绿点 = 已经在夹子里', 12, 12);
    }
  },

  /* ===================== 2. ε-δ ===================== */
  {
    id: 'eps-delta', topic: 't2', section: 's1', kp: 'ε-δ 定义',
    title: 'ε-δ：横着量 δ，竖着量 ε，中间的曲线要待在里面',
    oneLiner: 'ε 管高度，δ 管宽度；你只要保证「x 进了 δ，f(x) 就出不了 ε」。',
    plain: [
      '先看那块<b>横着的玻璃板</b>：它是 ε，管的是函数值（竖方向）的误差。再看那块<b>竖着的玻璃板</b>：它是 δ，管的是 x 靠近到什么程度。',
      '对每个 ε，都要找到合适的 δ，使得 0<|x−x₀|<δ 时曲线始终落在 ε 范围内。图中展示的是一个具体 ε，不是完整证明。',
      '拖动 ε：板子变薄，δ 自动跟着变薄（这里是 δ = ε/3）。这个「自动跟着」就是你证明里写 δ 的取值。',
      '本例中 |f(x)−L| = 3|x−x₀|；一般若在所选邻域有 |f(x)−L| ≤ K|x−x₀|，也可能需要同时限制邻域大小。'
    ],
    inQuestion: 'q2-1 里问「ε=0.03 时 δ 取多少」，答案就是 0.01 = ε/3。你不需要"想"，只需要看 K：f(x)=3x+1 的 K 是 3，所以除 3。滑块拖到 ε=0.03 时读数和题目一模一样。',
    formal: '∀ε>0, ∃δ>0, ∀x: 0<|x−x₀|<δ ⇒ |f(x)−L|<ε',
    questionIds: ['q2-1', 'q2-2'],
    controls: [{ key: 'eps', label: 'ε（函数值的容忍度）', min: 0.03, max: 1.2, step: 0.01, value: 0.6, fmt: function (v) { return v.toFixed(2); } }],
    readout: function (s) {
      var d = s.eps / 3;
      return [
        ['ε', s.eps.toFixed(2)],
        ['δ = ε/3', d.toFixed(3) + '　（因为斜率 K=3）'],
        ['含义', 'x 落在 (' + (2 - d).toFixed(3) + ', ' + (2 + d).toFixed(3) + ') 内 ⇒ f(x) 落在 (' + (7 - s.eps).toFixed(2) + ', ' + (7 + s.eps).toFixed(2) + ') 内']
      ];
    },
    draw: function (s, V) {
      var eps = s.eps, d = eps / 3;
      var KX = 2.6, KY = 1.3;
      var X = function (x) { return (x - 2) * KX; };
      var Y = function (y) { return (y - 7) * KY; };

      /* ε 板（横向，管 y） */
      V.box(-2.9, 2.9, -eps * KY, eps * KY, -0.75, 0.75,
        { color: '#2b5fa8', alpha: 0.1, stroke: 'rgba(43,95,168,0.4)' });
      /* δ 板（竖向，管 x） */
      V.box(-d * KX, d * KX, -2.2, 2.2, -0.75, 0.75,
        { color: '#b3261e', alpha: 0.1, stroke: 'rgba(179,38,30,0.4)' });

      /* 曲线 y=3x+1 */
      var pts = [];
      for (var i = 0; i <= 60; i++) {
        var x = -1.05 + 2.1 * i / 60;
        pts.push([X(2 + x), Y(7 + 3 * x), 0.75]);
      }
      V.line(pts, { color: '#1c2230', width: 2.6 });
      V.label([X(3.2), Y(7 + 3.6), 0.75], 'f(x) = 3x+1', { size: 13, color: '#1c2230', dx: 6 });

      /* 目标点 */
      V.dot([0, 0, 0.75], 0.075, { color: '#b3261e' });
      V.label([0, 0, 0.75], '(2, 7)', { size: 12, color: '#b3261e', dx: 10, dy: -12 });

      /* δ 边界在曲线上的两个点 */
      V.dot([X(2 - d), Y(7 - 3 * d), 0.75], 0.05, { color: '#b3261e' });
      V.dot([X(2 + d), Y(7 + 3 * d), 0.75], 0.05, { color: '#b3261e' });

      V.label([-2.85, eps * KY + 0.14, 0.75], 'ε 板：函数值的容差', { size: 12, color: '#2b5fa8' });
      V.label([-d * KX, -2.4, 0.75], 'δ 板：x 能偏多少', { size: 12, color: '#b3261e', align: 'center' });
      V.legend('拖动旋转可看到两块板在空间里互相垂直', 12, 12);
    }
  },

  /* ===================== 3. 可导 vs 连续 ===================== */
  {
    id: 'deriv-probe', topic: 't3', section: 's2', kp: '可导与导数连续',
    title: '可导性探针：左右两根割线能不能合成一条切线',
    oneLiner: '可导 = 从左边量、从右边量，斜率收敛到同一个数。',
    plain: [
      '红线和蓝线是从左右两侧逼近 x=0 的割线。<b>它们的斜率相等且收敛</b>，才叫可导。',
      '切换下面三种函数看差别：|x| 的左右斜率永远是 −1 和 +1，永远对不上；x³ 的左右斜率都趋于 0，所以可导。',
      '第三个 x²sin(1/x) 最阴险：左右斜率<b>都在乱跳</b>，但都趋近于 0——所以它在 0 处可导，可是导数本身不连续。',
      '这就是为什么"可导"推不出"导数连续"：可导只要求<b>这一点</b>的极限存在，不要求导数在附近安分。'
    ],
    inQuestion: 'q3-1 问 x²sin(1/x) 在 0 处的导数，你被要求"用定义算"——因为公式在这一点不成立。q3-3 更进一步问你 f′ 在 0 处是否连续。拖小 h 看两根斜率怎么动，这两题就变成一个画面了。',
    formal: 'f′(x₀) = lim(h→0) [f(x₀+h) − f(x₀)] / h　（左右极限存在且相等）',
    questionIds: ['q3-1', 'q3-3', 'q3-4'],
    controls: [
      { key: 'mode', type: 'seg', label: '函数', options: [
        { v: 'abs', label: '|x|（尖点）' },
        { v: 'cube', label: 'x³（光滑）' },
        { v: 'osc', label: 'x²sin(1/x)（振荡）' }
      ], value: 'abs' },
      { key: 'h', label: 'h（离 0 有多远）', min: 0.004, max: 0.9, step: 0.004, value: 0.3, fmt: function (v) { return v.toFixed(3); } }
    ],
    readout: function (s) {
      var f = F(s.mode), h = s.h;
      var sl = (f(0) - f(-h)) / h, sr = (f(h) - f(0)) / h;
      var gap = Math.abs(sl - sr);
      return [
        ['h', h.toFixed(3)],
        ['左侧斜率', sl.toFixed(4)],
        ['右侧斜率', sr.toFixed(4)],
        ['差值', gap.toFixed(4) + '　（单个 h 的读数不能证明可导性，须考察 h→0 的极限）']
      ];
    },
    draw: function (s, V) {
      var f = F(s.mode), h = s.h;
      var KX = 1.9, KY = 1.9;
      var X = function (x) { return x * KX; };
      var Y = function (y) { return y * KY; };

      /* 曲线 */
      var pts = [];
      for (var i = 0; i <= 200; i++) {
        var x = -1 + 2 * i / 200;
        var y = f(x);
        if (Math.abs(y) < 4) pts.push([X(x), Y(y), 0]);
      }
      V.line(pts, { color: '#1c2230', width: 2.6 });

      /* 坐标轴 */
      V.line([[X(-1.15), 0, 0], [X(1.15), 0, 0]], { color: '#c9ccd4', width: 1.2 });
      V.line([[0, Y(-1.2), 0], [0, Y(1.2), 0]], { color: '#c9ccd4', width: 1.2 });

      /* 左右割线（延长到画面边缘） */
      var sl = (f(0) - f(-h)) / h, sr = (f(h) - f(0)) / h;
      var ext = 1.1;
      V.line([[X(-ext), Y(-sl * ext), 0], [0, 0, 0]], { color: '#2b5fa8', width: 2.4 });
      V.line([[0, 0, 0], [X(ext), Y(sr * ext), 0]], { color: '#b3261e', width: 2.4 });

      /* 两个取样点 */
      V.dot([X(-h), Y(f(-h)), 0], 0.07, { color: '#2b5fa8' });
      V.dot([X(h), Y(f(h)), 0], 0.07, { color: '#b3261e' });
      V.dot([0, 0, 0], 0.06, { color: '#1c2230' });
      V.label([X(-h), Y(f(-h)), 0], '−h', { size: 12, color: '#2b5fa8', dy: -14, align: 'center' });
      V.label([X(h), Y(f(h)), 0], '+h', { size: 12, color: '#b3261e', dy: -14, align: 'center' });

      V.label([X(-1.12), Y(1.05), 0], '左斜率 ' + sl.toFixed(3), { size: 12, color: '#2b5fa8' });
      V.label([X(0.62), Y(-1.12), 0], '右斜率 ' + sr.toFixed(3), { size: 12, color: '#b3261e' });
      V.legend(s.mode === 'abs' ? '尖点：左右斜率永远差 2' : (s.mode === 'cube' ? '两边斜率都趋于 0 → 光滑' : '两边斜率乱跳但都趋于 0 → 可导但导数不连续'), 12, 12);
    }
  },

  /* ===================== 4. 中值定理 ===================== */
  {
    id: 'mvt', topic: 't4', section: 's1', kp: 'Lagrange 中值定理',
    title: '中值定理：割线与某处切线平行',
    oneLiner: '平均变化率，一定等于某一点的瞬时变化率。',
    plain: [
      '黑线是函数，灰虚线是<b>割线</b>（两端连起来）：它的斜率代表"整段的平均速度"。',
      '拖动 ξ 观察红色切线：对于图中的 x³，切线斜率连续变化，某处会与割线斜率相等。一般中值定理不要求导数连续。',
      '那一刻的位置就是定理里的 ξ。所以定理其实是一句大白话：<b>平均速度必然在某一瞬间被达到过</b>。',
      '做证明题时，这条思路就是"构造函数，然后对它用中值定理"：你想证的不等式，往往就是"某个斜率被夹住"。'
    ],
    inQuestion: 'q4-2 让你求 x³ 在 [0,1] 上的 ξ，你解的就是"切线斜率 = 割线斜率"：3ξ² = 1。读数里的"差值"归零的位置就是 ξ=0.577。q4-1 考的是反面：|x| 在 0 处没有切线，定理就用不了。',
    formal: 'f 在 [a,b] 连续、在 (a,b) 可导 ⇒ 存在 ξ∈(a,b)，f(b) − f(a) = f′(ξ)(b − a)',
    questionIds: ['q4-1', 'q4-2'],
    controls: [{ key: 'xi', label: 'ξ 的位置', min: 0, max: 1, step: 0.005, value: 0.9, fmt: function (v) { return v.toFixed(3); } }],
    readout: function (s) {
      var sec = 1, tan = 3 * s.xi * s.xi;
      return [
        ['ξ', s.xi.toFixed(3)],
        ['割线斜率', sec.toFixed(3)],
        ['切线斜率 3ξ²', tan.toFixed(3)],
        ['差值', Math.abs(tan - sec).toFixed(3) + (Math.abs(tan - sec) < 0.03 ? '　→ 接近！精确值 ξ = 1/√3 ≈ 0.577' : '')]
      ];
    },
    draw: function (s, V) {
      var f = function (x) { return x * x * x; };
      var KX = 3.0, KY = 2.2;
      var X = function (x) { return (x - 0.5) * KX; };
      var Y = function (y) { return (y - 0.5) * KY; };
      var xi = s.xi, fxi = f(xi), k = 3 * xi * xi;

      /* 曲线 */
      var pts = [];
      for (var i = 0; i <= 120; i++) { var x = i / 120; pts.push([X(x), Y(f(x)), 0]); }
      V.line(pts, { color: '#1c2230', width: 2.8 });

      /* 端点与割线 */
      V.dot([X(0), Y(0), 0], 0.07, { color: '#5a6478' });
      V.dot([X(1), Y(1), 0], 0.07, { color: '#5a6478' });
      V.line([[X(-0.12), Y(-0.12), 0], [X(1.12), Y(1.12), 0]], { color: '#8a94a6', width: 2, dash: [7, 6] });
      V.label([X(1.05), Y(1.12), 0], '割线 斜率 1', { size: 12, color: '#5a6478', dx: 4 });

      /* 切线 */
      var t0 = xi - 0.35, t1 = xi + 0.35;
      V.line([[X(t0), Y(fxi + k * (t0 - xi)), 0], [X(t1), Y(fxi + k * (t1 - xi)), 0]], { color: '#b3261e', width: 2.2 });
      V.dot([X(xi), Y(fxi), 0], 0.075, { color: '#b3261e' });
      V.line([[X(xi), Y(fxi), 0], [X(xi), Y(-0.05), 0]], { color: '#b3261e', width: 1.4, dash: [5, 5] });
      V.label([X(xi), Y(-0.05), 0], 'ξ=' + xi.toFixed(2), { size: 12, color: '#b3261e', align: 'center', dy: 14 });

      if (Math.abs(k - 1) < 0.03) {
        V.label([X(0.5), Y(1.02), 0], '★ 切线平行于割线', { size: 14, color: '#177245', align: 'center' });
      }
      V.legend('红切线斜率 ' + k.toFixed(2) + '　灰虚线斜率 1', 12, 12);
    }
  },

  /* ===================== 5. 黎曼和 ===================== */
  {
    id: 'riemann', topic: 't5', section: 's1', kp: '黎曼和定义',
    title: '黎曼和：柱子越细，台阶越贴曲线',
    oneLiner: '积分不是"原函数"，是"一堆柱子的总面积"取极限。',
    plain: [
      '每一根柱子 = 一小段的"高 × 宽"。所有柱子加起来，就是这一段的<b>近似面积</b>。',
      '把 n 从 1 拖到 128：柱子变细，柱顶越来越贴近曲线，总和越来越贴近真实值。<b>极限</b>就是这个"贴住"的结果。',
      '所以定义里的分割、取点、求和、取极限，四步就是"搭台阶 → 让台阶越来越细"。',
      '有界但不连续的函数也可能可积，例如只有一个跳跃点的阶梯函数；是否可积要看细分后上下和能否逼近同一值。'
    ],
    inQuestion: 'q5-1 用右端点黎曼和证明 ∫₀¹x dx = 1/2。本图改用 x²：同样等分、取右端点、求和取极限，得到 ∫₀¹x² dx = 1/3。',
    formal: '∫ₐᵇ f = lim(分割的最大宽度→0) Σ f(ξᵢ)Δxᵢ　（当 f 黎曼可积时）',
    questionIds: ['q5-1', 'q5-2', 'q5-4'],
    controls: [{ key: 'nIdx', label: '柱子数 n', min: 0, max: 7, step: 1, value: 2, fmt: function (v) { return Math.pow(2, v).toString(); } }],
    readout: function (s) {
      var n = Math.pow(2, s.nIdx), sum = 0;
      for (var k = 1; k <= n; k++) { var x = k / n; sum += x * x; }
      sum /= n;
      return [
        ['n', n.toString()],
        ['总和 Sₙ', sum.toFixed(5)],
        ['真值 ∫₀¹x²dx', '0.33333'],
        ['误差', Math.abs(sum - 1 / 3).toFixed(5)]
      ];
    },
    draw: function (s, V) {
      var n = Math.pow(2, s.nIdx);
      var KX = 3.4, KY = 1.5, Z = 0.55;
      var X = function (x) { return (x - 0.5) * KX; };
      var Y = function (y) { return y * KY; };

      /* 柱子（3D 立方体，右端点取高） */
      for (var k = 0; k < n; k++) {
        var x0 = k / n, x1 = (k + 1) / n, h = x1 * x1;
        V.box(X(x0), X(x1), 0, Y(h), -Z, Z, {
          color: '#0f766e', alpha: 0.16, stroke: 'rgba(15,118,110,0.55)'
        });
      }
      /* 曲线（画在前表面） */
      var pts = [];
      for (var i = 0; i <= 100; i++) { var x = i / 100; pts.push([X(x), Y(x * x), Z]); }
      V.line(pts, { color: '#b3261e', width: 2.8 });
      V.label([X(0.82), Y(0.82 * 0.82), Z], 'f(x)=x²', { size: 13, color: '#b3261e', dx: 6 });

      /* 底轴与标注 */
      V.line([[X(0), 0, Z], [X(1), 0, Z]], { color: '#1c2230', width: 1.6 });
      V.label([X(0), 0, Z], '0', { size: 12, color: '#5a6478', dy: 16, align: 'center' });
      V.label([X(1), 0, Z], '1', { size: 12, color: '#5a6478', dy: 16, align: 'center' });
      V.legend('n = ' + n + ' 根柱子，右端点取高', 12, 12);
    }
  },

  /* ===================== 6. 级数 ===================== */
  {
    id: 'series', topic: 't6', section: 's2', kp: '级数收敛', 
    title: '级数：台阶能不能走到"天花板"',
    oneLiner: '收敛意味着部分和趋于有限极限；正项级数可以用有界性判断。',
    plain: [
      '每一级台阶是一次「加一项」。级数收敛是指部分和趋于有限极限；对于本图的正项级数，部分和递增，有上界便收敛。',
      '切到 1/n²：台阶很快就不长了，逼近 π²/6 ≈ 1.645，那面玻璃板就是它的天花板。',
      '切到 1/n（调和级数）：台阶一直往上爬，虽然每级越来越矮，但<b>永远没有天花板</b>——这就是"通项趋于 0，级数却发散"。',
      '判断正项级数时，要看部分和是否有上界；一般含正负项的级数还需直接考察部分和的极限。'
    ],
    inQuestion: 'q6-1 问 Σ1/nᵖ 什么时候收敛，答案是 p>1；q6-3 里 Σ(−1)ⁿ/n 收敛但绝对值发散（条件收敛），靠的是正负相消——把它想成"往上走一步、往下走半步"。',
    formal: 'Σaₙ 收敛 ⟺ 部分和数列 Sₙ 有上界（正项级数时）',
    questionIds: ['q6-1', 'q6-3', 'q6-4'],
    controls: [
      { key: 'mode', type: 'seg', label: '级数', options: [
        { v: 'p2', label: '1/n²（收敛）' },
        { v: 'harm', label: '1/n（发散）' }
      ], value: 'p2' },
      { key: 'steps', label: '看到第几项', min: 5, max: 40, step: 1, value: 30, fmt: function (v) { return v.toString(); } }
    ],
    readout: function (s) {
      var N = s.steps, S = 0;
      for (var k = 1; k <= N; k++) S += (s.mode === 'p2') ? 1 / (k * k) : 1 / k;
      var rows = [['前 N 项和 Sₙ', S.toFixed(4)]];
      if (s.mode === 'p2') rows.push(['天花板 π²/6', '1.6449　→ 还差 ' + Math.max(0, 1.644934 - S).toFixed(4)]);
      else rows.push(['有没有上限', '没有：S₄₀ ≈ 4.28，S₁₀₀ ≈ 5.19，一直在涨']);
      return rows;
    },
    draw: function (s, V) {
      var N = s.steps, p2 = s.mode === 'p2';
      var KX = 3.2, KZ = -0.0;
      var scale = p2 ? 1.7 / 1.6449 : 1.7 / 4.3;
      var X = function (k) { return (k - 1) / 39 * 2 * KX - KX; };
      var Y = function (S) { return S * scale; };

      /* 天花板 */
      if (p2) {
        V.box(-KX - 0.2, KX + 0.2, Y(1.6449) - 0.02, Y(1.6449) + 0.02, -0.6, 0.6,
          { color: '#177245', alpha: 0.3, stroke: '#177245' });
        V.label([-KX, Y(1.6449) + 0.16, 0.6], '天花板 π²/6 ≈ 1.645', { size: 12, color: '#177245' });
      } else {
        V.label([-KX, 1.95, 0.6], '这里没有天花板 ↑', { size: 13, color: '#b3261e' });
      }

      /* 台阶 */
      var S = 0, pts = [[X(1), 0, 0.6]];
      for (var k = 1; k <= N; k++) {
        S += p2 ? 1 / (k * k) : 1 / k;
        var x0 = X(k), x1 = X(k + 1);
        pts.push([x0, Y(S), 0.6]);
        pts.push([x1, Y(S), 0.6]);
      }
      V.line(pts, { color: p2 ? '#0f766e' : '#b3261e', width: 2.6 });

      /* 离散点 */
      S = 0;
      for (var k2 = 1; k2 <= N; k2++) {
        S += p2 ? 1 / (k2 * k2) : 1 / k2;
        V.dot([X(k2), Y(S), 0.6], 0.04, { color: p2 ? '#177245' : '#b3261e', alpha: 0.9 });
      }

      V.line([[-KX, 0, 0.6], [KX, 0, 0.6]], { color: '#1c2230', width: 1.4 });
      V.label([-KX, -0.18, 0.6], 'n = 1', { size: 11, color: '#5a6478' });
      V.label([KX, -0.18, 0.6], 'n = 40', { size: 11, color: '#5a6478', align: 'right' });
      V.legend(p2 ? '1/n²：台阶被挡住 → 收敛' : '1/n：台阶一直爬 → 发散', 12, 12);
    }
  }
  ,{
    id: 'implicit-circle', topic: 't3', section: 's3', kp: '隐函数求导',
    title: '隐函数：圆上的切线斜率',
    oneLiner: '把 y 看作随 x 变化，圆的方程两边一起求导。',
    plain: [
      '单位圆 x²+y²=1 不必先解出 y：对 x 求导，得到 2x+2y·y′=0。',
      '当 y≠0，斜率是 −x/y。拖动角度，红点沿圆移动，红线是该点切线。',
      '左右端点 y=0 时切线竖直，斜率不存在，不能把 −x/y 当作有限数。'
    ],
    inQuestion: '联系 q3-5 的两边求导：其中 y 随 x 变化，要用链式法则；这里对 y² 求导也要乘 y′。',
    formal: 'x²+y²=1 ⇒ 2x+2yy′=0；y≠0 时 y′=−x/y',
    questionIds: ['q3-5'],
    controls: [{ key: 'angle', label: '圆上角度（度）', min: 0, max: 360, step: 1, value: 45, fmt: function (v) { return v.toFixed(0) + '°'; } }],
    readout: function (s) {
      var a = s.angle * Math.PI / 180, x = Math.cos(a), y = Math.sin(a);
      return [['点 (x,y)', '(' + x.toFixed(3) + ', ' + y.toFixed(3) + ')'], ['切线斜率', Math.abs(y) < 1e-10 ? '不存在（竖直切线）' : (-x / y).toFixed(3)]];
    },
    draw: function (s, V) {
      var a = s.angle * Math.PI / 180, x = Math.cos(a), y = Math.sin(a), scale = 1.6, pts = [];
      for (var i = 0; i <= 120; i++) { var t = 2 * Math.PI * i / 120; pts.push([scale * Math.cos(t), scale * Math.sin(t), 0]); }
      V.line(pts, { color: '#1c2230', width: 2.5 });
      V.line([[-2, 0, 0], [2, 0, 0]], { color: '#c9ccd4', width: 1 });
      V.line([[0, -2, 0], [0, 2, 0]], { color: '#c9ccd4', width: 1 });
      V.line([[scale * (x - 0.6 * y), scale * (y + 0.6 * x), 0], [scale * (x + 0.6 * y), scale * (y - 0.6 * x), 0]], { color: '#b3261e', width: 2.5 });
      V.dot([scale * x, scale * y, 0], 0.075, { color: '#b3261e' });
      V.legend('黑线：单位圆　红线：切线', 12, 12);
    }
  },
  {
    id: 'taylor-exp', topic: 't4', section: 's3', kp: '泰勒展开',
    title: '泰勒近似：用抛物线贴住指数曲线',
    oneLiner: '在 0 附近，eˣ 可以用 1+x+x²/2 近似。',
    plain: [
      '近似式与 eˣ 在 0 处的函数值、一阶和二阶导数相同，因此在附近贴得很紧。',
      '拖动 x 比较两者和误差；离开展开点后误差会变大，不能把近似当恒等式。',
      '余项是 o(x²)，所以减去 1+x 后再除以 x²，极限是 1/2。'
    ],
    inQuestion: 'q4-3 正是用这个展开计算 (eˣ−1−x)/x² 的极限；图中的误差帮助理解被略去的项。',
    formal: 'eˣ = 1+x+x²/2+o(x²)（x→0）',
    questionIds: ['q4-3'],
    controls: [{ key: 'x', label: 'x', min: -1, max: 1, step: 0.01, value: 0.6, fmt: function (v) { return v.toFixed(2); } }],
    readout: function (s) {
      var p = 1 + s.x + s.x * s.x / 2, actual = Math.exp(s.x);
      return [['eˣ', actual.toFixed(5)], ['二阶近似', p.toFixed(5)], ['绝对误差', Math.abs(actual - p).toFixed(5)]];
    },
    draw: function (s, V) {
      var X = function (x) { return x * 2; }, Y = function (y) { return (y - 1) * 1.2; }, a = [], b = [];
      for (var i = 0; i <= 100; i++) { var x = -1 + 2 * i / 100; a.push([X(x), Y(Math.exp(x)), 0]); b.push([X(x), Y(1 + x + x * x / 2), 0]); }
      V.line(a, { color: '#1c2230', width: 2.5 }); V.line(b, { color: '#2b5fa8', width: 2 });
      V.dot([X(s.x), Y(Math.exp(s.x)), 0], 0.07, { color: '#b3261e' });
      V.dot([X(s.x), Y(1 + s.x + s.x * s.x / 2), 0], 0.06, { color: '#2b5fa8' });
      V.legend('黑线：eˣ　蓝线：二阶近似　红点：真实值', 12, 12);
    }
  },
  {
    id: 'improper-integral', topic: 't5', section: 's3', kp: '端点反常积分',
    title: '反常积分：端点无界，面积仍可能有限',
    oneLiner: '先避开 0 积分，再让下限靠近 0。',
    plain: [
      '1/√x 在 0 附近越来越高，但曲线下面的总面积不一定无限大。',
      '先从正数 a 积到 1，面积是 2−2√a；拖小 a，观察面积如何接近 2。',
      '真正的反常积分是 a→0⁺ 的极限，不是直接把 0 代进被积函数。'
    ],
    inQuestion: 'q5-6 求 ∫₀¹ dx/√x；这里的滑块对应解题中先取正下限再取极限的步骤。',
    formal: '∫₀¹ x^(−1/2) dx = lim(a→0⁺) (2−2√a) = 2',
    questionIds: ['q5-6'],
    controls: [{ key: 'a', label: '下限 a', min: 0.01, max: 1, step: 0.01, value: 0.25, fmt: function (v) { return v.toFixed(2); } }],
    readout: function (s) { return [['下限 a', s.a.toFixed(2)], ['从 a 到 1 的积分', (2 - 2 * Math.sqrt(s.a)).toFixed(4)], ['距极限 2', (2 * Math.sqrt(s.a)).toFixed(4)]]; },
    draw: function (s, V) {
      var X = function (x) { return (x - 0.5) * 3; }, Y = function (y) { return y * 0.3; }, pts = [];
      for (var i = 0; i <= 100; i++) { var x = 0.01 + 0.99 * i / 100; pts.push([X(x), Y(1 / Math.sqrt(x)), 0]); }
      V.line(pts, { color: '#1c2230', width: 2.5 });
      V.line([[X(0), 0, 0], [X(1), 0, 0]], { color: '#5a6478', width: 1.5 });
      V.line([[X(s.a), 0, 0], [X(s.a), Y(1 / Math.sqrt(s.a)), 0]], { color: '#b3261e', width: 2 });
      V.label([X(s.a), 0, 0], 'a=' + s.a.toFixed(2), { color: '#b3261e', size: 12, dy: 16 });
      V.legend('黑线：1/√x　红线：积分下限', 12, 12);
    }
  },
  {
    id: 'differential', topic: 't3', section: 's1', kp: '微分与线性近似',
    title: '微分：用切线预测小变化',
    oneLiner: '微分 dy 是切线预测的变化量；Δy 是曲线上真正发生的变化。',
    plain: [
      '想象你站在曲线上的 x₀ 处，准备向右或向左走 dx。黑色曲线表示真实函数 y=x²，蓝色直线是出发点的切线。',
      '切线斜率是 f′(x₀)=2x₀，因此切线预测高度改变 dy=2x₀·dx。蓝色竖线显示这个预测值。',
      '实际沿曲线走到 x₀+dx，高度变化是 Δy=(x₀+dx)²−x₀²=2x₀dx+dx²。红色竖线显示实际变化。',
      '两者差 Δy−dy=dx²。把 dx 拖近 0，可见误差也趋近 0；当 dx≠0 时，误差与 |dx| 的比值为 |dx|，也趋近 0。',
      '图形中的前后深度只是为了方便旋转观察：这是单变量函数，并不是说微分多了一个变量。'
    ],
    inQuestion: '例如 x₀=1，dx=0.1：先求导得到 f′(1)=2，再算 dy=2×0.1=0.2；实际增量是 1.1²−1²=0.21。试做配套题。',
    formal: 'dy=f′(x₀)dx；Δy=dy+o(dx)（dx→0）',
    questionIds: ['q3-11'],
    controls: [
      { key: 'x0', label: '出发点 x₀', min: -1, max: 1, step: 0.1, value: 1, fmt: function (v) { return v.toFixed(1); } },
      { key: 'dx', label: '水平变化 dx', min: -0.8, max: 0.8, step: 0.1, value: 0.4, fmt: function (v) { return v.toFixed(1); } }
    ],
    readout: function (s) {
      var dy = 2 * s.x0 * s.dx, actual = dy + s.dx * s.dx;
      return [['出发高度 f(x₀)', (s.x0 * s.x0).toFixed(3)], ['微分 dy = 2x₀dx', dy.toFixed(3)], ['实际增量 Δy', actual.toFixed(3)], ['误差 Δy − dy = dx²', (s.dx * s.dx).toFixed(3)], ['误差 / |dx|', s.dx === 0 ? 'dx=0 时不作除法' : Math.abs(s.dx).toFixed(3)]];
    },
    draw: function (s, V) {
      var scaleX = 1.3, scaleY = 0.8, base = s.x0 * s.x0, end = s.x0 + s.dx;
      function P(x, y, z) { return [x * scaleX, (y - 1) * scaleY, z]; }
      var curve = [];
      for (var i = 0; i <= 120; i++) { var x = -2 + i / 30; curve.push(P(x, x * x, 0)); }
      V.line(curve, { color: '#1c2230', width: 2.5 });
      V.line([P(-2, 0, 0), P(2, 0, 0)], { color: '#a5aab4', width: 1 });
      var slope = 2 * s.x0, tangent = base + slope * s.dx, actual = end * end;
      V.line([P(s.x0 - 1, base - slope, 0), P(s.x0 + 1, base + slope, 0)], { color: '#2b5fa8', width: 2 });
      V.line([P(s.x0, base, 0.2), P(end, base, 0.2)], { color: '#64748b', width: 2 });
      V.line([P(end, base, 0.2), P(end, tangent, 0.2)], { color: '#2b5fa8', width: 3 });
      V.line([P(end, base, -0.2), P(end, actual, -0.2)], { color: '#b3261e', width: 3 });
      V.dot(P(s.x0, base, 0), 0.07, { color: '#177245' });
      V.dot(P(end, actual, 0), 0.07, { color: '#b3261e' });
      V.label(P(end, tangent, 0.2), 'dy', { color: '#2b5fa8', dx: 8 });
      V.label(P(end, actual, -0.2), 'Δy', { color: '#b3261e', dx: 8, dy: -12 });
      V.legend('黑：曲线　蓝：切线与 dy　红：实际增量 Δy', 12, 12);
    }
  }
];

/* 三种函数（场景 3 用） */
function F(mode) {
  if (mode === 'cube') return function (x) { return x * x * x; };
  if (mode === 'osc') return function (x) { return x === 0 ? 0 : x * x * Math.sin(1 / x); };
  return Math.abs;
}
