/* ============================================
   2026年高考志愿·家庭决策体检问卷 — 应用逻辑
   全局作用域 — 供 HTML onclick 调用
   ============================================ */

// ==================== GLOBAL DATA ====================
var ALL_DATA = {
  parent: {},
  student: {},
  holland: { scores: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }, answers: [] },
  meta: { version: '1.0', date: new Date().toISOString() }
};

// ==================== HOLLAND QUESTIONS (36题) ====================
var HOLLAND_QUESTIONS = [
  { id: 1,  type: 'C', text: '老师布置作业如果只说“随便写点”，我会很难受，我更希望有明确的字数、格式和打分标准。' },
  { id: 2,  type: 'R', text: '遇到自行车掉链子、笔坏了或家里小物件损坏，比起花钱找人，我更喜欢自己动手修好。' },
  { id: 3,  type: 'I', text: '遇到没见过的数理化难题，哪怕花上一整晚时间，我也要把它彻底想通才痛快。' },
  { id: 4,  type: 'A', text: '做PPT、写笔记或收拾桌面时，我非常在意排版好不好看、颜色搭不搭配。' },
  { id: 5,  type: 'S', text: '同学遇到伤心事或者压力大时，我通常是那个很愿意倾听并安抚他们情绪的人。' },
  { id: 6,  type: 'E', text: '在小组作业或办班级活动时，我通常是那个主动站出来分配任务、拍板做决定的人。' },
  { id: 7,  type: 'R', text: '相比于整节课坐在座位上听讲，我更喜欢有身体活动的课（比如体育课、物理化学实验课）。' },
  { id: 8,  type: 'S', text: '如果我掌握了一个好用的学习技巧，我会很乐意甚至很主动地教给其他不懂的同学。' },
  { id: 9,  type: 'C', text: '我的书桌、抽屉或电脑里的文件总是收拾得整整齐齐，需要找东西时非常快。' },
  { id: 10, type: 'E', text: '我觉得做事情就应该去争取最好的结果，或者主动去竞选班委、社团负责人。' },
  { id: 11, type: 'I', text: '相比于看搞笑短视频，我更喜欢看能涨知识的硬核科普视频（比如科技解析、历史解密）。' },
  { id: 12, type: 'A', text: '写作文或办板报时，我极度讨厌套用千篇一律的模板，总想弄点与众不同的新创意。' },
  { id: 13, type: 'I', text: '看到一个复杂的社会现象或自然现象，我总是习惯性地去分析它背后深层的逻辑和原因。' },
  { id: 14, type: 'R', text: '买来的拼图、高达模型或者需要复杂组装的东西，我总能很快且专注地拼好。' },
  { id: 15, type: 'E', text: '当我和同学意见不一致时，我很擅长用各种理由把他们说服，让他们听我的。' },
  { id: 16, type: 'C', text: '每次大考交卷前，我都会强迫症一样地仔细检查有没有算错小数点或者填错答题卡。' },
  { id: 17, type: 'A', text: '听音乐、看小说或看电影时，我很容易深陷其中，脑子里能浮现出非常生动的情绪和画面。' },
  { id: 18, type: 'S', text: '在一个小组里，如果有人被冷落或者情绪不对，我通常能第一时间察觉到。' },
  { id: 19, type: 'E', text: '组织活动时，比起自己埋头干活，我更擅长把合适的人安排到合适的位置上。' },
  { id: 20, type: 'I', text: '我特别讨厌死记硬背，如果不理解公式或概念是怎么推导出来的，我就很难记住。' },
  { id: 21, type: 'S', text: '参加班级或社团活动时，比起一个人单干，我更喜欢大家聚在一起互相配合的氛围。' },
  { id: 22, type: 'A', text: '我常常脑洞大开，有很多天马行空的想法，哪怕有些想法看起来很不切实际。' },
  { id: 23, type: 'C', text: '我习惯把每天要做的作业和事情列成清单，划掉一项就有一项的安全感。' },
  { id: 24, type: 'R', text: '我对书本上的纯理论不太感冒，但我很在乎学的东西“在现实中到底能干嘛”。' },
  { id: 25, type: 'S', text: '看到别人因为我的帮助而解决了困难，我会获得极大的满足感。' },
  { id: 26, type: 'C', text: '比起自己去开拓一个充满未知的新领域，我更愿意在一个规章制度完善的环境里按部就班地工作。' },
  { id: 27, type: 'R', text: '外出旅游或参加活动时，比起写攻略，我更喜欢负责看地图指路、搬运东西或搭帐篷等实际操作。' },
  { id: 28, type: 'E', text: '我非常看重个人的成就、地位和未来的收入潜力，做事通常带有比较明确的目的性。' },
  { id: 29, type: 'A', text: '极度枯燥、机械重复的刷题生活会让我感到窒息，我需要时间去听歌、画画或发呆来回血。' },
  { id: 30, type: 'I', text: '当大家都在盲目跟风讨论一件事时，我通常会持怀疑态度，并自己去查资料寻找真相。' },
  { id: 31, type: 'A', text: '我对自身的情绪变化非常敏感，也常常能察觉到一部作品（书或电影）里的细腻情感。' },
  { id: 32, type: 'R', text: '面对复杂的人际纠纷我会觉得很烦，我更喜欢一个人安静地对付一件具体的物品或任务。' },
  { id: 33, type: 'C', text: '我对整理数据、做表格或者核对账目这类需要极度细心和耐心的事情，并不会感到排斥。' },
  { id: 34, type: 'S', text: '相比于面对冰冷的机器或数据，我更向往未来能从事天天和不同人打交道的工作。' },
  { id: 35, type: 'E', text: '在公开场合发言或进行辩论时，我不会感到怯场，反而觉得很有挑战性。' },
  { id: 36, type: 'I', text: '我很享受一个人沉浸在复杂的逻辑思考中，即使这种思考在外人看来很枯燥。' }
];

var HOLLAND_PROFILES = {
  primary: {
    R: '你是一个倾向于‘眼见为实’的实干家。你喜欢处理具体、可操作的任务，内心抗拒空谈理论；在未来的职业规划中，比起纯文科的万金油方向，你更看重能否掌握一门不可替代的‘硬技能’。',
    I: '你具备极强的逻辑剥离能力与求知欲。你习惯探究事物的底层规则，相比于处理复杂的人际应酬，你更享受沉浸在专业领域的深度钻研与问题解决中。',
    A: '你对情绪、美感或新事物有着敏锐的直觉。你内心极度抗拒机械重复和循规蹈矩的安排，你需要一定的自由度和创造空间，对传统的‘螺丝钉’式工作极易产生厌倦。',
    S: '你拥有出色的同理心和人际感知力。在帮助他人、传递知识或团队协作中，你能获得巨大的自我效能感。与冷冰冰的机器或数据打交道相比，你天然更擅长‘与人打交道’。',
    E: '你是一个强目标导向的破局者。你对结果有着清晰的渴望，具备较强的影响力和决策力。你不惧怕竞争，甚至享受在团队中发挥主导作用，对未来的职业天花板和发展空间有较高要求。',
    C: '你追求极高的确定性和条理性。做事严谨、极度注重细节是你的底色。相比于在未知领域盲目冒险，你更适合在规则明确、体系完善的平台上按部就班地稳扎稳打。'
  },
  secondary: {
    R: '同时，你具备很好的务实精神，执行力强，不畏惧辛苦的实操。',
    I: '并且，你有着冷静理智的头脑，遇到问题习惯先思考再行动。',
    A: '同时，你思维活跃，偶尔会迸发出打破常规的独特想法。',
    S: '并且，你性格中带有温和包容的一面，注重团队氛围与他人的感受。',
    E: '同时，你骨子里带有一股不服输的劲头，敢于争取属于自己的资源。',
    C: '并且，你自带风险规避的雷达，做重大决策前习惯深思熟虑。'
  }
};

// ==================== STATE ====================
var hollandIndex = 0;
var hollandScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
var hollandAnswers = [];

// Swipe state
var swipeCard = null;
var swipeLabelEl = null;
var swipeStartX = 0;
var swipeStartY = 0;

// ==================== NAVIGATION ====================
function switchTo(viewId) {
  var views = document.querySelectorAll('.view');
  for (var i = 0; i < views.length; i++) {
    views[i].classList.remove('active');
    views[i].style.display = 'none';
  }
  var target = document.getElementById(viewId);
  if (!target) return;
  target.style.display = 'flex';
  target.classList.add('active', 'fade-in');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== FORM HELPERS ====================
function selectOption(el) {
  var group = el.parentElement;
  var type = group.dataset.type;
  if (type === 'radio') {
    var items = group.querySelectorAll('.option-item');
    for (var i = 0; i < items.length; i++) { items[i].classList.remove('selected'); }
    el.classList.add('selected');
  } else {
    el.classList.toggle('selected');
  }
}

function selectGridOption(el) {
  var grid = el.parentElement;
  var max = parseInt(grid.dataset.max) || 999;
  var selected = grid.querySelectorAll('.grid-option.selected');
  if (!el.classList.contains('selected') && selected.length >= max) { return; }
  el.classList.toggle('selected');
}

function selectEval(el, key, value) {
  var row = el.closest('tr');
  var cells = row.querySelectorAll('.eval-cell');
  for (var i = 0; i < cells.length; i++) { cells[i].classList.remove('selected'); }
  el.classList.add('selected');
  el.dataset.value = value;
  el.dataset.key = key;
}

// ==================== DATA COLLECTION ====================
function collectFormData(formId) {
  var form = document.getElementById(formId);
  if (!form) { return {}; }
  var data = {};

  // Radio groups
  var radioGroups = form.querySelectorAll('.option-group[data-type="radio"]');
  for (var r = 0; r < radioGroups.length; r++) {
    var group = radioGroups[r];
    var name = group.dataset.name;
    var selected = group.querySelector('.option-item.selected');
    if (selected) {
      var idx = Array.prototype.indexOf.call(group.children, selected);
      data[name] = {
        value: String.fromCharCode(65 + idx),
        label: selected.querySelector('.option-text').textContent.trim()
      };
    }
  }

  // Checkbox groups
  var cbGroups = form.querySelectorAll('.option-group[data-type="checkbox"]');
  for (var c = 0; c < cbGroups.length; c++) {
    var cg = cbGroups[c];
    var cname = cg.dataset.name;
    var arr = [];
    var cSelected = cg.querySelectorAll('.option-item.selected');
    for (var s = 0; s < cSelected.length; s++) {
      arr.push(cSelected[s].querySelector('.option-text').textContent.trim());
    }
    if (arr.length > 0) { data[cname] = arr; }
  }

  // Grid options (subjects)
  var grids = form.querySelectorAll('.grid-options');
  for (var g = 0; g < grids.length; g++) {
    var grid = grids[g];
    var gname = grid.dataset.name;
    var garr = [];
    var gSelected = grid.querySelectorAll('.grid-option.selected');
    for (var gi = 0; gi < gSelected.length; gi++) {
      garr.push(gSelected[gi].textContent.trim());
    }
    if (garr.length > 0) { data[gname] = garr; }
  }

  // Self-evaluation cells
  var evalData = {};
  var eCells = form.querySelectorAll('.eval-cell.selected');
  for (var e = 0; e < eCells.length; e++) {
    var ec = eCells[e];
    if (ec.dataset.key) {
      evalData[ec.dataset.key] = parseInt(ec.dataset.value);
    }
  }
  if (Object.keys(evalData).length > 0) { data['q8_eval'] = evalData; }

  // Text inputs
  var inputs = form.querySelectorAll('.text-input');
  for (var t = 0; t < inputs.length; t++) {
    var inp = inputs[t];
    var qid = inp.dataset.qid;
    if (qid && inp.value.trim()) { data[qid] = inp.value.trim(); }
  }

  return data;
}

// ==================== FORM VALIDATION HELPERS ====================
function checkRadio(formId, name) {
  var form = document.getElementById(formId);
  var group = form.querySelector('.option-group[data-name="' + name + '"]');
  if (!group) return false;
  return !!group.querySelector('.option-item.selected');
}

function checkCheckbox(formId, name) {
  var form = document.getElementById(formId);
  var group = form.querySelector('.option-group[data-name="' + name + '"]');
  if (!group) return false;
  return group.querySelectorAll('.option-item.selected').length > 0;
}

function checkGrid(formId, name) {
  var form = document.getElementById(formId);
  var grid = form.querySelector('.grid-options[data-name="' + name + '"]');
  if (!grid) return false;
  return grid.querySelectorAll('.grid-option.selected').length > 0;
}

function checkEvalAll(formId, keys) {
  var form = document.getElementById(formId);
  for (var i = 0; i < keys.length; i++) {
    var cell = form.querySelector('.eval-cell.selected[data-key="' + keys[i] + '"]');
    if (!cell) return false;
  }
  return true;
}

// ==================== PARENT SUBMIT ====================
function submitParent() {
  var formId = 'parent-form';
  var missing = [];

  if (!checkRadio(formId, 'q1_parent')) missing.push('第1题：发展路径偏好');
  if (!checkRadio(formId, 'q2_parent')) missing.push('第2题：风险承受能力');
  if (!checkRadio(formId, 'q3_parent')) missing.push('第3题：面子与实惠');
  if (!checkRadio(formId, 'q4_parent')) missing.push('第4题：学历支撑上限');
  if (!checkRadio(formId, 'q5_parent')) missing.push('第5题：考公/脱产备考容忍度');
  if (!checkCheckbox(formId, 'q12_parent')) missing.push('第6题：考虑的专业方向（至少选1项）');
  if (!checkRadio(formId, 'q13_parent')) missing.push('第7题：最看重的特质');

  if (missing.length > 0) {
    alert('以下题目尚未完成，请填写后再提交：\n\n' + missing.join('\n'));
    return;
  }

  var data = collectFormData('parent-form');
  ALL_DATA.parent = data;
  localStorage.setItem('qa_parent', JSON.stringify(data));
  localStorage.setItem('qa_phase', 'student');
  switchTo('view-student-transition');
}

// ==================== STUDENT SUBMIT ====================
function submitStudent() {
  var formId = 'student-form';
  var missing = [];

  if (!checkRadio(formId, 'q0_1_gender')) missing.push('第1题：性别');
  if (!checkRadio(formId, 'q0_2_score_tier')) missing.push('第2题：分数层次定位');
  if (!checkRadio(formId, 'q_s1_path')) missing.push('第3题：发展路径偏好');
  if (!checkRadio(formId, 'q_s2_risk')) missing.push('第4题：风险承受能力');
  if (!checkRadio(formId, 'q_s3_face')) missing.push('第5题：面子与实惠');
  if (!checkGrid(formId, 'q6_like')) missing.push('第6题：最喜欢的学科（至少选1门）');
  if (!checkGrid(formId, 'q7_dislike')) missing.push('第7题：最排斥/吃力的学科（至少选1门）');
  if (!checkEvalAll(formId, ['q8_math', 'q8_physics', 'q8_chemistry', 'q8_english']))
    missing.push('第8题：学科能力自评（4科均需选择）');
  if (!checkRadio(formId, 'q10_role')) missing.push('第10题：活动角色选择');
  if (!checkRadio(formId, 'q11_detail')) missing.push('第11题：细节耐受度');
  if (!checkCheckbox(formId, 'q12_student')) missing.push('第12题：考虑的专业方向（至少选1项）');
  if (!checkRadio(formId, 'q13_student')) missing.push('第13题：最看重的特质');

  if (missing.length > 0) {
    alert('以下题目尚未完成，请填写后再提交：\n\n' + missing.join('\n'));
    return;
  }

  var data = collectFormData('student-form');
  // 感官耐受度为选填，未选时设为 null
  if (!data.q9_sensory) { data.q9_sensory = null; }
  ALL_DATA.student = data;
  localStorage.setItem('qa_student', JSON.stringify(data));
  localStorage.setItem('qa_phase', 'holland');
  switchTo('view-holland-intro');
}

// ==================== HOLLAND QUIZ ====================
function startHollandQuiz() {
  hollandIndex = 0;
  hollandScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  hollandAnswers = [];
  switchTo('view-holland');
  setTimeout(function () {
    initSwipeCard();
    renderHollandQuestion();
  }, 300);
}

function renderHollandQuestion() {
  if (hollandIndex >= HOLLAND_QUESTIONS.length) {
    finishHollandQuiz();
    return;
  }
  var q = HOLLAND_QUESTIONS[hollandIndex];
  var card = document.getElementById('swipe-card');
  card.textContent = q.text;
  card.style.transform = '';
  card.style.opacity = '1';
  card.style.transition = '0s';

  document.getElementById('holland-progress-text').textContent =
    (hollandIndex + 1) + '/' + HOLLAND_QUESTIONS.length;
  document.getElementById('holland-progress-fill').style.width =
    ((hollandIndex / HOLLAND_QUESTIONS.length) * 100) + '%';

  var label = document.getElementById('swipe-label');
  if (label) { label.style.opacity = '0'; label.textContent = ''; }

  card.dataset.type = q.type;
  card.dataset.id = q.id;
}

function hollandAnswer(score, direction) {
  var card = document.getElementById('swipe-card');
  var qType = card.dataset.type;
  var qId = parseInt(card.dataset.id);

  hollandScores[qType] += score;
  hollandAnswers.push({ id: qId, type: qType, score: score });

  // Fly-out animation
  card.style.transition = '0.22s ease-in';
  if (direction === 'right') {
    card.style.transform = 'translate(600px, -80px) rotate(25deg)';
  } else if (direction === 'left') {
    card.style.transform = 'translate(-600px, -80px) rotate(-25deg)';
  } else {
    card.style.transform = 'translate(0, -700px)';
  }
  card.style.opacity = '0';

  setTimeout(function () {
    hollandIndex++;
    renderHollandQuestion();
  }, 250);
}

function hollandPrev() {
  if (hollandAnswers.length === 0) return;
  var last = hollandAnswers.pop();
  hollandScores[last.type] -= last.score;
  hollandIndex--;
  renderHollandQuestion();
}

function finishHollandQuiz() {
  ALL_DATA.holland = { scores: hollandScores, answers: hollandAnswers };
  ALL_DATA.meta.date = new Date().toISOString();

  localStorage.setItem('qa_holland', JSON.stringify({
    scores: hollandScores,
    answers: hollandAnswers
  }));
  localStorage.setItem('qa_phase', 'done');

  showResult();
}

// ==================== SWIPE GESTURES ====================
function initSwipeCard() {
  swipeCard = document.getElementById('swipe-card');
  swipeLabelEl = document.getElementById('swipe-label');
  if (!swipeCard) { return; }
  swipeCard.addEventListener('touchstart', onSwipeStart, { passive: false });
  swipeCard.addEventListener('touchmove', onSwipeMove, { passive: false });
  swipeCard.addEventListener('touchend', onSwipeEnd);
}

function onSwipeStart(e) {
  swipeStartX = e.touches[0].clientX;
  swipeStartY = e.touches[0].clientY;
  swipeCard.style.transition = '0s';
}

function onSwipeMove(e) {
  e.preventDefault();
  var dx = e.touches[0].clientX - swipeStartX;
  var dy = e.touches[0].clientY - swipeStartY;
  var rotate = dx / 8;

  swipeCard.style.transform =
    'translate(' + (dx * 1.15) + 'px, ' + (dy * 1.1) + 'px) ' +
    'rotate(' + rotate + 'deg) scale(1.03)';

  if (dx > 50) {
    swipeLabelEl.textContent = '很符合';
    swipeLabelEl.style.color = '#4ade80';
    swipeLabelEl.style.opacity = '1';
  } else if (dx < -50) {
    swipeLabelEl.textContent = '不符合';
    swipeLabelEl.style.color = '#f87171';
    swipeLabelEl.style.opacity = '1';
  } else if (dy < -50) {
    swipeLabelEl.textContent = '一般般';
    swipeLabelEl.style.color = '#facc15';
    swipeLabelEl.style.opacity = '1';
  } else {
    swipeLabelEl.style.opacity = '0';
  }
}

function onSwipeEnd() {
  var SWIPE_THRESHOLD = 40;
  var matrix = new DOMMatrix(getComputedStyle(swipeCard).transform);
  var dx = matrix.m41;
  var dy = matrix.m42;
  var absX = Math.abs(dx);
  var absY = Math.abs(dy);

  // Too small a movement
  if (absX < 30 && absY < 30) {
    resetSwipeCard();
    return;
  }

  // Vertical priority
  if (absY > absX * 1.2) {
    if (dy < -SWIPE_THRESHOLD) {
      hollandAnswer(1, 'up');
    } else {
      resetSwipeCard();
    }
    return;
  }

  // Horizontal
  if (dx > SWIPE_THRESHOLD) {
    hollandAnswer(2, 'right');
  } else if (dx < -SWIPE_THRESHOLD) {
    hollandAnswer(0, 'left');
  } else {
    resetSwipeCard();
  }
}

function resetSwipeCard() {
  if (!swipeCard) { return; }
  swipeCard.style.transition = '0.25s ease-out';
  swipeCard.style.transform = '';
  swipeCard.style.opacity = '1';
  if (swipeLabelEl) { swipeLabelEl.style.opacity = '0'; }
}

// ==================== RESULT ====================
function showResult() {
  switchTo('view-result');
  setTimeout(generateResultQR, 200);
}

function renderRadarChart(scores) {
  var canvas = document.getElementById('radarChart');
  if (!canvas) { return; }
  var ctx = canvas.getContext('2d');

  // Destroy previous chart instance if any
  if (canvas._chart) { canvas._chart.destroy(); }

  canvas._chart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: [
        '现实型(R)', '研究型(I)', '艺术型(A)',
        '社会型(S)', '企业型(E)', '常规型(C)'
      ],
      datasets: [{
        label: '潜能倾向',
        data: [scores.R, scores.I, scores.A, scores.S, scores.E, scores.C],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 12,
          ticks: { stepSize: 2, display: false, color: '#94a3b8' },
          pointLabels: { color: '#cbd5e1', font: { size: 11 } },
          grid: { color: 'rgba(148,163,184,.15)' },
          angleLines: { color: 'rgba(148,163,184,.15)' }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

// ==================== DOWNLOAD ====================
// ---- Binary Encoder ----
// Compact binary format — roughly 60-100 bytes vs ~6KB JSON

// Lookup tables: question option labels → index
var PARENT_Q6_OPTIONS = [
  '临床医学/口腔医学','计算机/软件工程','法学','会计学/财务管理',
  '汉语言文学/新闻传播','师范类','电气工程','石油工程',
  '金融学/经济学','建筑学/土木工程','英语/日语/其他小语种',
  '历史学/世界史/考古学','行政管理/公共事业管理','数学/物理',
  '统计学/大数据','思想政治教育/马克思主义理论','机械工程/自动化'
];

var SUBJECT_OPTIONS = [
  '语文','数学','英语','物理','化学','生物','历史','地理','政治','信息技术','通用技术'
];

var STUDENT_Q9_OPTIONS = [
  '见血、见伤口、见手术场面',
  '解剖动物（包括青蛙、小白鼠）',
  '长时间对着显微镜或用精密工具（手抖不行）',
  '每天在户外风吹日晒',
  '一天到晚对着电脑屏幕敲代码'
];

var STUDENT_Q12_OPTIONS = PARENT_Q6_OPTIONS; // same list

function encodeText(buf, str) {
  // Encode a string as UTF-8 with 1-byte length prefix.
  // Returns array of bytes to append.
  if (str === null || str === undefined || str === '') {
    return [0]; // zero-length = null
  }
  // Simple UTF-8 encoder (handles Chinese BMP characters: 3 bytes each)
  var utf8 = [];
  for (var i = 0; i < str.length; i++) {
    var cp = str.charCodeAt(i);
    if (cp < 0x80) {
      utf8.push(cp);
    } else if (cp < 0x800) {
      utf8.push(0xC0 | (cp >> 6), 0x80 | (cp & 0x3F));
    } else {
      utf8.push(0xE0 | (cp >> 12), 0x80 | ((cp >> 6) & 0x3F), 0x80 | (cp & 0x3F));
    }
  }
  if (utf8.length > 255) { utf8.length = 255; } // clamp to 1-byte length
  return [utf8.length].concat(utf8);
}

function encodeChoiceList(buf, arr, lookupTable) {
  // Encode a list of selected options as count + indices.
  if (!arr || arr.length === 0) { return [0]; }
  var indices = [];
  for (var i = 0; i < arr.length; i++) {
    var idx = lookupTable.indexOf(arr[i]);
    if (idx >= 0) { indices.push(idx); }
  }
  return [indices.length].concat(indices);
}

function buildBinaryResult() {
  var bytes = [];

  // ---- HEADER (6 bytes) ----
  bytes.push(0x47, 0x41, 0x4F, 0x4B); // Magic "GAOK"
  bytes.push(1);                        // Format version
  bytes.push(0);                        // Flags (reserved)

  // ---- PARENT SECTION ----
  var pd = ALL_DATA.parent;

  // q01-q05: radio values (0=A, 1=B, 0xFF=null)
  bytes.push(radioVal(pd, 'q1_parent'));
  bytes.push(radioVal(pd, 'q2_parent'));
  bytes.push(radioVal(pd, 'q3_parent'));
  bytes.push(radioVal(pd, 'q4_parent'));
  bytes.push(radioVal(pd, 'q5_parent'));

  // q06: checkbox (professional directions)
  var q6Arr = pd['q12_parent'] || [];
  bytes.push.apply(bytes, encodeChoiceList(bytes, q6Arr, PARENT_Q6_OPTIONS));
  // q06_other: text
  bytes.push.apply(bytes, encodeText(bytes, pd['q12_other_parent'] || null));

  // q07: radio
  bytes.push(radioVal(pd, 'q13_parent'));
  // q08: text (anxiety)
  bytes.push.apply(bytes, encodeText(bytes, pd['q14_parent'] || null));

  // ---- STUDENT SECTION ----
  var sd = ALL_DATA.student;

  // q01-q05: radio
  bytes.push(radioVal(sd, 'q0_1_gender'));
  bytes.push(radioVal(sd, 'q0_2_score_tier'));
  bytes.push(radioVal(sd, 'q_s1_path'));
  bytes.push(radioVal(sd, 'q_s2_risk'));
  bytes.push(radioVal(sd, 'q_s3_face'));

  // q06: liked subjects (grid)
  bytes.push.apply(bytes, encodeChoiceList(bytes, sd['q6_like'], SUBJECT_OPTIONS));
  bytes.push.apply(bytes, encodeText(bytes, sd['q6_reason'] || null));

  // q07: disliked subjects (grid)
  bytes.push.apply(bytes, encodeChoiceList(bytes, sd['q7_dislike'], SUBJECT_OPTIONS));
  bytes.push.apply(bytes, encodeText(bytes, sd['q7_reason'] || null));

  // q08: self-evaluation — 4 subjects × 2 bits packed into 1 byte
  var evalData = sd['q8_eval'] || {};
  var evalByte = ((clampEval(evalData['q8_math'])    << 6) |
                  (clampEval(evalData['q8_physics'])  << 4) |
                  (clampEval(evalData['q8_chemistry']) << 2) |
                  (clampEval(evalData['q8_english'])));
  bytes.push(evalByte);

  // q09: sensory (optional multi-select)
  var q9Arr = sd['q9_sensory'];
  if (q9Arr && q9Arr.length > 0) {
    bytes.push.apply(bytes, encodeChoiceList(bytes, q9Arr, STUDENT_Q9_OPTIONS));
  } else {
    bytes.push(0); // null
  }

  // q10, q11: radio
  bytes.push(radioVal(sd, 'q10_role'));
  bytes.push(radioVal(sd, 'q11_detail'));

  // q12: professional directions (checkbox)
  var q12Arr = sd['q12_student'] || [];
  bytes.push.apply(bytes, encodeChoiceList(bytes, q12Arr, STUDENT_Q12_OPTIONS));
  bytes.push.apply(bytes, encodeText(bytes, sd['q12_other_student'] || null));

  // q13: radio
  bytes.push(radioVal(sd, 'q13_student'));
  // q14: text
  bytes.push.apply(bytes, encodeText(bytes, sd['q14_student'] || null));

  // ---- MODEL36 SECTION ----
  var hs = ALL_DATA.holland.scores;
  bytes.push(clampScore(hs.R), clampScore(hs.I), clampScore(hs.A),
             clampScore(hs.S), clampScore(hs.E), clampScore(hs.C));

  // 36 answers: 2 bits each → 9 bytes
  var answers = ALL_DATA.holland.answers || [];
  var packed = [0,0,0,0,0,0,0,0,0];
  for (var ai = 0; ai < 36 && ai < answers.length; ai++) {
    var byteIdx = Math.floor(ai / 4);
    var bitOff = 6 - 2 * (ai % 4);
    packed[byteIdx] |= ((answers[ai].score & 0x03) << bitOff);
  }
  bytes.push.apply(bytes, packed);

  return new Uint8Array(bytes);
}

function radioVal(data, name) {
  if (!data || !data[name]) { return 0xFF; }
  var v = data[name].value;
  if (v === undefined || v === null) { return 0xFF; }
  return v.charCodeAt(0) - 65; // 'A'→0, 'B'→1, etc.
}

function clampEval(v) {
  if (v === undefined || v === null) { return 0; }
  return v & 0x03; // 0-3
}

function clampScore(v) {
  if (v === undefined || v === null) { return 0; }
  return v & 0x0F; // 0-15 (max actual: 12)
}

function downloadResult() {
  var binary = buildBinaryResult();
  var blob = new Blob([binary], { type: 'application/octet-stream' });
  var url = URL.createObjectURL(blob);

  var a = document.createElement('a');
  a.href = url;
  var ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  a.download = '高考志愿问卷结果_' + ts + '.bin';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==================== QR CODE ====================
function generateResultQR() {
  var img = document.getElementById('qr-code-img');
  if (!img) { return; }

  // Build binary and encode as base64
  var binary = buildBinaryResult();
  var base64 = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0; i < binary.length; i += 3) {
    var b0 = binary[i];
    var b1 = (i + 1 < binary.length) ? binary[i + 1] : NaN;
    var b2 = (i + 2 < binary.length) ? binary[i + 2] : NaN;
    base64 += chars[b0 >> 2];
    base64 += chars[((b0 & 0x3) << 4) | (isNaN(b1) ? 0 : (b1 >> 4))];
    base64 += isNaN(b1) ? '=' : chars[((b1 & 0xF) << 2) | (isNaN(b2) ? 0 : (b2 >> 6))];
    base64 += isNaN(b2) ? '=' : chars[b2 & 0x3F];
  }

  // Prefix with version marker so decoder can identify the format
  var payload = 'GK1.' + base64;

  try {
    // Use qrcode-generator (global `qrcode` function from CDN)
    var typeNumber = 0; // auto-detect
    var errorCorrection = 'M';
    var qr = qrcode(typeNumber, errorCorrection);
    qr.addData(payload, 'Byte');
    qr.make();
    var dataUrl = qr.createDataURL(8, 2);
    img.src = dataUrl;
    img.style.display = '';
  } catch (e) {
    // Fallback: keep the static image if QR generation fails
    console.warn('QR code generation failed:', e);
  }
}

// ==================== RESTORE STATE ====================
function restoreState() {
  var phase = localStorage.getItem('qa_phase');
  if (!phase) { return; }

  var pd = localStorage.getItem('qa_parent');
  var sd = localStorage.getItem('qa_student');
  var hd = localStorage.getItem('qa_holland');

  if (pd) { ALL_DATA.parent = JSON.parse(pd); }
  if (sd) { ALL_DATA.student = JSON.parse(sd); }
  if (hd) {
    var h = JSON.parse(hd);
    ALL_DATA.holland = h;
    hollandScores = h.scores || { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    hollandAnswers = h.answers || [];
    hollandIndex = hollandAnswers.length;
  }

  // Show resume button
  var welcome = document.getElementById('view-welcome');
  var existingBtn = document.getElementById('btn-resume');
  if (existingBtn) { existingBtn.remove(); }

  var resumeBtn = document.createElement('button');
  resumeBtn.id = 'btn-resume';
  resumeBtn.className = 'btn btn-secondary';
  resumeBtn.style.marginTop = '10px';

  if (phase === 'done') {
    resumeBtn.textContent = '查看上次结果';
    resumeBtn.addEventListener('click', function () { showResult(); });
  } else if (phase === 'holland') {
    resumeBtn.textContent = '继续多维度专业适配度阻断模型 (' + hollandIndex + '/36)';
    resumeBtn.addEventListener('click', function () {
      if (hollandIndex >= HOLLAND_QUESTIONS.length) {
        showResult();
      } else {
        switchTo('view-holland');
        setTimeout(function () {
          initSwipeCard();
          renderHollandQuestion();
        }, 300);
      }
    });
  } else if (phase === 'student') {
    resumeBtn.textContent = '继续学生部分';
    resumeBtn.addEventListener('click', function () {
      switchTo('view-student');
    });
  }

  welcome.appendChild(resumeBtn);
}

// ==================== PARTICLES BACKGROUND ====================
function initParticles() {
  var canvas = document.getElementById('particle-canvas');
  if (!canvas) { return; }
  var ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var particles = [];
  for (var i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) { p.x = canvas.width; }
      if (p.x > canvas.width) { p.x = 0; }
      if (p.y < 0) { p.y = canvas.height; }
      if (p.y > canvas.height) { p.y = 0; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(148,163,184,0.3)';
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// ==================== BOOT ====================
document.addEventListener('DOMContentLoaded', function () {
  initParticles();
  restoreState();

  // Navigation buttons
  document.getElementById('btn-start').addEventListener('click', function () {
    switchTo('view-parent');
  });
  document.getElementById('btn-parent-submit').addEventListener('click', submitParent);
  document.getElementById('btn-student-begin').addEventListener('click', function () {
    switchTo('view-student');
  });
  document.getElementById('btn-student-submit').addEventListener('click', submitStudent);
  document.getElementById('btn-holland-start').addEventListener('click', startHollandQuiz);

  // Holland answer buttons
  document.getElementById('btn-no').addEventListener('click', function () {
    hollandAnswer(0, 'left');
  });
  document.getElementById('btn-mid').addEventListener('click', function () {
    hollandAnswer(1, 'up');
  });
  document.getElementById('btn-yes').addEventListener('click', function () {
    hollandAnswer(2, 'right');
  });

  // Previous question button
  document.getElementById('btn-prev').addEventListener('click', function () {
    hollandPrev();
  });

  // Download button
  document.getElementById('btn-download').addEventListener('click', downloadResult);
});
