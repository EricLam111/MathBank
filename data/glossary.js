/* 内置数学/分析常用词表（英 → 中）。命中这里就不必联网，也不会翻错。
 * 键一律小写；查表时会自动尝试单复数。 */
window.GLOSSARY = {
  /* ---- 分析基础 ---- */
  'analysis': '分析', 'real analysis': '实分析', 'mathematical analysis': '数学分析',
  'limit': '极限', 'limits': '极限', 'sequence': '数列', 'subsequence': '子列',
  'series': '级数', 'partial sum': '部分和', 'term': '项',
  'converge': '收敛', 'convergent': '收敛的', 'convergence': '收敛性',
  'diverge': '发散', 'divergent': '发散的', 'divergence': '发散性',
  'accumulation point': '聚点', 'cluster point': '聚点', 'limit point': '极限点',
  'cauchy sequence': '柯西列', 'cauchy': '柯西',
  'supremum': '上确界', 'infimum': '下确界', 'upper bound': '上界', 'lower bound': '下界',
  'least upper bound': '最小上界', 'greatest lower bound': '最大下界',
  'maximum': '最大值', 'minimum': '最小值', 'bounded': '有界的', 'boundedness': '有界性',
  'monotone': '单调的', 'monotonic': '单调的', 'increasing': '递增的', 'decreasing': '递减的',
  'squeeze theorem': '夹逼定理', 'completeness': '完备性', 'dense': '稠密的',

  /* ---- 函数与连续 ---- */
  'function': '函数', 'domain': '定义域', 'range': '值域', 'image': '像',
  'inverse function': '反函数', 'composition': '复合', 'composite': '复合的',
  'continuous': '连续的', 'continuity': '连续性', 'discontinuous': '不连续的',
  'uniformly continuous': '一致连续的', 'uniform continuity': '一致连续性',
  'uniform convergence': '一致收敛', 'pointwise': '逐点的',
  'jump discontinuity': '跳跃间断点', 'removable discontinuity': '可去间断点',
  'oscillate': '振荡', 'oscillation': '振荡',
  'interval': '区间', 'neighborhood': '邻域', 'open': '开的', 'closed': '闭的',
  'compact': '紧的', 'connected': '连通的',

  /* ---- 导数与微分 ---- */
  'derivative': '导数', 'differentiable': '可导的', 'differentiability': '可导性',
  'differential': '微分', 'differentials': '微分',
  'slope': '斜率', 'secant': '割线', 'tangent': '切线（正切）', 'tangent line': '切线',
  'normal line': '法线', 'rate of change': '变化率', 'instantaneous': '瞬时的',
  'chain rule': '链式法则', 'product rule': '乘积法则', 'quotient rule': '商法则',
  'implicit differentiation': '隐函数求导', 'higher derivative': '高阶导数',
  'inflection point': '拐点', 'extremum': '极值', 'local maximum': '局部极大值',
  'local minimum': '局部极小值', 'concave': '凹的', 'convex': '凸的',
  'asymptote': '渐近线', 'monotonicity': '单调性',

  /* ---- 中值定理与泰勒 ---- */
  'theorem': '定理', 'lemma': '引理', 'corollary': '推论', 'proposition': '命题',
  'proof': '证明', 'counterexample': '反例', 'hypothesis': '假设', 'conclusion': '结论',
  'mean value theorem': '中值定理', 'rolle': '罗尔', 'rolle theorem': '罗尔定理',
  'lagrange': '拉格朗日', 'cauchy mean value theorem': '柯西中值定理',
  'l hopital': '洛必达', 'lhopital': '洛必达', 'taylor': '泰勒', 'maclaurin': '麦克劳林',
  'taylor series': '泰勒级数', 'taylor expansion': '泰勒展开', 'remainder': '余项',
  'lagrange remainder': '拉格朗日余项', 'expansion': '展开式',

  /* ---- 积分 ---- */
  'integral': '积分', 'integration': '积分法', 'integrand': '被积函数',
  'antiderivative': '原函数', 'primitive': '原函数',
  'riemann': '黎曼', 'riemann sum': '黎曼和', 'riemann integral': '黎曼积分',
  'partition': '分割', 'refinement': '加细', 'integrable': '可积的', 'integrability': '可积性',
  'improper integral': '反常积分', 'fundamental theorem': '基本定理',
  'substitution': '换元', 'integration by parts': '分部积分',
  'area': '面积', 'volume': '体积', 'arc length': '弧长', 'curve': '曲线', 'surface': '曲面',
  'upper sum': '上和', 'lower sum': '下和', 'oscillation sum': '振幅和',

  /* ---- 级数 ---- */
  'absolutely convergent': '绝对收敛的', 'conditionally convergent': '条件收敛的',
  'absolute convergence': '绝对收敛', 'conditional convergence': '条件收敛',
  'alternating': '交错的', 'harmonic': '调和的', 'harmonic series': '调和级数',
  'geometric': '几何的', 'geometric series': '几何级数', 'power series': '幂级数',
  'radius': '半径', 'radius of convergence': '收敛半径', 'interval of convergence': '收敛区间',
  'ratio test': '比值判别法', 'root test': '根值判别法', 'comparison test': '比较判别法',
  'integral test': '积分判别法', 'divergence test': '发散判别法',
  'leibniz': '莱布尼茨', 'basel problem': '巴塞尔问题', 'euler': '欧拉',

  /* ---- 集合与数 ---- */
  'set': '集合', 'subset': '子集', 'union': '并集', 'intersection': '交集',
  'element': '元素', 'mapping': '映射', 'bijection': '双射', 'injection': '单射',
  'surjection': '满射', 'cardinality': '基数', 'countable': '可数的', 'uncountable': '不可数的',
  'rational number': '有理数', 'irrational': '无理数', 'real number': '实数',
  'integer': '整数', 'natural number': '自然数', 'complex number': '复数',
  'absolute value': '绝对值', 'inequality': '不等式', 'equation': '方程',
  'variable': '变量', 'constant': '常数', 'parameter': '参数', 'coefficient': '系数',
  'factor': '因子', 'power': '幂', 'exponent': '指数', 'base': '底数',
  'factorial': '阶乘', 'binomial': '二项式', 'polynomial': '多项式',
  'rational function': '有理函数', 'exponential': '指数函数（指数的）',
  'logarithm': '对数', 'trigonometric': '三角的', 'sine': '正弦', 'cosine': '余弦',
  'induction': '归纳法', 'contradiction': '反证法',
  'sufficient': '充分的', 'necessary': '必要的', 'if and only if': '当且仅当',
  'accumulation': '聚（积累）', 'epsilon': '艾普西隆（ε）', 'delta': '德尔塔（δ）',

  /* ---- 多元与进阶（备用） ---- */
  'partial derivative': '偏导数', 'gradient': '梯度', 'jacobian': '雅可比',
  'double integral': '二重积分', 'triple integral': '三重积分', 'line integral': '曲线积分',
  'surface integral': '曲面积分', 'fourier': '傅里叶', 'laplace': '拉普拉斯',
  'transform': '变换', 'convolution': '卷积', 'metric': '度量', 'norm': '范数',
  'measure': '测度', 'measurable': '可测的', 'null set': '零测集', 'lebesgue': '勒贝格',
  'weierstrass': '魏尔斯特拉斯', 'cantor': '康托尔', 'darboux': '达布',
  'bolzano': '波尔查诺', 'heine': '海涅', 'borel': '博雷尔'
};
