// ============================================================
// 主事件入口 (调用各初始化函数)
// ============================================================

import { getDOM } from '../dom.js';
import { setupPreview } from './helpers.js';
import { setupFoodEffectControls, setupEffectSearch, renderEffectList } from './food.js';
import { setupToolSearch, setupToolRuleControls, renderToolRuleList } from './tools.js';
import { sanitizeNumberInput } from './utils.js';
import { setupVersionSwitch, setupUnbreakable } from './misc.js';
import { setupGenerate } from './generate.js';
import { setupCopy } from './copy.js';
import { setupTabSwitching, setupFoodSubTabs } from './tabs.js';

export function setupEvents() {
    const dom = getDOM();

    // ---------- 获取所有 DOM 引用 ----------
    const {
        versionSelect,
        targetSelect,
        targetManual,
        itemSearch,
        countInput,
        damageInput,
        unbreakableCheck,
        unbreakableHint,
        generateBtn,
        resultBox,
        copyBtn,
        copyFeedback,
        lengthWarning,
        glintCheck,
        raritySelect,
        maxDamageInput,
        maxStackInput,
        repairCostInput,
        foodNutrition,
        foodSaturation,
        foodCanAlwaysEat,
        foodEatSeconds,
        foodClearEffects,
        foodUseCooldown,
        effectTypeSelect,
        effectSearch,
        effectSuggestions,
        effectProbability,
        effectDiameter,
        effectDuration,
        effectAmplifier,
        addEffectBtn,
        effectListEl,
        toolEnabled,
        toolDefaultSpeed,
        toolDamagePerBlock,
        toolBlockSearch,
        toolBlockSuggestions,
        toolRuleSpeed,
        toolRuleCorrectDrop,
        addToolRuleBtn,
        toolRuleList,
        enchantCustom,
        addEnchantBtn,
        enchantListEl,
        enchantSelect,
        enchantLevel,
        attrAmountInput,
    } = dom;

    // ---------- 对数字输入框应用清理 ----------
    const numberInputs = [
        countInput, damageInput, maxDamageInput, maxStackInput, repairCostInput,
        foodNutrition, foodSaturation, foodEatSeconds, foodUseCooldown,
        effectProbability, effectDiameter,
        effectDuration, effectAmplifier, toolDefaultSpeed, toolDamagePerBlock,
        toolRuleSpeed, enchantLevel, attrAmountInput,
    ];
    numberInputs.forEach(input => sanitizeNumberInput(input));

    // ---------- 初始化预览 ----------
    setupPreview();

    // ---------- 版本切换 ----------
    setupVersionSwitch(versionSelect);

    // ---------- 无法破坏 ----------
    setupUnbreakable(unbreakableCheck, unbreakableHint, damageInput);

    // ---------- 食用效果 ----------
    if (effectListEl) renderEffectList(effectListEl);
    if (effectSearch && effectSuggestions) {
        setupEffectSearch(effectSearch, effectSuggestions);
    }
    if (effectTypeSelect && effectSearch && effectProbability && effectDiameter &&
        effectDuration && effectAmplifier && addEffectBtn && effectListEl) {
        setupFoodEffectControls(
            effectTypeSelect, effectSearch, effectProbability, effectDiameter,
            effectDuration, effectAmplifier, addEffectBtn, effectListEl
        );
    }

    // ---------- 工具规则 ----------
    if (toolRuleList) renderToolRuleList(toolRuleList);
    if (toolBlockSearch && toolBlockSuggestions) {
        setupToolSearch(toolBlockSearch, toolBlockSuggestions);
    }
    if (toolBlockSearch && toolRuleSpeed && toolRuleCorrectDrop && addToolRuleBtn && toolRuleList) {
        setupToolRuleControls(
            toolBlockSearch, toolRuleSpeed, toolRuleCorrectDrop,
            addToolRuleBtn, toolRuleList
        );
    }

    // ---------- 生成指令 ----------
    setupGenerate(
        generateBtn, versionSelect, targetSelect, targetManual, itemSearch,
        countInput, damageInput, unbreakableCheck, glintCheck, raritySelect,
        maxDamageInput, maxStackInput, repairCostInput,
        foodNutrition, foodSaturation, foodCanAlwaysEat, foodEatSeconds,
        foodClearEffects, foodUseCooldown,
        toolEnabled, toolDefaultSpeed, toolDamagePerBlock,
        resultBox, lengthWarning
    );

    // ---------- 复制指令 ----------
    setupCopy(copyBtn, resultBox, copyFeedback, lengthWarning);

    // ---------- 快捷键 Ctrl+Enter ----------
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (generateBtn) generateBtn.click();
        }
    });

    // ---------- 标签切换 ----------
    setupTabSwitching();

    // ---------- 食物子板块切换 ----------
    setupFoodSubTabs();

    // ========== 自定义版本下拉交互 ==========
    const versionDisplay = document.getElementById('versionDisplay');
    const versionDropdown = document.getElementById('versionDropdown');
    let currentVersion = '26.2';

    if (versionDisplay && versionDropdown) {
        versionDisplay.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = versionDropdown.style.display === 'block';
            versionDropdown.style.display = isVisible ? 'none' : 'block';
        });

        document.querySelectorAll('.version-option').forEach(opt => {
            opt.addEventListener('click', () => {
                const value = opt.dataset.value;
                const text = opt.textContent;
                versionDisplay.textContent = text;
                currentVersion = value;
                versionDropdown.style.display = 'none';
                // 同步到隐藏的 select，触发 change 事件加载对应版本数据
                const hiddenSelect = document.getElementById('versionSelect');
                if (hiddenSelect) {
                    hiddenSelect.value = value;
                    hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        });

        document.addEventListener('click', () => {
            versionDropdown.style.display = 'none';
        });
    }

    console.log('✅ setupEvents 执行完成');
}
