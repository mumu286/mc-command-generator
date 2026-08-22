// 导入生成函数（注意：因为 Electron 渲染进程默认不支持 ES Module，
// 我们需要用 <script type="module"> 或者用 require。这里先用简单方式）
// 为了演示，我们直接把函数定义放在这个文件中，后续再拆分

function generateGive(version, config) {
  const { targets = '@s', item, count = 1 } = config;
  if (!item) return '错误：请选择物品';
  let cmd = `/give ${targets} ${item}`;
  if (count > 1) cmd += ` ${count}`;
  return cmd;
}

// 获取 DOM 元素
const versionSelect = document.getElementById('version');
const itemInput = document.getElementById('itemInput'); // 需要在 HTML 中添加
const countInput = document.getElementById('countInput'); // 需要在 HTML 中添加
const generateBtn = document.getElementById('generateBtn');
const resultBox = document.getElementById('result');

// 点击生成按钮
generateBtn.addEventListener('click', () => {
  const version = versionSelect.value;
  const config = {
    targets: '@s',
    item: itemInput ? itemInput.value : 'minecraft:stone',
    count: countInput ? parseInt(countInput.value) || 1 : 1
  };

  try {
    const command = generateGive(version, config);
    resultBox.textContent = command;
  } catch (error) {
    resultBox.textContent = '❌ ' + error.message;
  }
});