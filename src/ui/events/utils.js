// ============================================================
// 工具函数
// ============================================================

/**
 * 重置食物子面板到默认状态（显示“食物消耗”）
 */
export function resetFoodSubTabs() {
    const consumption = document.getElementById('food-consumption');
    const effect = document.getElementById('food-effect');
    const tool = document.getElementById('food-tool');
    
    if (consumption) consumption.style.display = 'block';
    if (effect) effect.style.display = 'none';
    if (tool) tool.style.display = 'none';

    document.querySelectorAll('.food-tab-btn').forEach(b => {
        b.style.opacity = '0.6';
        b.classList.remove('active');
    });
    const activeBtn = document.querySelector('.food-tab-btn[data-foodtab="consumption"]');
    if (activeBtn) {
        activeBtn.style.opacity = '1';
        activeBtn.classList.add('active');
    }
}

/**
 * 数字输入清理：非数字内容自动置为 0
 */
export function sanitizeNumberInput(input) {
    if (!input) return;
    input.addEventListener('input', () => {
        const val = input.value.trim();
        if (val === '') return;
        const num = parseFloat(val);
        if (isNaN(num)) {
            input.value = '0';
        }
    });
}