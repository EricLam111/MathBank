/* 题库：每题都标了板块(topic)、讲(section)、知识点(kp)、难度(1-3)、题型。
 * type: numeric 数值/表达式填空 | choice 单选 | self 证明题（对照解答自评）
 * 判分：value 是标准答案（可写表达式，由 core.js 求值），accept 是额外接受的文字写法。 */
window.QUESTIONS = [

  /* ============ 板块 1：数列极限 ============ */
  {
    id: 'q1-1', topic: 't1', section: 's1', kp: 'ε-N 定义', difficulty: 1, type: 'numeric',
    prompt: '求 $\\lim_{n\\to\\infty}\\dfrac{2n+1}{n+3}$。',
    value: 2, ans: '$2$',
    hints: ['分子分母同时除以 $n$，看看每一项会变成什么。'],
    steps: [
      '把分子分母同时除以 $n$：$\\dfrac{2n+1}{n+3}=\\dfrac{2+\\frac1n}{1+\\frac3n}$。',
      '分别求上下两部分的极限：$2+\\frac1n\\to2$，$1+\\frac3n\\to1$。',
      '商的极限等于极限的商（分母极限非 0），所以结果是 $\\dfrac21=2$。'
    ],
    why: '有理式在无穷远处的极限只由最高次项的系数比决定，因为所有低阶项都被 $\\frac1n$ 压成 0。这是 ε-N 定义之后第一个能算的例子，也是后面所有「抓大头」技巧的原型。',
    trap: '把 $n=\\infty$ 直接代入，得到 $\\dfrac{\\infty}{\\infty}$ 就算不下去了——必须先做代数变形。'
  },
  {
    id: 'q1-2', topic: 't1', section: 's1', kp: 'ε-N 定义的证明写法', difficulty: 2, type: 'self',
    prompt: '用 ε-N 定义证明 $\\lim_{n\\to\\infty}\\dfrac{2n+1}{n+3}=2$。（先在纸上写完整，再对照下面逐步检查）',
    ans: '取 $N=\\lceil 5/\\varepsilon\\rceil$ 即可。',
    hints: ['先算 $\\left|a_n-2\\right|$ 的显式表达式，再设法把它放大成一个只含 $n$ 的分式。'],
    steps: [
      '第一步，算距离：$\\left|\\dfrac{2n+1}{n+3}-2\\right|=\\left|\\dfrac{2n+1-2(n+3)}{n+3}\\right|=\\dfrac{5}{n+3}$。',
      '第二步，放大：因为 $n+3>n>0$，所以 $\\dfrac{5}{n+3}<\\dfrac{5}{n}$。这一步让式子变简单，且方向正确（我们只需要上界）。',
      '第三步，反解：要求 $\\dfrac5n<\\varepsilon$，即 $n>\\dfrac5\\varepsilon$。',
      '第四步，取整并收尾：令 $N=\\left\\lceil\\dfrac5\\varepsilon\\right\\rceil$。则当 $n>N$ 时 $\\dfrac{5}{n+3}<\\dfrac5n<\\varepsilon$，即 $|a_n-2|<\\varepsilon$。证毕。'
    ],
    why: '这是整门课的第一个「证明题模板」：算距离 → 放大 → 反解 → 取整 → 收尾。之后的 ε-δ、一致连续、极限唯一性证明，全都复用这五步。',
    trap: '最常见的失分点是把 $N$ 写成依赖 $n$ 的形式（例如「取 $N=n$」），或者只验证了某一个具体的 $n$ 就宣布证完。'
  },
  {
    id: 'q1-3', topic: 't1', section: 's2', kp: '重要极限 e', difficulty: 1, type: 'numeric',
    prompt: '求 $\\lim_{n\\to\\infty}\\left(1+\\dfrac1n\\right)^n$。',
    value: 'e', accept: ['e', '自然常数e'], ans: '$e$',
    hints: ['这是 $e$ 的定义式之一，直接回忆即可。'],
    steps: [
      '这个极限就是自然常数 $e$ 的定义：$\\lim_{n\\to\\infty}\\left(1+\\frac1n\\right)^n=e$，其中 $e\\approx2.71828$。',
      '注意它不是「$1$ 的无穷次方等于 1」：底数虽然趋于 1，但指数同时在变大，两者在竞争。',
      '更一般的形式：$\\lim\\left(1+\\frac{a}{n}\\right)^n=e^{a}$。'
    ],
    why: '它是所有「$1^{\\infty}$ 型」极限的母版。考试里 90% 的幂指型极限，都是先变形凑成这个形状，再读出答案。',
    trap: '把底数的极限和指数的极限分开算，得出 $1^{\\infty}=1$。这一步是非法的：底数与指数相互耦合。'
  },
  {
    id: 'q1-4', topic: 't1', section: 's2', kp: '重要极限 e', difficulty: 2, type: 'numeric',
    prompt: '求 $\\lim_{n\\to\\infty}\\left(\\dfrac{n}{n+1}\\right)^n$。',
    value: '1/e', accept: ['1/e', 'e^-1'], ans: '$\\dfrac1e$',
    hints: ['把括号里的式子写成 $\\dfrac{1}{1+\\frac1n}$，再利用幂的性质把指数分配进去。'],
    steps: [
      '改写：$\\dfrac{n}{n+1}=\\dfrac{1}{1+\\frac1n}$。',
      '于是 $\\left(\\dfrac{n}{n+1}\\right)^n=\\dfrac{1}{\\left(1+\\frac1n\\right)^n}$。',
      '分母的极限是 $e$，故整体极限是 $\\dfrac1e$。'
    ],
    why: '考的是「取倒数」这个动作：把不熟悉的形状翻成熟悉的形状。同时也提醒你 $(1+\\frac1n)^n$ 与它的倒数是一对，方向相反。',
    trap: '指数 $n$ 只作用在括号上，不能分别乘到分子分母再各自求极限。'
  },
  {
    id: 'q1-5', topic: 't1', section: 's2', kp: '有理化', difficulty: 2, type: 'numeric',
    prompt: '求 $\\lim_{n\\to\\infty}\\left(\\sqrt{n+1}-\\sqrt n\\right)\\sqrt n$。',
    value: '1/2', ans: '$\\dfrac12$',
    hints: ['根号差要乘以共轭式 $\\sqrt{n+1}+\\sqrt n$，把差变成商。'],
    steps: [
      '有理化：$\\sqrt{n+1}-\\sqrt n=\\dfrac{(n+1)-n}{\\sqrt{n+1}+\\sqrt n}=\\dfrac{1}{\\sqrt{n+1}+\\sqrt n}$。',
      '乘上 $\\sqrt n$：$\\dfrac{\\sqrt n}{\\sqrt{n+1}+\\sqrt n}$。',
      '分子分母同除以 $\\sqrt n$：$\\dfrac{1}{\\sqrt{1+\\frac1n}+1}\\to\\dfrac{1}{1+1}=\\dfrac12$。'
    ],
    why: '「根号差」是无穷减无穷型，必须有理化才能看出真实阶数。有理化的本质是把减法变成除法，而除法在无穷远处是可控的。',
    trap: '只乘分子不乘分母；或者以为 $\\sqrt{n+1}-\\sqrt n\\to0$ 就说明乘积也趋于 0——它其实乘上了 $\\sqrt n$，两者恰好同阶。'
  },
  {
    id: 'q1-6', topic: 't1', section: 's3', kp: '收敛的必要条件与充分条件', difficulty: 1, type: 'choice',
    prompt: '下列哪个条件<b>不能</b>保证数列 $\\{a_n\\}$ 收敛？',
    choices: [
      '$\\{a_n\\}$ 单调递增且有上界',
      '$\\{a_n\\}$ 有界',
      '$\\{a_n\\}$ 被两个都收敛到同一极限 $A$ 的数列夹住',
      '$\\{a_n\\}$ 是 Cauchy 列'
    ],
    answer: 1,
    ans: 'B。有界只是收敛的必要条件，不是充分条件。',
    hints: ['想一个「上下翻飞」的有界数列。'],
    steps: [
      'A 是单调有界定理，保证收敛。',
      'C 是夹逼定理，保证收敛。',
      'D 是 Cauchy 准则，在实数系里与收敛等价（完备性）。',
      'B 只有「有界」：反例 $a_n=(-1)^n$，它有界但发散。所以 B 不能保证收敛。'
    ],
    why: '这题把「收敛」的三个充分条件与「有界」这个必要条件区分开。做判断题时，先问自己：这是充分条件还是必要条件？',
    trap: '把「有界」和「收敛」当成等价。记住反例 $(-1)^n$。'
  },

  /* ============ 板块 2：函数极限与连续 ============ */
  {
    id: 'q2-1', topic: 't2', section: 's1', kp: 'ε-δ 定义', difficulty: 1, type: 'numeric',
    prompt: '在证明 $\\lim_{x\\to2}(3x+1)=7$ 时通常取 $\\delta=\\dfrac{\\varepsilon}{3}$。如果 $\\varepsilon=0.03$，那么这个 $\\delta$ 等于多少？',
    value: 0.01, ans: '$\\delta=0.01$',
    hints: ['直接代入 $\\delta=\\varepsilon/3$。'],
    steps: [
      '按定义里的取法 $\\delta=\\dfrac{\\varepsilon}{3}$。',
      '代入 $\\varepsilon=0.03$，得 $\\delta=0.01$。',
      '验算：$0<|x-2|<0.01$ 时，$|(3x+1)-7|=3|x-2|<0.03=\\varepsilon$，成立。'
    ],
    why: '考 ε-δ 证明里「$\\delta$ 怎么选」这一核心动作：把 $|f(x)-L|$ 写成 $C|x-x_0|$，再取 $\\delta=\\varepsilon/C$。',
    trap: '把 $\\delta$ 写成 $3\\varepsilon$（除以常数写成乘以常数）。取完 $\\delta$ 一定要回头验算方向。'
  },
  {
    id: 'q2-2', topic: 't2', section: 's1', kp: '重要极限 sin x / x', difficulty: 1, type: 'numeric',
    prompt: '求 $\\lim_{x\\to0}\\dfrac{\\sin x}{x}$。',
    value: 1, ans: '$1$',
    hints: ['用几何不等式 $\\sin x<x<\\tan x$（$0<x<\\frac\\pi2$）夹逼。'],
    steps: [
      '对 $0<x<\\dfrac\\pi2$，由单位圆面积比较可得 $\\sin x<x<\\tan x$。',
      '三边同除 $\\sin x$：$1<\\dfrac{x}{\\sin x}<\\dfrac{1}{\\cos x}$。',
      '令 $x\\to0^+$，两端都趋于 1，由夹逼定理得 $\\dfrac{\\sin x}{x}\\to1$；$x<0$ 时用偶性同理。'
    ],
    why: '这是三角、指数、对数函数求导公式的地基：$(\\sin x)\'=\\cos x$ 的推导里必须用到它。',
    trap: '直接说「$\\frac00$ 型所以等于 1」，或者用 L\'Hôpital 证明它——那会循环论证，因为 $\\sin$ 的导数本身依赖这个极限。'
  },
  {
    id: 'q2-3', topic: 't2', section: 's2', kp: '连续与可导', difficulty: 1, type: 'choice',
    prompt: '$f(x)=|x|$ 在 $x=0$ 处是什么情况？',
    choices: ['连续且可导', '连续但不可导', '可导但不连续', '既不连续也不可导'],
    answer: 1,
    ans: 'B。连续，但左导数是 $-1$、右导数是 $+1$，不相等。',
    hints: ['分别算 $h>0$ 与 $h<0$ 时的差商 $\\frac{f(0+h)-f(0)}{h}$。'],
    steps: [
      '连续性：$|x|\\to0=|0|$，所以连续。',
      '右差商（$h>0$）：$\\dfrac{|h|-0}{h}=\\dfrac hh=1$。',
      '左差商（$h<0$）：$\\dfrac{|h|-0}{h}=\\dfrac{-h}{h}=-1$。',
      '左右差商不相等，故 $f\'(0)$ 不存在。'
    ],
    why: '这是「连续 ⇏ 可导」的最小反例。几何上，可导意味着曲线在该点有唯一切线，而折点处有两条。',
    trap: '看到图形连续就认为光滑；或者只算右导数就下结论。'
  },
  {
    id: 'q2-4', topic: 't2', section: 's2', kp: '振荡间断', difficulty: 2, type: 'choice',
    prompt: '设 $f(x)=\\sin\\dfrac1x$（$x\\ne0$），$f(0)=0$。则 $f$ 在 $x=0$ 处：',
    choices: [
      '连续',
      '不连续，因为 $x\\to0$ 时极限不存在',
      '不连续，因为 $f(0)$ 没有定义',
      '连续但不可导'
    ],
    answer: 1,
    ans: 'B。函数有界，但极限不存在，因此不连续（振荡间断）。',
    hints: ['取两列趋于 0 的 $x_k$，看看函数值分别趋于什么。'],
    steps: [
      '取 $x_k=\\dfrac{1}{\\pi/2+2k\\pi}$，则 $f(x_k)=\\sin\\left(\\dfrac\\pi2+2k\\pi\\right)=1$。',
      '取 $y_k=\\dfrac{1}{k\\pi}$，则 $f(y_k)=\\sin(k\\pi)=0$。',
      '两列都趋于 0，但函数值分别趋于 1 和 0，所以 $\\lim_{x\\to0}f(x)$ 不存在。',
      '极限不存在，自然谈不上等于 $f(0)=0$，故不连续。'
    ],
    why: '这是「有界但无极限」的标本。它与 $x\\sin(1/x)$ 只差一个因子 $x$：那个因子把振幅压到 0，于是连续。两个例子并排记，效果最好。',
    trap: '因为 $|\\sin(1/x)|\\le1$ 就断言极限存在（有界 ⇏ 有极限）。'
  },
  {
    id: 'q2-5', topic: 't2', section: 's3', kp: '一致连续', difficulty: 3, type: 'self',
    prompt: '证明 $f(x)=\\dfrac1x$ 在 $(0,1)$ 上不一致连续。',
    ans: '取 $x_n=\\frac1n,\\ y_n=\\frac{1}{n+1}$，则 $|x_n-y_n|\\to0$ 但 $|f(x_n)-f(y_n)|=1$。',
    hints: ['不一致连续的定义要求「存在某个 $\\varepsilon_0>0$，对任何 $\\delta>0$ 都能找到一对点」。所以只要构造一对点即可。'],
    steps: [
      '回忆：一致连续意味着对每个 $\\varepsilon>0$ 都能找到统一的 $\\delta$，使区间内任意两点距离小于 $\\delta$ 时函数值之差小于 $\\varepsilon$。',
      '要否定它，只需找 $\\varepsilon_0>0$，使得对每个 $\\delta>0$ 都存在 $x,y$ 满足 $|x-y|<\\delta$ 但 $|f(x)-f(y)|\\ge\\varepsilon_0$。',
      '取 $x_n=\\dfrac1n$，$y_n=\\dfrac{1}{n+1}$（都在 $(0,1)$ 内）。则 $|x_n-y_n|=\\dfrac{1}{n(n+1)}\\to0$。',
      '但 $|f(x_n)-f(y_n)|=|n-(n+1)|=1$。取 $\\varepsilon_0=\\frac12$ 即可：无论 $\\delta$ 多小，只要 $n$ 足够大就有 $|x_n-y_n|<\\delta$ 而函数值之差仍为 1。',
      '所以不存在统一的 $\\delta$，即 $f$ 在 $(0,1)$ 上不一致连续。'
    ],
    why: '一致连续的关键在「$\\delta$ 不能依赖点」。这题的构造（两点都挤向端点 0，函数值差却恒定）是所有不一致连续反例的模板。',
    trap: '试图直接证明「不存在 $\\delta$」——那几乎无法下手。正确的动作是构造两列点。'
  },
  {
    id: 'q2-6', topic: 't2', section: 's3', kp: '一致连续的判别', difficulty: 2, type: 'choice',
    prompt: '下列函数在指定区间上<b>不</b>一致连续的是：',
    choices: [
      '$\\sin x$ 在 $\\mathbb{R}$ 上',
      '$x^2$ 在 $[0,1]$ 上',
      '$\\dfrac1x$ 在 $(0,1)$ 上',
      '$x$ 在 $\\mathbb{R}$ 上'
    ],
    answer: 2,
    ans: 'C。$1/x$ 在 $(0,1)$ 上连续，但不一致连续。',
    hints: ['闭区间上连续 ⇒ 一致连续（Cantor 定理）；所以先把「闭区间」的选项排除。'],
    steps: [
      'B 是闭区间上的连续函数，由 Cantor 定理必一致连续。',
      'A 与 D：$|\\sin x-\\sin y|\\le|x-y|$、$|x-y|=|x-y|$，都取 $\\delta=\\varepsilon$ 即可，一致连续。',
      'C：$1/x$ 在端点 0 附近变化率无界（取 $x_n=1/n,\\ y_n=1/(n+1)$ 可证），不一致连续。',
      '所以答案是 C。'
    ],
    why: '考「闭区间 vs 开区间」这个分水岭。Cantor 定理只在闭区间上成立，开区间的连续性不够。',
    trap: '把「连续」当成「一致连续」；或者以为 $x^2$ 在任何区间上都不一致（它在 $[0,1]$ 上是一致的，只是在 $[0,\\infty)$ 上不是）。'
  },

  /* ============ 板块 3：导数与微分 ============ */
  {
    id: 'q3-1', topic: 't3', section: 's1', kp: '导数定义', difficulty: 2, type: 'numeric',
    prompt: '设 $f(x)=x^2\\sin\\dfrac1x$（$x\\ne0$），$f(0)=0$。求 $f\'(0)$。',
    value: 0, ans: '$f\'(0)=0$',
    hints: ['分界点只能用定义：算 $\\dfrac{f(h)-f(0)}{h}$ 再令 $h\\to0$。'],
    steps: [
      '用定义：$f\'(0)=\\lim_{h\\to0}\\dfrac{f(h)-f(0)}{h}$。',
      '代入：$\\dfrac{h^2\\sin(1/h)-0}{h}=h\\sin\\dfrac1h$。',
      '因为 $|\\sin(1/h)|\\le1$，有 $|h\\sin(1/h)|\\le|h|\\to0$，由夹逼得极限为 0。',
      '所以 $f\'(0)=0$。'
    ],
    why: '两个要点：(1) 分界点处必须用定义；(2) 「有界 × 趋于 0」等于趋于 0，这是处理振荡因子的标准手法。',
    trap: '对 $x^2\\sin(1/x)$ 直接套乘积法则求 $f\'(0)$——公式在 $x=0$ 处不适用，$-\\cos(1/x)$ 那一项根本不存在极限。'
  },
  {
    id: 'q3-2', topic: 't3', section: 's1', kp: '差商变形', difficulty: 2, type: 'numeric',
    prompt: '设 $f\'(a)=4$。求 $\\lim_{h\\to0}\\dfrac{f(a+2h)-f(a-h)}{h}$。',
    value: 12, ans: '$3f\'(a)=12$',
    hints: ['在分子里加减同一个 $f(a)$，把差商拆成两段。'],
    steps: [
      '拆开：$\\dfrac{f(a+2h)-f(a-h)}{h}=\\dfrac{f(a+2h)-f(a)}{h}+\\dfrac{f(a)-f(a-h)}{h}$。',
      '第一段：令 $t=2h$，则它等于 $2\\cdot\\dfrac{f(a+t)-f(a)}{t}\\to 2f\'(a)$。',
      '第二段：令 $s=-h$，则它等于 $\\dfrac{f(a+s)-f(a)}{s}\\to f\'(a)$。',
      '相加得 $3f\'(a)=12$。'
    ],
    why: '考的是「凑出差商」这个基本动作。看到 $f$ 在两点之差除以 $h$，第一反应就该是加一项减一项。',
    trap: '把答案写成 $2f\'(a)$——遗漏了后一段也贡献 $f\'(a)$。'
  },
  {
    id: 'q3-3', topic: 't3', section: 's2', kp: '可导与导数连续', difficulty: 3, type: 'choice',
    prompt: '仍设 $f(x)=x^2\\sin\\dfrac1x$（$x\\ne0$），$f(0)=0$。关于 $f$ 与 $f\'$ 在 $x=0$ 处，正确的是：',
    choices: [
      '$f$ 在 0 处不可导',
      '$f$ 在 0 处可导，且 $f\'$ 在 0 处连续',
      '$f$ 在 0 处可导，但 $f\'$ 在 0 处不连续',
      '$f$ 在 0 处不连续'
    ],
    answer: 2,
    ans: 'C。可导（$f\'(0)=0$），但 $f\'$ 在 0 处不连续。',
    hints: ['先求 $x\\ne0$ 时的 $f\'(x)$，再看 $x\\to0$ 时它有没有极限。'],
    steps: [
      '由上一题，$f\'(0)=0$ 存在，所以 $f$ 在 0 处可导（从而连续）。',
      '当 $x\\ne0$ 时用乘积法则：$f\'(x)=2x\\sin\\dfrac1x-\\cos\\dfrac1x$。',
      '其中 $2x\\sin\\frac1x\\to0$，而 $\\cos\\frac1x$ 在 $x\\to0$ 时没有极限（在 $-1$ 与 $1$ 之间振荡）。',
      '所以 $\\lim_{x\\to0}f\'(x)$ 不存在，$f\'$ 在 0 处不连续。'
    ],
    why: '这一题专门拆掉「可导 ⟹ 导数连续」这个错误直觉。三层性质必须分开记：连续、可导、导数连续。',
    trap: '以为「$f$ 可导」就意味着 $f\'$ 是好函数。事实上导数可以有振荡型间断（但不可能有跳跃间断——Darboux 性质）。'
  },
  {
    id: 'q3-4', topic: 't3', section: 's2', kp: '可导 ⇒ 连续', difficulty: 1, type: 'self',
    prompt: '证明：若 $f$ 在 $x_0$ 处可导，则 $f$ 在 $x_0$ 处连续。',
    ans: '把 $f(x)-f(x_0)$ 写成差商乘以 $(x-x_0)$，两项极限相乘即得 0。',
    hints: ['要证 $\\lim_{x\\to x_0}[f(x)-f(x_0)]=0$。把差商当作一个已知有极限的量。'],
    steps: [
      '目标是证明 $\\lim_{x\\to x_0}\\left[f(x)-f(x_0)\\right]=0$。',
      '当 $x\\ne x_0$ 时，恒等式：$f(x)-f(x_0)=\\dfrac{f(x)-f(x_0)}{x-x_0}\\cdot(x-x_0)$。',
      '由可导性，第一个因子 $\\to f\'(x_0)$（有限数）；第二个因子 $\\to0$。',
      '两个极限相乘得 $f\'(x_0)\\cdot0=0$，即 $\\lim f(x)=f(x_0)$，故连续。'
    ],
    why: '这是「可导强于连续」的证明。注意它只用到可导的定义，不需要任何技巧——这类证明要写得干净利落。',
    trap: '想用「$|f(x)-f(x_0)|<\\varepsilon$」硬做 ε-δ，反而绕远路。识别出「差商 × 距离」这个结构是关键。'
  },
  {
    id: 'q3-5', topic: 't3', section: 's3', kp: '对数求导法', difficulty: 2, type: 'numeric',
    prompt: '求 $y=x^x$（$x>0$）在 $x=1$ 处的导数。',
    value: 1, ans: '$y\'(1)=1$',
    hints: ['两边取对数把指数降下来。'],
    steps: [
      '两边取对数：$\\ln y=x\\ln x$。',
      '两边对 $x$ 求导：$\\dfrac{y\'}{y}=\\ln x+x\\cdot\\dfrac1x=\\ln x+1$。',
      '于是 $y\'=x^x(\\ln x+1)$。',
      '代入 $x=1$：$1^1(0+1)=1$。'
    ],
    why: '幂指函数（底数和指数都含变量）只能用对数求导，或者写成 $e^{x\\ln x}$ 后复合求导。',
    trap: '套 $(x^n)\'=nx^{n-1}$ 或 $(a^x)\'=a^x\\ln a$——两个公式都要求「有一边是常数」。'
  },

  /* ============ 板块 4：中值定理与泰勒 ============ */
  {
    id: 'q4-1', topic: 't4', section: 's1', kp: 'Rolle 定理的条件', difficulty: 1, type: 'choice',
    prompt: '对 $f(x)=|x|$ 在 $[-1,1]$ 上使用 Rolle 定理，下列说法正确的是：',
    choices: [
      '可以直接用，结论成立',
      '不能直接用：$f$ 在 $0$ 处不可导，条件不满足；事实上也不存在 $\\xi$ 使 $f\'(\\xi)=0$',
      '可以用，因为 $f$ 在 $[-1,1]$ 上连续',
      '不能用，因为 $f(-1)\\ne f(1)$'
    ],
    answer: 1,
    ans: 'B。Rolle 定理要求开区间内可导，而 $|x|$ 在 0 处不可导；结论也确实不成立。',
    hints: ['Rolle 定理有三个条件：闭区间连续、开区间可导、两端函数值相等。逐个检查。'],
    steps: [
      '检查条件：$|x|$ 在 $[-1,1]$ 上连续 ✓；$f(-1)=f(1)=1$ ✓；但在 $x=0$ 处不可导 ✗。',
      '所以定理的前提不成立，不能使用。',
      '而且结论本身也是假的：$f\'(x)=-1$（$x<0$）、$f\'(x)=1$（$x>0$），在 $(-1,1)$ 内没有任何点使 $f\'=0$。',
      '这正好说明「条件不是摆设」——去掉可导性，结论就会失效。'
    ],
    why: '用反例理解定理条件的必要性，比背条件有用得多。这里的折点正是让结论失效的原因。',
    trap: '看到 $f(-1)=f(1)$ 就套定理，忽略可导性检查。'
  },
  {
    id: 'q4-2', topic: 't4', section: 's1', kp: 'Lagrange 中值定理', difficulty: 2, type: 'numeric',
    prompt: '$f(x)=x^3$ 在 $[0,1]$ 上满足 Lagrange 中值定理。求定理中的 $\\xi\\in(0,1)$。',
    value: '1/sqrt(3)', accept: ['1/sqrt(3)', 'sqrt(3)/3', '0.577'], ans: '$\\xi=\\dfrac{1}{\\sqrt3}\\approx0.577$',
    hints: ['列出 $f\'(\\xi)=\\dfrac{f(1)-f(0)}{1-0}$ 再解方程。'],
    steps: [
      '定理给出：$f(1)-f(0)=f\'(\\xi)(1-0)$。',
      '左边 $=1-0=1$；右边 $=3\\xi^2$。',
      '解 $3\\xi^2=1$ 得 $\\xi=\\pm\\dfrac1{\\sqrt3}$。',
      '因为 $\\xi\\in(0,1)$，取 $\\xi=\\dfrac{1}{\\sqrt3}\\approx0.577$。'
    ],
    why: '考「定理怎么用」：把函数值差换成导数，然后解方程。注意 $\\xi$ 必须落在开区间内，负根要舍掉。',
    trap: '写出两个根都算答案；或者把 $\\xi$ 当成中点 $0.5$。'
  },
  {
    id: 'q4-3', topic: 't4', section: 's2', kp: 'L\'Hôpital 与泰勒', difficulty: 2, type: 'numeric',
    prompt: '求 $\\lim_{x\\to0}\\dfrac{e^x-1-x}{x^2}$。',
    value: '1/2', ans: '$\\dfrac12$',
    hints: ['$\\frac00$ 型：连用两次 L\'Hôpital，或者直接展开 $e^x$。'],
    steps: [
      '这是 $\\dfrac00$ 型。第一次 L\'Hôpital：$\\dfrac{e^x-1}{2x}$，仍是 $\\dfrac00$。',
      '第二次：$\\dfrac{e^x}{2}\\to\\dfrac12$。',
      '泰勒更快：$e^x=1+x+\\dfrac{x^2}{2}+o(x^2)$，分子 $=\\dfrac{x^2}{2}+o(x^2)$，除以 $x^2$ 得 $\\dfrac12$。'
    ],
    why: '典型的两条路：L\'Hôpital（机械但可能越算越繁）与泰勒展开（直观但要展够阶数）。两种都要会。',
    trap: '只做一次 L\'Hôpital 就把 $\\dfrac{e^x-1}{2x}$ 代入 $x=0$——那还是 $\\dfrac00$。'
  },
  {
    id: 'q4-4', topic: 't4', section: 's3', kp: '泰勒展开求极限', difficulty: 2, type: 'numeric',
    prompt: '求 $\\lim_{x\\to0}\\dfrac{x-\\sin x}{x^3}$。',
    value: '1/6', ans: '$\\dfrac16$',
    hints: ['把 $\\sin x$ 展开到 $x^3$ 项。'],
    steps: [
      '展开：$\\sin x=x-\\dfrac{x^3}{6}+o(x^3)$。',
      '分子：$x-\\sin x=\\dfrac{x^3}{6}+o(x^3)$。',
      '除以 $x^3$ 得 $\\dfrac16+o(1)\\to\\dfrac16$。'
    ],
    why: '考点是「展开到刚好抵消分母的阶」。分母是 $x^3$，就必须展到 $x^3$，展到 $x^2$ 什么也看不出。',
    trap: '只展到 $\\sin x=x+o(x)$，得到分子为 $o(x)$，无法判断阶数。'
  },
  {
    id: 'q4-5', topic: 't4', section: 's3', kp: 'Maclaurin 系数', difficulty: 1, type: 'numeric',
    prompt: '$e^x$ 的 Maclaurin 展开式里，$x^4$ 项的系数是多少？',
    value: '1/24', ans: '$\\dfrac{1}{4!}=\\dfrac{1}{24}$',
    hints: ['记住通项 $\\frac{x^n}{n!}$。'],
    steps: [
      '$e^x=1+x+\\dfrac{x^2}{2!}+\\dfrac{x^3}{3!}+\\dfrac{x^4}{4!}+\\cdots$。',
      '所以 $x^4$ 的系数是 $\\dfrac{1}{4!}=\\dfrac{1}{24}$。',
      '也可用公式：$c_4=\\dfrac{f^{(4)}(0)}{4!}=\\dfrac{1}{24}$（因为 $e^x$ 的任意阶导数都是 $e^x$，在 0 处等于 1）。'
    ],
    why: '考系数公式 $c_k=\\frac{f^{(k)}(0)}{k!}$。这是把「函数值」翻译成「展开系数」的唯一通道。',
    trap: '写成 $\\frac1{4}=0.25$（把阶乘当成普通整数）。'
  },
  {
    id: 'q4-6', topic: 't4', section: 's3', kp: '单调性与导数', difficulty: 2, type: 'choice',
    prompt: '命题「若 $f$ 在 $(a,b)$ 上严格递增，则 $f\'(x)>0$ 对一切 $x\\in(a,b)$ 成立」是：',
    choices: [
      '真',
      '假，反例：$f(x)=x^3$ 在 $(-1,1)$ 上严格递增，但 $f\'(0)=0$',
      '假，反例：$f(x)=|x|$ 在 $(-1,1)$ 上严格递增',
      '只有当 $f$ 连续时才为真'
    ],
    answer: 1,
    ans: 'B。严格递增只保证 $f\'\\ge0$（在可导处），等号可以在个别点成立。',
    hints: ['找一个单调递增但某个点切线水平的函数。'],
    steps: [
      '$x^3$ 在 $(-1,1)$ 上严格递增（$x<y\\Rightarrow x^3<y^3$），这是确凿的。',
      '但 $f\'(x)=3x^2$，在 $x=0$ 处等于 0。',
      '所以「严格递增 ⟹ 导数处处为正」是假的。',
      '正确的说法是：$f\'>0\\Rightarrow$ 严格递增（充分条件），而反过来只能得到 $f\'\\ge0$（在可导处）。'
    ],
    why: '考充分与必要条件的区别。$f\'>0$ 是严格递增的充分条件，不是必要条件；$x^3$ 就是这个缺口。',
    trap: '把充分条件当充要条件。注意 C 选项更糟：$|x|$ 在 $(-1,1)$ 上并不严格递增。'
  },

  /* ============ 板块 5：积分 ============ */
  {
    id: 'q5-1', topic: 't5', section: 's1', kp: '黎曼和定义', difficulty: 2, type: 'self',
    prompt: '用黎曼和（分割—求和—取极限）证明 $\\displaystyle\\int_0^1 x\\,dx=\\dfrac12$。',
    ans: '取等分与右端点，和为 $\\frac{n+1}{2n}\\to\\frac12$。',
    hints: ['把 $[0,1]$ 等分成 $n$ 份，每份长 $\\frac1n$，在第 $k$ 份取右端点 $\\frac kn$。'],
    steps: [
      '把 $[0,1]$ 等分为 $n$ 份，第 $k$ 份是 $\\left[\\dfrac{k-1}{n},\\dfrac kn\\right]$，长度 $\\Delta x=\\dfrac1n$。',
      '取右端点 $\\xi_k=\\dfrac kn$，黎曼和 $S_n=\\sum_{k=1}^{n}\\dfrac kn\\cdot\\dfrac1n=\\dfrac{1}{n^2}\\sum_{k=1}^n k$。',
      '用求和公式 $\\sum_{k=1}^n k=\\dfrac{n(n+1)}{2}$，得 $S_n=\\dfrac{n(n+1)}{2n^2}=\\dfrac{n+1}{2n}$。',
      '取极限：$\\lim_{n\\to\\infty}S_n=\\dfrac12$。由于 $f(x)=x$ 连续，黎曼和的极限与分割、取点方式无关，故 $\\int_0^1x\\,dx=\\dfrac12$。'
    ],
    why: '这是「积分不是原函数，而是极限」的具体演练。走一遍定义，你对基本定理为什么深刻会有实感。',
    trap: '把取点写成 $\\xi_k=k$（忘了除以 $n$），结果得到一个发散的式子。'
  },
  {
    id: 'q5-2', topic: 't5', section: 's1', kp: '可积的充分条件', difficulty: 2, type: 'choice',
    prompt: '下列条件中，<b>不能</b>保证 $f$ 在 $[a,b]$ 上 Riemann 可积的是：',
    choices: [
      '$f$ 在 $[a,b]$ 上连续',
      '$f$ 在 $[a,b]$ 上单调且有界',
      '$f$ 在 $[a,b]$ 上有界，且只有有限个间断点',
      '$f$ 在 $[a,b]$ 上有界'
    ],
    answer: 3,
    ans: 'D。有界本身不足以保证可积，反例是 Dirichlet 函数。',
    hints: ['想想「有界但处处不连续」的函数。'],
    steps: [
      'A：连续 ⇒ 可积（经典结论）。',
      'B：单调有界 ⇒ 可积（每个分割的振幅之和可控制）。',
      'C：有界且有限个间断点 ⇒ 可积（把间断点用小邻域盖住）。',
      'D：仅有界不够。Dirichlet 函数（有理数取 1、无理数取 0）有界，但任何分割的上下和分别恒为区间长度与 0，永不相等，故不可积。'
    ],
    why: '考「可积性到底需要什么」。有界只排除了无界这种最坏情况，不能控制振荡。',
    trap: '把「有界」当成可积的通行证。'
  },
  {
    id: 'q5-3', topic: 't5', section: 's2', kp: '牛顿-莱布尼茨公式', difficulty: 1, type: 'numeric',
    prompt: '求 $\\displaystyle\\int_0^{\\pi/2}\\sin x\\,dx$。',
    value: 1, ans: '$1$',
    hints: ['$\\sin x$ 的一个原函数是 $-\\cos x$。'],
    steps: [
      '找原函数：$(-\\cos x)\'=\\sin x$。',
      '用基本定理：$\\int_0^{\\pi/2}\\sin x\\,dx=\\left[-\\cos x\\right]_0^{\\pi/2}$。',
      '代入：$-\\cos\\dfrac\\pi2-(-\\cos0)=-0+1=1$。'
    ],
    why: '基本定理把积分变成「原函数在两端点取值之差」。这是计算题最常用的通路。',
    trap: '符号弄错：写成 $\\cos\\frac\\pi2-\\cos0$，得到 $-1$。'
  },
  {
    id: 'q5-4', topic: 't5', section: 's2', kp: '换元积分', difficulty: 2, type: 'numeric',
    prompt: '求 $\\displaystyle\\int_0^1 xe^{x^2}\\,dx$。',
    value: '(e-1)/2', accept: ['(e-1)/2', '0.859'], ans: '$\\dfrac{e-1}{2}$',
    hints: ['令 $u=x^2$，注意 $du=2x\\,dx$，上下限也要跟着换。'],
    steps: [
      '令 $u=x^2$，则 $du=2x\\,dx$，即 $x\\,dx=\\dfrac12du$。',
      '换上下限：$x=0\\Rightarrow u=0$；$x=1\\Rightarrow u=1$。',
      '于是 $\\int_0^1xe^{x^2}dx=\\dfrac12\\int_0^1e^u du=\\dfrac12\\left[e^u\\right]_0^1$。',
      '结果：$\\dfrac12(e-1)\\approx0.859$。'
    ],
    why: '换元法两个动作必须同时做：换被积表达式、换上下限。少一个就出错。',
    trap: '换元后仍用 $0$ 到 $1$ 的上下限（那个区间对应的是 $x$，不是 $u$）。'
  },
  {
    id: 'q5-5', topic: 't5', section: 's3', kp: 'p 积分判别', difficulty: 2, type: 'choice',
    prompt: '反常积分 $\\displaystyle\\int_1^{\\infty}\\dfrac{1}{x^p}\\,dx$ 收敛的充要条件是：',
    choices: ['$p>0$', '$p>1$', '$p<1$', '对一切 $p$ 都收敛'],
    answer: 1,
    ans: 'B。$p>1$ 时收敛，值为 $\\frac{1}{p-1}$；$p\\le1$ 时发散。',
    hints: ['分 $p\\ne1$ 与 $p=1$ 两种情形算原函数。'],
    steps: [
      '$p\\ne1$ 时，$\\int_1^{R}x^{-p}dx=\\dfrac{R^{1-p}-1}{1-p}$。',
      '当 $p>1$：$R^{1-p}\\to0$，极限为 $\\dfrac{1}{p-1}$，收敛。',
      '当 $p<1$：$R^{1-p}\\to\\infty$，发散。',
      '$p=1$ 时 $\\int_1^R\\frac{dx}{x}=\\ln R\\to\\infty$，发散。故收敛 ⟺ $p>1$。'
    ],
    why: '这是所有「无穷远处」收敛判别的标尺：任何级数或积分在无穷远处的行为，都和 $\\frac{1}{x^p}$ 比阶。',
    trap: '把无穷远处的条件和 0 附近的条件（$p<1$）混用。'
  },
  {
    id: 'q5-6', topic: 't5', section: 's3', kp: '端点反常积分', difficulty: 2, type: 'numeric',
    prompt: '求 $\\displaystyle\\int_0^1 x^{-1/2}\\,dx$。',
    value: 2, ans: '$2$',
    hints: ['$x^{-1/2}$ 的原函数是 $2\\sqrt x$，注意 0 处要写成极限。'],
    steps: [
      '按定义写成极限：$\\lim_{a\\to0^+}\\int_a^1x^{-1/2}dx$。',
      '原函数：$\\int x^{-1/2}dx=2\\sqrt x+C$。',
      '代入：$\\left[2\\sqrt x\\right]_a^1=2-2\\sqrt a$。',
      '令 $a\\to0^+$：$2\\sqrt a\\to0$，故积分值为 2，收敛。'
    ],
    why: '对比上一题：0 附近的收敛条件是 $p<1$，这里 $p=\\frac12<1$，所以收敛。两个端点方向相反，这是最容易记混的地方。',
    trap: '因为被积函数在 0 处无界就断言积分发散——无界不等于积分无穷。'
  },

  /* ============ 板块 6：级数 ============ */
  {
    id: 'q6-1', topic: 't6', section: 's1', kp: 'p 级数', difficulty: 1, type: 'choice',
    prompt: '级数 $\\displaystyle\\sum_{n=1}^{\\infty}\\dfrac{1}{n^p}$ 收敛的充要条件是：',
    choices: ['$p>0$', '$p>1$', '$p<1$', '$p\\ne1$'],
    answer: 1,
    ans: 'B。$p>1$ 收敛，$p\\le1$ 发散（$p=1$ 是调和级数）。',
    hints: ['把它和反常积分 $\\int_1^\\infty x^{-p}dx$ 对照。'],
    steps: [
      '用积分判别法：$\\sum\\frac1{n^p}$ 与 $\\int_1^\\infty x^{-p}dx$ 同敛散。',
      '而后者收敛 ⟺ $p>1$。',
      '所以级数收敛 ⟺ $p>1$。$p=1$ 时就是调和级数，发散。'
    ],
    why: 'p 级数是所有比较判别的参照物。记住它，等于记住了一把尺子。',
    trap: '以为通项 $\\frac1{n^p}\\to0$ 就意味着收敛（$p=1$ 时通项也趋于 0，但级数发散）。'
  },
  {
    id: 'q6-2', topic: 't6', section: 's1', kp: '比较判别法', difficulty: 3, type: 'self',
    prompt: '设 $\\sum a_n$ 收敛。证明 $\\sum a_n^2$ 也收敛。（提示：先想 $a_n$ 会趋于什么）',
    ans: '由 $a_n\\to0$ 得最终 $|a_n|\\le1$，于是 $a_n^2\\le|a_n|$，再用比较判别。',
    hints: ['收敛级数的通项极限是多少？由此能对 $a_n^2$ 得到什么不等式？'],
    steps: [
      '因为 $\\sum a_n$ 收敛，所以通项 $a_n\\to0$。',
      '于是存在 $N$，使当 $n>N$ 时 $|a_n|\\le1$。',
      '在 $|a_n|\\le1$ 时，$a_n^2=|a_n|^2\\le|a_n|$。',
      '由 $\\sum|a_n|$ 收敛（绝对收敛）与比较判别，$\\sum a_n^2$ 收敛。若原级数只是条件收敛，可先去掉前 $N$ 项，再对尾部用同样的比较。',
      '注：更直接的写法是 $\\sum a_n^2\\le\\sum_{n\\le N}a_n^2+\\sum_{n>N}|a_n|<\\infty$。'
    ],
    why: '考「用通项趋于 0 得到定量不等式」这个动作。它比抽象地谈收敛性好用得多。',
    trap: '直接写 $a_n^2\\le a_n$——$a_n$ 可能是负数，正确的是 $a_n^2\\le|a_n|$。'
  },
  {
    id: 'q6-3', topic: 't6', section: 's2', kp: '交错级数与条件收敛', difficulty: 2, type: 'choice',
    prompt: '级数 $\\displaystyle\\sum_{n=1}^{\\infty}\\dfrac{(-1)^n}{n}$ 是：',
    choices: ['绝对收敛', '条件收敛', '发散', '无法判断'],
    answer: 1,
    ans: 'B。自身收敛（Leibniz），但绝对值级数是调和级数，发散。',
    hints: ['分别判断原级数与绝对值级数。'],
    steps: [
      '原级数：$b_n=\\frac1n$ 单调递减且趋于 0，由 Leibniz 判别收敛。',
      '绝对值级数：$\\sum\\frac1n$ 是调和级数，发散。',
      '收敛但不绝对收敛 ⇒ 条件收敛。'
    ],
    why: '这是条件收敛的标准例子，也是「收敛 ⇏ 绝对收敛」的反例。',
    trap: '用正项级数判别法处理它；或者看到收敛就认为绝对收敛。'
  },
  {
    id: 'q6-4', topic: 't6', section: 's2', kp: 'Basel 问题', difficulty: 2, type: 'numeric',
    prompt: '求 $\\displaystyle\\sum_{n=1}^{\\infty}\\dfrac{1}{n^2}$。',
    value: 'pi^2/6', accept: ['pi^2/6', 'π²/6', 'pi²/6'], ans: '$\\dfrac{\\pi^2}{6}$',
    hints: ['这是著名的 Basel 问题，结果与 $\\pi$ 有关。'],
    steps: [
      '$p=2>1$，所以级数收敛（先用 p 判别确认它存在）。',
      '求和值是欧拉在 1735 年解决的 Basel 问题：$\\sum\\frac1{n^2}=\\dfrac{\\pi^2}{6}\\approx1.6449$。',
      '这个结果的常见推导用 $\\sin x$ 的无穷乘积展开，已经超出本板块范围，记住结论即可。'
    ],
    why: '它回答「收敛到什么」，而不只是「收不收敛」。数值上约 1.6449，可以用它检验自己的部分和程序。',
    trap: '把 $\\frac{\\pi^2}{6}$ 写成 $\\frac{\\pi}{6}$。'
  },
  {
    id: 'q6-5', topic: 't6', section: 's3', kp: '收敛半径', difficulty: 2, type: 'numeric',
    prompt: '求幂级数 $\\displaystyle\\sum_{n=1}^{\\infty}\\dfrac{x^n}{n}$ 的收敛半径 $R$。',
    value: 1, ans: '$R=1$',
    hints: ['用比值法：$R=\\lim\\left|\\frac{c_n}{c_{n+1}}\\right|$，其中 $c_n=\\frac1n$。'],
    steps: [
      '这里 $c_n=\\dfrac1n$。',
      '比值：$\\left|\\dfrac{c_n}{c_{n+1}}\\right|=\\dfrac{n+1}{n}\\to1$。',
      '所以 $R=1$：$|x|<1$ 时绝对收敛，$|x|>1$ 时发散。',
      '端点要单独看：$x=1$ 得调和级数（发散），$x=-1$ 得交错级数（收敛）。收敛域是 $[-1,1)$。'
    ],
    why: '考「半径」与「收敛域」是两件事：半径只管开区间，端点必须逐个验。',
    trap: '求出 $R=1$ 就说「收敛域是 $|x|<1$」，把端点丢掉了。'
  },
  {
    id: 'q6-6', topic: 't6', section: 's3', kp: '几何级数', difficulty: 1, type: 'numeric',
    prompt: '求 $\\displaystyle\\sum_{n=0}^{\\infty}\\left(\\dfrac12\\right)^n$。',
    value: 2, ans: '$2$',
    hints: ['几何级数 $\\sum_{n\\ge0}q^n=\\frac{1}{1-q}$（$|q|<1$）。'],
    steps: [
      '这是公比 $q=\\dfrac12$ 的几何级数，$|q|<1$ 故收敛。',
      '代公式：$\\dfrac{1}{1-\\frac12}=2$。',
      '验算部分和：$S_n=\\dfrac{1-(1/2)^{n+1}}{1-1/2}=2\\left(1-2^{-(n+1)}\\right)\\to2$。'
    ],
    why: '幂级数 $\\sum x^n=\\frac{1}{1-x}$ 就是几何级数，所有幂级数的直觉都从它出发。',
    trap: '把 $q$ 与 $1-q$ 搞混，写成 $\\frac{1}{1-2}$。'
  },

  /* ============ 板块 7：反例博物馆 ============ */
  {
    id: 'q7-1', topic: 't7', section: 's1', kp: '连续与可导的反例', difficulty: 2, type: 'choice',
    prompt: '下列哪个函数在 $\\mathbb{R}$ 上处处连续、处处不可导？',
    choices: [
      '$|x|$',
      '$x\\sin\\dfrac1x$（补定义 $f(0)=0$）',
      'Weierstrass 函数 $\\sum_{n\\ge0}a^n\\cos(b^n\\pi x)$（$0<a<1$，$b$ 奇数，$ab>1+\\frac{3\\pi}{2}$）',
      '$x^2\\sin\\dfrac1x$（补定义 $f(0)=0$）'
    ],
    answer: 2,
    ans: 'C。Weierstrass 函数处处连续、处处不可导。',
    hints: ['前三个里头，只有一个是「每一点都不可导」。'],
    steps: [
      '$|x|$ 只在 $x=0$ 一处不可导，其余处处可导。',
      '$x\\sin(1/x)$ 与 $x^2\\sin(1/x)$ 在 0 处都可导（用定义算过），之后也处处可导。',
      'Weierstrass 函数由无穷多高频余弦项叠加：$0<a<1$ 保证一致收敛从而连续，$ab>1+\\frac{3\\pi}{2}$ 保证每一点的差商都无界，因此处处不可导。',
      '所以答案是 C。'
    ],
    why: '这个反例的意义在于：它说明「连续」与「可导」之间的鸿沟可以大到极致，而不是偶发在个别点。',
    trap: '以为「连续但不可导」总是个别点现象。'
  },
  {
    id: 'q7-2', topic: 't7', section: 's2', kp: '累次极限与二重极限', difficulty: 3, type: 'choice',
    prompt: '关于 $f(x,y)=\\dfrac{x-y}{x+y}$ 在原点附近的行为，正确的是：',
    choices: [
      '两个累次极限都等于 1',
      '两个累次极限分别是 $1$ 和 $-1$，因此它们不能交换顺序',
      '累次极限存在，所以二重极限也存在',
      '两个累次极限都不存在'
    ],
    answer: 1,
    ans: 'B。先 $y\\to0$ 得 1，先 $x\\to0$ 得 $-1$。',
    hints: ['分别固定一个变量，让另一个趋于 0，算两次。'],
    steps: [
      '先令 $y\\to0$（$x\\ne0$ 固定）：$\\dfrac{x-y}{x+y}\\to\\dfrac{x}{x}=1$；再令 $x\\to0$，得 $\\lim_{x\\to0}1=1$。',
      '先令 $x\\to0$（$y\\ne0$ 固定）：$\\dfrac{x-y}{x+y}\\to\\dfrac{-y}{y}=-1$；再令 $y\\to0$，得 $-1$。',
      '两个累次极限不相等，所以极限运算不能随意交换顺序。',
      '顺便：沿 $y=kx$ 逼近得 $\\dfrac{1-k}{1+k}$，随 $k$ 变化，故二重极限也不存在。'
    ],
    why: '考「极限交换」这件事有多脆弱。它也是后面一致收敛、逐项积分等定理存在的理由。',
    trap: '算出一个累次极限就认为二重极限存在。'
  },
  {
    id: 'q7-3', topic: 't7', section: 's2', kp: '一致收敛的必要性', difficulty: 3, type: 'choice',
    prompt: '设 $f_n(x)=x^n$，$x\\in[0,1]$。关于 $\\{f_n\\}$：',
    choices: [
      '一致收敛到 0',
      '逐点收敛，但不一致收敛',
      '逐点都不收敛',
      '一致收敛到 1'
    ],
    answer: 1,
    ans: 'B。逐点极限是「$x<1$ 时为 0，$x=1$ 时为 1」的不连续函数，故不可能一致收敛。',
    hints: ['先求每一点的极限，再看这个极限函数连不连续。'],
    steps: [
      '对固定的 $x\\in[0,1)$：$x^n\\to0$。对 $x=1$：$1^n=1\\to1$。',
      '所以逐点极限是 $f(x)=0$（$x<1$）与 $f(1)=1$。',
      '每个 $f_n$ 都连续，但极限函数在 $x=1$ 处不连续。',
      '一致收敛会保持连续性，因此这里不可能一致收敛。'
    ],
    why: '这是「逐点收敛 ⇏ 一致收敛」的标准反例，也解释了为什么一致收敛是必要的假设。',
    trap: '因为「每一点都收敛到 0（几乎）」就认为一致收敛。注意 $x$ 要多接近 1 才能让 $x^n$ 不接近 0——这种「快到端点的点」正是破坏一致性的原因。'
  },
  {
    id: 'q7-4', topic: 't7', section: 's3', kp: '可积性的边界', difficulty: 2, type: 'choice',
    prompt: 'Dirichlet 函数（有理数取 1、无理数取 0）在 $[0,1]$ 上：',
    choices: [
      'Riemann 可积，因为函数值只取两个数',
      'Riemann 不可积，因为不连续点集不是零测集',
      'Riemann 可积，且积分等于 0',
      'Riemann 不可积，因为函数无界'
    ],
    answer: 1,
    ans: 'B。它在每一点都不连续，不连续点集是 $[0,1]$，测度为 1，故不可积。',
    hints: ['先问：它在哪些点连续？'],
    steps: [
      '在任意点附近，既有无理数也有有理数，函数值在 0 与 1 之间跳动，所以它在每一点都不连续。',
      '不连续点集是整个 $[0,1]$，测度为 1（不是零测集）。',
      '按 Lebesgue 判据（Riemann 可积 ⟺ 不连续点集是零测集），它不可积。',
      '从定义看也一样：任何分割的振幅和都等于区间长度，上下和永不相等。'
    ],
    why: '它同时否证了「有界 ⇒ 可积」和「有界 ⇒ 几乎处处连续」，是理解可积性边界的关键标本。',
    trap: '选 D：这个函数其实是有界的（只取 0 和 1），所以「无界」的理由是错的——虽然结论「不可积」是对的。'
  },

  /* ============ 追加题（改编自北邮《大邮数学集》历年题，答案均重算核对） ============ */
  {
    id: 'q1-7', topic: 't1', section: 's2', kp: '1 的无穷次方型', difficulty: 2, type: 'choice',
    prompt: '设 $a,b$ 为非零常数，则 $\\lim_{n\\to\\infty}\\left(\\dfrac{n^2}{(n-a)(n+b)}\\right)^n$ 等于：',
    choices: ['$e^{a-b}$', '$e^{b-a}$', '$e^{ab}$', '$1$'],
    answer: 0,
    ans: '$e^{a-b}$',
    hints: ['先把底数写成 $1+u_n$ 的形状，再看 $n u_n$ 的极限。'],
    steps: [
      '通分：$\\dfrac{n^2}{(n-a)(n+b)}=\\dfrac{n^2}{n^2+(b-a)n-ab}=\\dfrac{1}{1+\\frac{b-a}{n}-\\frac{ab}{n^2}}$。',
      '于是原式 $=\\left(1+u_n\\right)^{-n}$，其中 $u_n=\\dfrac{b-a}{n}-\\dfrac{ab}{n^2}\\to0$。',
      '算 $n u_n=(b-a)-\\dfrac{ab}{n}\\to b-a$，所以 $\\left(1+u_n\\right)^{n}\\to e^{b-a}$。',
      '取倒数：原极限 $=e^{-(b-a)}=e^{a-b}$。'
    ],
    why: '这是「$1^{\\infty}$ 型」的标准套路：底数写成 $1+u_n$，指数乘上 $n$，极限就是 $e^{\\lim n u_n}$。期中期末几乎必考。',
    trap: '只看最高次项系数比得 $1$，然后答 $1$。真正决定结果的是分母里的一次项 $(b-a)n$。'
  },
  {
    id: 'q1-8', topic: 't1', section: 's2', kp: '提取主项', difficulty: 2, type: 'numeric',
    prompt: '求 $\\lim_{n\\to\\infty}\\left(1+e^{n}+e^{2n}\\right)^{1/n}$。',
    value: 'e^2', ans: '$e^2$',
    hints: ['括号里最大的一项是谁？把它提出来。'],
    steps: [
      '提出最大项 $e^{2n}$：$1+e^n+e^{2n}=e^{2n}\\left(e^{-2n}+e^{-n}+1\\right)$。',
      '于是原式 $=e^{2}\\left(e^{-2n}+e^{-n}+1\\right)^{1/n}$。',
      '括号趋于 $1$，且 $\\dfrac{\\ln\\left(e^{-2n}+e^{-n}+1\\right)}{n}\\to0$，故它的 $1/n$ 次幂趋于 $1$。',
      '极限 $=e^{2}\\cdot1=e^{2}$。'
    ],
    why: '考「提取主项」：若干指数相加再开 $n$ 次方，结果由最大那一项决定，其余被压掉。',
    trap: '把 $1+e^n$ 当成主项答 $e$。要看指数上最大的是 $2n$。'
  },
  {
    id: 'q1-9', topic: 't1', section: 's1', kp: '保号性的定量版', difficulty: 2, type: 'choice',
    prompt: '若 $\\lim_{n\\to\\infty}a_n=a$ 且 $a\\ne0$，则当 $n$ 充分大时必有：',
    choices: [
      '$|a_n|\\le|a|$',
      '$|a_n|\\ge|a|$',
      '$|a_n|>\\dfrac{|a|}{2}$',
      '$|a_n|<\\dfrac{|a|}{2}$'
    ],
    answer: 2,
    ans: 'C。取 $\\varepsilon=\\frac{|a|}{2}$ 即得。',
    hints: ['把 ε-N 定义里的 $\\varepsilon$ 取成一个具体的正数。'],
    steps: [
      '按定义，对任意 $\\varepsilon>0$ 存在 $N$，使 $n>N$ 时 $|a_n-a|<\\varepsilon$。',
      '取 $\\varepsilon=\\dfrac{|a|}{2}>0$，则存在 $N$，当 $n>N$ 时 $|a_n-a|<\\dfrac{|a|}{2}$。',
      '由三角不等式 $|a_n|\\ge|a|-|a_n-a|>|a|-\\dfrac{|a|}{2}=\\dfrac{|a|}{2}$。',
      '所以最终 $|a_n|>\\dfrac{|a|}{2}$，选 C。'
    ],
    why: '这是保号性的定量版本（极限非零 ⇒ 最终离开 0 一段距离），判断「数列最终落在哪个区间」时天天用。',
    trap: '误选 B：极限是 $a$ 并不保证每项都不小于 $|a|$，只能保证不小于一半。'
  },
  {
    id: 'q1-10', topic: 't1', section: 's2', kp: '有理化', difficulty: 1, type: 'numeric',
    prompt: '求 $\\lim_{n\\to\\infty}n\\left(\\sqrt{n^{2}+1}-n\\right)$。',
    value: '1/2', ans: '$\\dfrac12$',
    hints: ['乘上共轭式 $\\sqrt{n^2+1}+n$。'],
    steps: [
      '有理化：$\\sqrt{n^{2}+1}-n=\\dfrac{1}{\\sqrt{n^{2}+1}+n}$。',
      '乘上 $n$ 得 $\\dfrac{n}{\\sqrt{n^{2}+1}+n}$。',
      '分子分母同除以 $n$：$\\dfrac{1}{\\sqrt{1+\\frac{1}{n^{2}}}+1}\\to\\dfrac12$。'
    ],
    why: '根号差属于「$\\infty-\\infty$」型，必须有理化才看得出真实阶数；期中最常见的 5 分填空题。',
    trap: '因为 $\\sqrt{n^2+1}-n\\to0$ 就答 $0$，忘了外面还乘了一个 $n$。'
  },
  {
    id: 'q1-11', topic: 't1', section: 's2', kp: '等价无穷小', difficulty: 2, type: 'numeric',
    prompt: '求 $\\lim_{x\\to0}\\dfrac{\\sqrt{1+2x^{2}}-1}{1-\\cos x}$。',
    value: 2, ans: '$2$',
    hints: ['$\\sqrt{1+u}-1\\sim\\dfrac u2$，$1-\\cos x\\sim\\dfrac{x^2}{2}$。'],
    steps: [
      '分子：取 $u=2x^{2}$，$\\sqrt{1+u}-1\\sim\\dfrac{u}{2}=x^{2}$。',
      '分母：$1-\\cos x=2\\sin^{2}\\dfrac x2\\sim\\dfrac{x^{2}}{2}$。',
      '比值 $\\to\\dfrac{x^{2}}{x^{2}/2}=2$。'
    ],
    why: '考等价无穷小替换：$\\sqrt{1+u}-1\\sim u/2$、$1-\\cos x\\sim x^2/2$，这两个要背下来。',
    trap: '把分子写成 $2x^2$（漏了 $\\tfrac12$），或把 $1-\\cos x$ 当成 $x$。'
  },
  {
    id: 'q1-12', topic: 't1', section: 's2', kp: '泰勒展开定阶', difficulty: 2, type: 'numeric',
    prompt: '当 $x\\to0$ 时，$2x-\\sin 2x$ 与 $x^{a}$ 是同阶无穷小，求 $a$。',
    value: 3, ans: '$a=3$',
    hints: ['把 $\\sin 2x$ 展开到三次项。'],
    steps: [
      '展开：$\\sin t=t-\\dfrac{t^{3}}{6}+O(t^{5})$，取 $t=2x$ 得 $\\sin 2x=2x-\\dfrac{8x^{3}}{6}+O(x^{5})$。',
      '相减：$2x-\\sin 2x=\\dfrac{8}{6}x^{3}+O(x^{5})=\\dfrac{4}{3}x^{3}+O(x^{5})$。',
      '首项是 $x^{3}$，故与 $x^{3}$ 同阶，$a=3$。'
    ],
    why: '求无穷小的阶 = 泰勒展开取首个非零项，填空题的固定解法。',
    trap: '用 $\\sin 2x\\sim 2x$ 得到 $0$，然后误以为阶更高。'
  },
  {
    id: 'q1-13', topic: 't1', section: 's2', kp: '斜渐近线', difficulty: 3, type: 'numeric',
    prompt: '已知 $\\lim_{x\\to+\\infty}\\left(\\sqrt{4x^{2}+2x+3}-ax-b\\right)=0$，求 $a$（顺带你会得到 $b=\\frac12$）。',
    value: 2, ans: '$a=2$，$b=\\dfrac12$',
    hints: ['先除以 $x$ 求斜率 $a$；再用有理化求截距 $b$。'],
    steps: [
      '除以 $x$ 取极限：$\\dfrac{\\sqrt{4x^{2}+2x+3}}{x}\\to2$，而 $a+\\dfrac bx\\to a$，故 $a=2$。',
      '再算 $\\sqrt{4x^{2}+2x+3}-2x$，有理化：$\\dfrac{(4x^{2}+2x+3)-4x^{2}}{\\sqrt{4x^{2}+2x+3}+2x}=\\dfrac{2x+3}{\\sqrt{4x^{2}+2x+3}+2x}$。',
      '分子分母同除以 $x$：$\\dfrac{2+3/x}{\\sqrt{4+2/x+3/x^{2}}+2}\\to\\dfrac{2}{2+2}=\\dfrac12$。',
      '故 $b=\\dfrac12$，斜渐近线是 $y=2x+\\dfrac12$。'
    ],
    why: '典型斜渐近线题：$a$ 由「除以 $x$」定，$b$ 由「减掉 $ax$ 再有理化」定。',
    trap: '把 $\\sqrt{4x^2}$ 当成 $\\pm2x$ 取错符号（$x\\to+\\infty$ 只能取正）。'
  },
  {
    id: 'q2-7', topic: 't2', section: 's2', kp: '间断点的分类', difficulty: 2, type: 'choice',
    prompt: '设 $f(x)=\\dfrac{\\sin x}{1+2^{1/x}}$（$x\\ne0$），则 $x=0$ 是 $f$ 的：',
    choices: ['连续点', '可去间断点', '跳跃间断点', '无穷间断点'],
    answer: 1,
    ans: 'B。左右极限都为 $0$，但 $f(0)$ 无定义，所以是可去间断点。',
    hints: ['分别算 $x\\to0^+$ 与 $x\\to0^-$ 时 $2^{1/x}$ 的极限。'],
    steps: [
      '$x\\to0^+$：$\\frac1x\\to+\\infty$，$2^{1/x}\\to+\\infty$，故 $f(x)\\to\\dfrac{0}{\\infty}=0$。',
      '$x\\to0^-$：$\\frac1x\\to-\\infty$，$2^{1/x}\\to0$，故 $f(x)\\to\\dfrac{\\sin x}{1+0}=0$。',
      '左右极限相等且为 $0$，极限存在；但 $f(0)$ 没有定义（分母为 $1+2^{1/0}$ 无意义）。',
      '极限存在而该点无定义（或定义成别的值）⇒ 可去间断点，选 B。'
    ],
    why: '考「$2^{1/x}$ 类型」的左右极限差异，再对照间断点三分类：可去（极限存在）、跳跃（左右不等）、无穷/振荡（极限不存在）。',
    trap: '看到 $2^{1/x}$ 就以为一定不连续。左右极限其实都等于 $0$，属于「补一个点就能连续」的可去型。'
  },
  {
    id: 'q2-8', topic: 't2', section: 's2', kp: '左右极限', difficulty: 3, type: 'numeric',
    prompt: '求 $\\lim_{x\\to0}\\left(\\dfrac{4+e^{1/x}}{2+e^{2/x}}+\\dfrac{\\sin x}{|x|}\\right)$。',
    value: 1, ans: '$1$',
    hints: ['先看 $x\\to0^+$ 与 $x\\to0^-$ 时 $e^{1/x},e^{2/x}$ 各自的行为；注意 $\\frac{\\sin x}{|x|}$ 左右异号。'],
    steps: [
      '先看 $x\\to0^+$：$e^{2/x}\\to\\infty$，分子分母同除 $e^{2/x}$ 得第一项 $\\to0$；又 $\\dfrac{\\sin x}{|x|}=\\dfrac{\\sin x}{x}\\to1$。总和 $\\to1$。',
      '再看 $x\\to0^-$：$e^{1/x}\\to0$、$e^{2/x}\\to0$，第一项 $\\to\\dfrac{4+0}{2+0}=2$；而 $\\dfrac{\\sin x}{|x|}=-\\dfrac{\\sin x}{x}\\to-1$。总和 $\\to2-1=1$。',
      '左右极限都等于 $1$，故原极限 $=1$。'
    ],
    why: '这题设计的妙处：两项各自在两侧「交换」了值（$0$ 与 $2$、$1$ 与 $-1$），加起来却是同一个数。做完必须两侧都算。',
    trap: '只算一侧（比如 $x\\to0^+$）就下结论；或者忘记 $|x|$ 在 $x<0$ 时是 $-x$ 而把 $\\frac{\\sin x}{|x|}$ 也当成 $1$。'
  },
  {
    id: 'q2-9', topic: 't2', section: 's2', kp: '间断点的分类', difficulty: 2, type: 'choice',
    prompt: '函数 $f(x)=\\dfrac{|x|(1-x^{3})}{\\sin\\pi x}$ 在 $x=1$ 处是：',
    choices: ['连续点', '可去间断点', '跳跃间断点', '无穷间断点'],
    answer: 1,
    ans: 'B。极限 $=\\dfrac{3}{\\pi}$ 存在但 $f(1)$ 无定义，所以是可去间断点。',
    hints: ['令 $x=1+u$，用等价无穷小算极限。'],
    steps: [
      '在 $x=1$ 附近 $|x|=x$，其余部分都没有奇性，问题只在分母。',
      '令 $x=1+u$（$u\\to0$）：分子 $=(1+u)\\left(1-(1+u)^{3}\\right)\\to1\\cdot(-3u)=-3u$。',
      '分母：$\\sin\\pi x=\\sin(\\pi+\\pi u)=-\\sin\\pi u\\sim-\\pi u$。',
      '极限 $=\\dfrac{-3u}{-\\pi u}=\\dfrac3\\pi$，有限，故极限存在而该点无定义 ⇒ 可去间断点。'
    ],
    why: '考「$\\frac00$ 型间断点」的判定：极限存在 ⇒ 可去；极限为 $\\infty$ ⇒ 无穷间断；左右不等 ⇒ 跳跃。',
    trap: '看到分母趋于 $0$ 就判成无穷间断点。要先算出极限是否有限。'
  },
  {
    id: 'q3-6', topic: 't3', section: 's3', kp: '幂指函数极限', difficulty: 2, type: 'numeric',
    prompt: '求 $\\lim_{x\\to+\\infty}\\left(\\tan\\left(\\dfrac\\pi4+\\dfrac1x\\right)\\right)^{x}$。',
    value: 'e^2', ans: '$e^{2}$',
    hints: ['先取对数，再用 $\\tan(\\frac\\pi4+t)=\\dfrac{1+\\tan t}{1-\\tan t}$。'],
    steps: [
      '记 $t=\\dfrac1x\\to0^+$，取对数：$\\ln L=\\lim_{t\\to0^+}\\dfrac{\\ln\\tan(\\frac\\pi4+t)}{t}$。',
      '用 $\\tan\\left(\\dfrac\\pi4+t\\right)=\\dfrac{1+\\tan t}{1-\\tan t}\\approx1+2t$（$t$ 很小时），故 $\\ln\\tan(\\cdots)\\approx\\ln(1+2t)\\approx2t$。',
      '于是 $\\ln L\\to2$，$L=e^{2}$。',
      '另一种写法：用 $\\frac00$ 型洛必达，结果同为 $2$。'
    ],
    why: '幂指型（底数、指数都随 $x$ 变）一律先取对数，再用 $\\ln(1+u)\\sim u$ 或洛必达。',
    trap: '把 $\\tan(\\frac\\pi4+\\frac1x)\\to1$ 与指数 $x\\to\\infty$ 分开算，得出 $1^{\\infty}=1$。'
  },
  {
    id: 'q3-7', topic: 't3', section: 's3', kp: '高阶导数与莱布尼茨公式', difficulty: 3, type: 'numeric',
    prompt: '设 $y=xe^{2x}$，则 $y^{(2024)}(x)=2^{2024}e^{2x}(x+c)$。求常数 $c$。',
    value: 1012, ans: '$c=1012$',
    hints: ['用莱布尼茨公式，只有 $x$ 的 $0$ 阶与 $1$ 阶导存活。'],
    steps: [
      '莱布尼茨：$(xe^{2x})^{(n)}=\\sum_{k=0}^{n}\\binom nk x^{(k)}\\left(e^{2x}\\right)^{(n-k)}$，而 $x^{(k)}=0$（$k\\ge2$）。',
      '只留 $k=0,1$：$x\\cdot2^{n}e^{2x}+n\\cdot1\\cdot2^{n-1}e^{2x}=2^{n-1}e^{2x}(2x+n)$。',
      '改写成题目形式：$2^{n}e^{2x}\\left(x+\\dfrac n2\\right)$。',
      '取 $n=2024$：$c=\\dfrac{2024}{2}=1012$。'
    ],
    why: '考「多项式乘指数」的高阶导数：多项式只有有限阶非零，莱布尼茨一展开就只剩两项。',
    trap: '忘记 $(e^{2x})^{(n)}=2^ne^{2x}$ 里的因子 $2^n$；或把 $c$ 直接写成 $2024$（少了除以 $2$）。'
  },
  {
    id: 'q3-8', topic: 't3', section: 's1', kp: '参数方程求导', difficulty: 2, type: 'numeric',
    prompt: '曲线由参数方程 $x=1+t+\\sin^{2}t,\\ y=t^{2}+\\sin t$ 给出。求它在 $x=1$ 处的切线斜率 $\\dfrac{dy}{dx}$。',
    value: 1, ans: '$\\dfrac{dy}{dx}=1$（切线为 $y=x-1$）',
    hints: ['先由 $x=1$ 定出 $t$，再用 $\\frac{dy}{dx}=\\frac{y\'(t)}{x\'(t)}$。'],
    steps: [
      '由 $x(t)=1$ 得 $t+\\sin^{2}t=0$，即 $t=0$（该函数在 0 附近严格单调增）。此时 $y(0)=0$，点是 $(1,0)$。',
      '分别求导：$x\'(t)=1+2\\sin t\\cos t=1+\\sin 2t$，$y\'(t)=2t+\\cos t$。',
      '在 $t=0$：$x\'=1$、$y\'=1$，故斜率 $\\dfrac{dy}{dx}=1$，切线为 $y=x-1$。'
    ],
    why: '参数方程求切线固定两步：先由 $x$ 定出参数值，再用 $dy/dx=y\'/x\'$。',
    trap: '忘记先解 $t$；或把 $x\'(t)$ 写成 $1+2\\sin t$（漏了链式法则的 $\\cos t$）。'
  },
  {
    id: 'q3-9', topic: 't3', section: 's3', kp: '复合函数求导', difficulty: 2, type: 'numeric',
    prompt: '设 $y=\\ln\\left(e^{x}+\\sqrt{1+e^{2x}}\\right)$，求 $\\left.\\dfrac{dy}{dx}\\right|_{x=0}$。',
    value: 'sqrt(2)/2', accept: ['sqrt(2)/2', '1/sqrt(2)'], ans: '$\\dfrac{\\sqrt2}{2}$',
    hints: ['先算 $\\left(e^x+\\sqrt{1+e^{2x}}\\right)\'$，再代 $x=0$。'],
    steps: [
      '记 $u=e^{x}+\\sqrt{1+e^{2x}}$，则 $y\'=\\dfrac{u\'}{u}$。',
      '$u\'=e^{x}+\\dfrac{e^{2x}}{\\sqrt{1+e^{2x}}}$。',
      '$x=0$ 时 $u=1+\\sqrt2$，$u\'=1+\\dfrac{1}{\\sqrt2}$。',
      '$y\'=\\dfrac{1+\\frac{1}{\\sqrt2}}{1+\\sqrt2}=\\dfrac{1}{\\sqrt2}=\\dfrac{\\sqrt2}{2}$。'
    ],
    why: '复合 + 根号的标准题：整体看成 $\\ln u$，耐心算 $u\'$，最后统一代点。',
    trap: '把 $\\sqrt{1+e^{2x}}$ 求导写成 $\\frac{1}{2\\sqrt{1+e^{2x}}}$（漏了内层导数 $2e^{2x}$）。'
  },
  {
    id: 'q3-10', topic: 't3', section: 's3', kp: '复合与抽象函数', difficulty: 2, type: 'numeric',
    prompt: '已知 $f\'(x)=\\dfrac1x$，而 $y=f\\left(\\dfrac{x-1}{x+1}\\right)$。求 $\\left.\\dfrac{dy}{dx}\\right|_{x=2}$。',
    value: '2/3', ans: '$\\dfrac23$',
    hints: ['外层用 $f\'$ 的已知式（把内层整体当自变量），内层再求导。'],
    steps: [
      '记 $u=\\dfrac{x-1}{x+1}$，则 $y\'=f\'(u)\\cdot u\'=\\dfrac{1}{u}\\cdot u\'$。',
      '$u\'=\\dfrac{(x+1)-(x-1)}{(x+1)^{2}}=\\dfrac{2}{(x+1)^{2}}$。',
      '$x=2$ 时 $u=\\dfrac13$，故 $f\'(u)=3$，$u\'=\\dfrac{2}{9}$。',
      '$y\'\\big|_{x=2}=3\\cdot\\dfrac29=\\dfrac23$。'
    ],
    why: '抽象函数 + 内层函数的链式法则：$f\'$ 只认「内层当成一个字母」，不要去猜 $f$ 的表达式。',
    trap: '把 $f\'\\left(\\frac{x-1}{x+1}\\right)$ 直接当成 $y\'$，漏乘内层导数 $\\dfrac{2}{(x+1)^2}$。'
  },
  {
    id: 'q4-7', topic: 't4', section: 's1', kp: '中值定理里的 θ', difficulty: 3, type: 'numeric',
    prompt: '对 $f(t)=\\ln(1+t)$ 在 $[0,x]$ 上使用拉格朗日中值定理，可写成 $\\ln(1+x)=\\dfrac{x}{1+\\theta x}$，其中 $\\theta\\in(0,1)$。求 $\\lim_{x\\to0}\\theta$。',
    value: '1/2', ans: '$\\dfrac12$',
    hints: ['先把 $\\theta$ 解成 $x$ 的显式表达式，再做泰勒展开。'],
    steps: [
      '由 $\\ln(1+x)=x\\cdot\\dfrac{1}{1+\\theta x}$ 解出 $1+\\theta x=\\dfrac{x}{\\ln(1+x)}$。',
      '故 $\\theta=\\dfrac{1}{x}\\left(\\dfrac{x}{\\ln(1+x)}-1\\right)$。',
      '展开 $\\ln(1+x)=x-\\dfrac{x^{2}}{2}+o(x^{2})$，得 $\\dfrac{x}{\\ln(1+x)}=\\dfrac{1}{1-\\frac x2+o(x)}=1+\\dfrac x2+o(x)$。',
      '代回：$\\theta=\\dfrac{1}{x}\\left(\\dfrac x2+o(x)\\right)\\to\\dfrac12$。'
    ],
    why: '「中值定理里的 $\\theta$」是固定考法：把 $\\theta$ 解成 $x$ 的函数，再用泰勒或洛必达求极限。',
    trap: '以为 $\\theta$ 是常数；实际上它随 $x$ 变化，题目问的是 $x\\to0$ 时的极限。'
  },

  {
    id: 'q4-8', topic: 't4', section: 's3', kp: '高阶导数与展开系数', difficulty: 3, type: 'choice',
    prompt: '设 $f(x)=x^{2}\\cos x$，则 $f^{(2n)}(0)$ 等于：',
    choices: [
      '$\\dfrac{(-1)^{n}}{(2n)!}$',
      '$\\dfrac{(-1)^{n-1}}{(2n-2)!}$',
      '$(-1)^{n-1}2n(2n-1)$',
      '$(-1)^{n}2n(2n-1)$'
    ],
    answer: 2,
    ans: 'C。$f^{(2n)}(0)=(-1)^{n-1}2n(2n-1)$。',
    hints: ['先写 $\\cos x$ 的展开式，乘上 $x^{2}$，再找 $x^{2n}$ 的系数。'],
    steps: [
      '$\\cos x=\\sum_{k\\ge0}\\dfrac{(-1)^{k}}{(2k)!}x^{2k}$，故 $x^{2}\\cos x=\\sum_{k\\ge0}\\dfrac{(-1)^{k}}{(2k)!}x^{2k+2}$。',
      '取 $x^{2n}$ 项需 $2k+2=2n$，即 $k=n-1$，系数为 $\\dfrac{(-1)^{n-1}}{(2n-2)!}$。',
      '$f^{(2n)}(0)=(2n)!\\cdot$ 该系数 $=(-1)^{n-1}\\dfrac{(2n)!}{(2n-2)!}=(-1)^{n-1}2n(2n-1)$。',
      '选 C。'
    ],
    why: '用泰勒系数反推高阶导数：$f^{(k)}(0)=k!\\,c_k$，比逐阶求导快得多。',
    trap: '选 A 或 B：那是「系数」，题目问「导数值」，要乘上 $(2n)!$。'
  },
  {
    id: 'q5-7', topic: 't5', section: 's2', kp: '分部积分', difficulty: 2, type: 'numeric',
    prompt: '求 $\\displaystyle\\int_1^{e}x\\ln x\\,dx$。',
    value: '(e^2+1)/4', ans: '$\\dfrac{e^{2}+1}{4}$',
    hints: ['分部积分：把 $\\ln x$ 当 $u$，把 $x\\,dx$ 当 $dv$。'],
    steps: [
      '取 $u=\\ln x$、$dv=x\\,dx$，则 $du=\\dfrac{dx}{x}$、$v=\\dfrac{x^{2}}{2}$。',
      '原函数：$\\int x\\ln x\\,dx=\\dfrac{x^{2}}{2}\\ln x-\\dfrac{x^{2}}{4}$。',
      '$x=e$ 处：$\\dfrac{e^{2}}{2}-\\dfrac{e^{2}}{4}=\\dfrac{e^{2}}{4}$；$x=1$ 处：$0-\\dfrac14=-\\dfrac14$。',
      '相减：$\\dfrac{e^{2}}{4}+\\dfrac14=\\dfrac{e^{2}+1}{4}$。'
    ],
    why: '「多项式 × 对数」一律分部积分，且把对数放在 $u$ 位（对它求导会变成有理函数，越算越简单）。',
    trap: '把 $\\ln x$ 放进 $dv$ 位，结果越积越乱。'
  },
  {
    id: 'q5-8', topic: 't5', section: 's2', kp: '对称区间与奇偶性', difficulty: 3, type: 'numeric',
    prompt: '求 $\\displaystyle\\int_{-\\pi/2}^{\\pi/2}\\left(x^{3}+\\sin^{2}x\\right)\\cos^{2}x\\,dx$。',
    value: 'pi/8', ans: '$\\dfrac{\\pi}{8}$',
    hints: ['拆成两项，先看哪一项是奇函数。'],
    steps: [
      '拆开：$\\int x^{3}\\cos^{2}x\\,dx+\\int\\sin^{2}x\\cos^{2}x\\,dx$，区间都是 $[-\\pi/2,\\pi/2]$。',
      '第一项是奇函数在对称区间上积分，值为 $0$。',
      '第二项用二倍角：$\\sin^{2}x\\cos^{2}x=\\dfrac{\\sin^{2}2x}{4}$。',
      '于是积分为 $\\dfrac14\\int_{-\\pi/2}^{\\pi/2}\\sin^{2}2x\\,dx=\\dfrac14\\cdot\\dfrac{\\pi}{2}=\\dfrac{\\pi}{8}$。'
    ],
    why: '对称区间先看奇偶性，能砍掉一项就砍掉，剩下的再用二倍角降次——这是积分题的第一反射。',
    trap: '硬去算 $x^3\\cos^2x$ 的原函数；或忘记 $\\int_{-\\pi/2}^{\\pi/2}\\sin^2 2x\\,dx=\\pi/2$。'
  },
  {
    id: 'q5-9', topic: 't5', section: 's3', kp: '反常积分', difficulty: 2, type: 'numeric',
    prompt: '求 $\\displaystyle\\int_0^{1}\\ln x\\,dx$。',
    value: -1, ans: '$-1$',
    hints: ['$x\\to0^+$ 时 $\\ln x\\to-\\infty$，必须写成极限 $\\lim_{a\\to0^+}\\int_a^1$。'],
    steps: [
      '按定义：$\\lim_{a\\to0^+}\\int_a^{1}\\ln x\\,dx$。',
      '原函数（分部积分可得）：$\\int\\ln x\\,dx=x\\ln x-x$。',
      '代入：$\\left[x\\ln x-x\\right]_a^1=(0-1)-(a\\ln a-a)$。',
      '$a\\to0^+$ 时 $a\\ln a\\to0$、$a\\to0$，故极限为 $-1$，积分收敛。'
    ],
    why: '反常积分在端点必须取极限；$a\\ln a\\to0$ 这个结论要记住（洛必达：$\\frac{\\ln a}{1/a}\\to0$）。',
    trap: '把 $a\\ln a$ 当成 $-\\infty$（因为 $\\ln a\\to-\\infty$），于是误判发散。'
  },
  {
    id: 'q6-7', topic: 't6', section: 's1', kp: '裂项相消', difficulty: 1, type: 'numeric',
    prompt: '求 $\\displaystyle\\sum_{n=1}^{\\infty}\\dfrac{1}{n(n+1)}$。',
    value: 1, ans: '$1$',
    hints: ['$\\dfrac{1}{n(n+1)}=\\dfrac1n-\\dfrac1{n+1}$，写出前 $N$ 项部分和看看。'],
    steps: [
      '裂项：$\\dfrac{1}{n(n+1)}=\\dfrac1n-\\dfrac1{n+1}$。',
      '部分和 $S_N=\\left(1-\\dfrac12\\right)+\\left(\\dfrac12-\\dfrac13\\right)+\\cdots+\\left(\\dfrac1N-\\dfrac1{N+1}\\right)=1-\\dfrac1{N+1}$。',
      '$N\\to\\infty$ 时 $S_N\\to1$，故级数收敛且和为 $1$。'
    ],
    why: '裂项相消是唯一能「直接算出和」的常见套路；先把部分和写成压缩形式，再取极限。',
    trap: '把它当成 $p$ 级数去比阶（它确实收敛，但那样求不出和）；或者漏掉最后一项 $-\\frac{1}{N+1}$。'
  },
  {
    id: 'q6-8', topic: 't6', section: 's2', kp: '条件收敛', difficulty: 2, type: 'choice',
    prompt: '级数 $\\displaystyle\\sum_{n=1}^{\\infty}\\dfrac{(-1)^{n-1}}{\\sqrt n}$ 的敛散性是：',
    choices: ['绝对收敛', '条件收敛', '发散', '无法判断'],
    answer: 1,
    ans: 'B。自身收敛（Leibniz），但取绝对值后是 $p=\\frac12$ 的 $p$ 级数，发散。',
    hints: ['分别判原级数与绝对值级数。'],
    steps: [
      '原级数：$b_n=\\dfrac{1}{\\sqrt n}$ 单调递减且趋于 $0$，由 Leibniz 判别收敛。',
      '绝对值级数：$\\sum\\dfrac{1}{\\sqrt n}$ 是 $p=\\dfrac12\\le1$ 的 $p$ 级数，发散。',
      '收敛但不绝对收敛 ⇒ 条件收敛。'
    ],
    why: '条件收敛的标准例子（把 $\\frac1n$ 换成 $\\frac{1}{\\sqrt n}$ 结论不变），考的是「Leibniz 只管收敛，不管绝对」。',
    trap: '以为通项趋于 $0$ 就绝对收敛；或把 $p=\\frac12$ 当成 $>1$。'
  },
  {
    id: 'q6-9', topic: 't6', section: 's3', kp: '收敛半径', difficulty: 2, type: 'numeric',
    prompt: '求幂级数 $\\displaystyle\\sum_{n=1}^{\\infty}\\dfrac{x^{n}}{n\\cdot3^{n}}$ 的收敛半径 $R$。',
    value: 3, ans: '$R=3$',
    hints: ['$c_n=\\dfrac{1}{n\\cdot3^{n}}$，用 $R=\\lim\\left|\\dfrac{c_n}{c_{n+1}}\\right|$。'],
    steps: [
      '$c_n=\\dfrac{1}{n\\cdot3^{n}}$。',
      '比值：$\\left|\\dfrac{c_n}{c_{n+1}}\\right|=\\dfrac{(n+1)3^{n+1}}{n\\cdot3^{n}}=3\\cdot\\dfrac{n+1}{n}\\to3$。',
      '故 $R=3$：$|x|<3$ 绝对收敛，$|x|>3$ 发散。',
      '端点另算：$x=3$ 得调和级数（发散），$x=-3$ 得交错调和级数（收敛），收敛区间 $[-3,3)$。'
    ],
    why: '考「半径 = 系数比」，同时提醒端点必须单独验——半径与收敛域是两件事。',
    trap: '把 $3^n$ 当成在分母外面，算出 $R=1$；或者求出 $R=3$ 就把端点也一并写进收敛域。'
  },
  {
    id: 'q6-10', topic: 't6', section: 's1', kp: '根值判别法', difficulty: 2, type: 'choice',
    prompt: '级数 $\\displaystyle\\sum_{n=1}^{\\infty}\\left(\\dfrac{n}{2n+1}\\right)^{n}$ 的敛散性是：',
    choices: ['收敛', '发散', '无法用根值判别法判断', '条件收敛'],
    answer: 0,
    ans: 'A。$\\sqrt[n]{a_n}=\\dfrac{n}{2n+1}\\to\\dfrac12<1$，由根值判别法收敛。',
    hints: ['通项带 $n$ 次方时，开 $n$ 次方最省事。'],
    steps: [
      '记 $a_n=\\left(\\dfrac{n}{2n+1}\\right)^{n}$，开 $n$ 次方：$\\sqrt[n]{a_n}=\\dfrac{n}{2n+1}$。',
      '$\\lim_{n\\to\\infty}\\dfrac{n}{2n+1}=\\dfrac12<1$。',
      '由根值判别法，级数收敛。'
    ],
    why: '通项里出现「整体 $n$ 次方」时，根值判别法一步到位；比先算通项极限再找比较对象快得多。',
    trap: '用「通项趋于 $0$ 所以收敛」——这只在正项级数里不成立（调和级数是反例），必须用判别法。'
  },
  {
    id: 'q3-11', topic: 't3', section: 's1', kp: '微分与实际增量', difficulty: 1, type: 'numeric',
    prompt: '设 $y=x^2$，在 $x=1$ 处取 $dx=0.1$。求微分 $dy$。',
    value: 0.2, ans: '$dy=0.2$；实际增量 $\\Delta y=0.21$。',
    hints: ['先求导，再把出发点和水平变化代入 $dy=f\'(x)dx$。'],
    steps: [
      '求导：$f\'(x)=2x$，所以出发点的斜率 $f\'(1)=2$。',
      '微分是切线预测的变化：$dy=f\'(1)dx=2\\times0.1=0.2$。',
      '对比真实变化：$\\Delta y=f(1.1)-f(1)=1.21-1=0.21$。',
      '两者相差 $0.01=dx^2$；微分是线性近似，不必与实际增量完全相等。'
    ],
    why: '微分把函数的局部变化用切线近似，适合估算小范围变化。',
    trap: '将 $dy$ 和 $\\Delta y$ 当作同一个量；对于这道题它们分别是 0.2 和 0.21。'
  },
];
