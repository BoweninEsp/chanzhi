const RULES = {
  字牌产值: [
    { name: '道闸牌/普通灯箱/刻字/捞字（常规）', price: 30 },
    { name: '道闸牌/普通灯箱/刻字/捞字（图文复杂）', price: 70 },
    { name: '喷绘（图文横幅）', price: 50 },
    { name: '喷绘（产品图处理）', price: 100 },
    { name: '喷绘（菜单内容全排）', price: 200 },
    { name: '广告牌/立体字/发光字（常规）', price: 50 },
    { name: '广告牌/立体字/发光字（Y款/Z款设计）', price: 150 },
    { name: '霓虹灯（正常）', price: 150 },
    { name: '霓虹灯（复杂）', price: 250 },
    { name: '活动背景板/易拉宝（常规）', price: 150 },
    { name: '活动背景板/易拉宝（复杂）', price: 300 },
    { name: '字牌备货附件（3-5个）', price: 80 },
    { name: '字牌备货附件（5-10个）', price: 100 },
    { name: '字牌备货附件（10-20个）', price: 180 }
  ],
  印刷产值: [
    { name: '印章/时间表/信封/二维码台签/奖杯', price: 30 },
    { name: '名片/券类/开单本/贴纸/袋子套', price: 60 },
    { name: '吊牌（常规）', price: 60 },
    { name: '桌布纸（常规）', price: 100 },
    { name: '桌布纸（复杂）', price: 150 },
    { name: '普通宣传单（常规）', price: 120 },
    { name: '普通宣传单（复杂）', price: 200 },
    { name: '荣誉证书设计打印调试', price: 50 },
    { name: 'logo设计（简单）', price: 60 },
    { name: 'logo设计（中）', price: 100 },
    { name: 'logo设计（难）', price: 180 },
    { name: 'logo设计（全新设计）', price: 1000 },
    { name: '菜单（80欧/页档）', price: 80 },
    { name: '菜单（100欧/页档）', price: 100 },
    { name: '菜单（120欧/页档）', price: 120 },
    { name: '菜单（140欧/页档）', price: 140 },
    { name: '外卖单（400欧/页档）', price: 400 },
    { name: '外卖单（500欧/页档）', price: 500 },
    { name: '外卖单（650欧/页档）', price: 650 },
    { name: '外卖单（700欧/页档）', price: 700 },
    { name: '台历（单张40）', price: 40 },
    { name: '台历（整套70）', price: 70 },
    { name: '书刊目录画册（参考菜单产值）', price: 120 }
  ]
};

const categorySelect = document.querySelector('#categorySelect');
const itemSelect = document.querySelector('#itemSelect');
const qtyInput = document.querySelector('#qtyInput');
const priceInput = document.querySelector('#priceInput');
const adjustInput = document.querySelector('#adjustInput');
const noteInput = document.querySelector('#noteInput');
const entriesBody = document.querySelector('#entriesBody');

const targetInput = document.querySelector('#targetInput');
const rateInput = document.querySelector('#rateInput');
const doubleInput = document.querySelector('#doubleInput');
const baseInput = document.querySelector('#baseInput');
const leaderInput = document.querySelector('#leaderInput');
const resultText = document.querySelector('#resultText');

const entries = [];

function initCategories() {
  Object.keys(RULES).forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
  renderItems();
}

function renderItems() {
  const category = categorySelect.value;
  const list = RULES[category] || [];
  itemSelect.innerHTML = '';
  list.forEach((item, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = `${item.name}（${item.price}欧）`;
    itemSelect.appendChild(option);
  });
  syncPrice();
}

function syncPrice() {
  const category = categorySelect.value;
  const list = RULES[category] || [];
  const idx = Number(itemSelect.value || 0);
  const item = list[idx];
  if (item) priceInput.value = item.price;
}

function calcSubtotal(entry) {
  const raw = entry.qty * entry.price;
  return raw * (1 + entry.adjust / 100);
}

function renderTable() {
  entriesBody.innerHTML = '';
  entries.forEach((entry, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${entry.category} / ${entry.itemName}</td>
      <td>${entry.qty}</td>
      <td>${entry.price}</td>
      <td>${entry.adjust}%</td>
      <td>${calcSubtotal(entry).toFixed(2)}</td>
      <td>${entry.note || '-'}</td>
      <td><button class="remove-btn" data-index="${i}">删除</button></td>
    `;
    entriesBody.appendChild(tr);
  });
  renderSummary();
}

function renderSummary() {
  const output = entries.reduce((sum, e) => sum + calcSubtotal(e), 0);
  const target = Number(targetInput.value) || 0;
  const rate = (Number(rateInput.value) || 0) / 100;
  const multi = Number(doubleInput.value) || 1;
  const base = Number(baseInput.value) || 0;
  const leader = Number(leaderInput.value) || 0;

  const normalPart = Math.min(output, target);
  const extraPart = Math.max(output - target, 0);
  const commission = normalPart * rate + extraPart * rate * multi;
  const salary = Math.max(base, commission) + leader;

  resultText.innerHTML = `
    总产值：<strong class="val">${output.toFixed(2)}</strong><br />
    提成：<strong class="val">${commission.toFixed(2)}</strong>
    （目标内 ${target} 按 ${rate * 100}% ，超出部分按 ${rate * 100 * multi}%）<br />
    预计工资：<strong class="val">${salary.toFixed(2)}</strong>
    （保底 ${base} + 小组长补贴 ${leader}）
  `;
}

categorySelect.addEventListener('change', renderItems);
itemSelect.addEventListener('change', syncPrice);
[targetInput, rateInput, doubleInput, baseInput, leaderInput].forEach((el) => {
  el.addEventListener('input', renderSummary);
});

document.querySelector('#addBtn').addEventListener('click', () => {
  const category = categorySelect.value;
  const idx = Number(itemSelect.value);
  const item = RULES[category][idx];

  const entry = {
    category,
    itemName: item.name,
    qty: Number(qtyInput.value) || 0,
    price: Number(priceInput.value) || 0,
    adjust: Number(adjustInput.value) || 0,
    note: noteInput.value.trim()
  };
  entries.push(entry);
  renderTable();
});

document.querySelector('#clearBtn').addEventListener('click', () => {
  entries.length = 0;
  renderTable();
});

entriesBody.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.classList.contains('remove-btn')) return;
  const index = Number(target.dataset.index);
  if (Number.isNaN(index)) return;
  entries.splice(index, 1);
  renderTable();
});

initCategories();
renderSummary();
