// ============================================================
// 生成指令事件 (含版本不兼容提醒)
// ============================================================

import { generateGive } from '../../core/generators/give.js';
import { calculateDamage } from '../../core/durability.js';
import { getEnchantments } from '../enchantments.js';
import { getAttributes } from '../attributes.js';
import { getBlocks } from '../blocks.js';
import { getFieldStyle } from './helpers.js';
import { getFoodEffects } from './food.js';
import { getToolRules } from './tools.js';
import { addToHistory } from './history.js';

// 检查不支持的功能
function getUnsupportedFeatures(version, config) {
    const unsupported = [];
    if (version === '1.20.2' || version === '1.20.3' || version === '1.20.4') {
        if (config.glint === true) {
            unsupported.push('附魔光效隐藏（1.20.4 无法隐藏光效本身）');
        }
        if (config.eatSeconds !== null) {
            unsupported.push('自定义食用时间（1.20.4 仅支持快速食用标志，不支持精确秒数）');
        }
        if (config.foodEffects && config.foodEffects.length > 0) {
            unsupported.push('食用后触发效果（1.20.4 不支持食物效果）');
        }
        if (config.toolEnabled) {
            unsupported.push('工具规则（1.20.4 不支持 tool 组件）');
        }
        if (config.maxStack !== null) {
            unsupported.push('自定义最大堆叠（1.20.4 不支持 max_stack_size 标签）');
        }
        if (config.attributes && config.attributes.length > 0) {
            unsupported.push('属性修饰符（attribute_modifiers）在此版本不可用，已忽略。1.20.2-1.20.4 无法正常工作，1.20.5-1.20.6 会覆盖物品默认属性');
        }
    }
    // 1.20.5 / 1.20.6 单独检查属性
    if (version === '1.20.5' || version === '1.20.6') {
        if (config.attributes && config.attributes.length > 0) {
            unsupported.push('属性修饰符（attribute_modifiers）在此版本不可用，已忽略。1.20.2-1.20.4 无法正常工作，1.20.5-1.20.6 会覆盖物品默认属性');
        }
    }
    return unsupported;
}

export function setupGenerate(
    generateBtn,
    versionSelect,
    targetSelect,
    targetManual,
    itemSearch,
    countInput,
    damageInput,
    unbreakableCheck,
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
    toolEnabled,
    toolDefaultSpeed,
    toolDamagePerBlock,
    resultBox,
    lengthWarning
) {
    if (!generateBtn) return;

    generateBtn.addEventListener('click', () => {
        const version = versionSelect ? versionSelect.value : '1.21';
        let targets = targetManual ? targetManual.value.trim() : '';
        if (!targets && targetSelect) {
            targets = targetSelect.value;
        }
        const item = itemSearch ? itemSearch.value.trim() : '';
        const count = countInput ? parseInt(countInput.value) || 1 : 1;
        const remainingDurability = damageInput ? parseInt(damageInput.value) || 0 : 0;
        const unbreakable = unbreakableCheck ? unbreakableCheck.checked : false;
        const glint = glintCheck ? glintCheck.checked : false;
        const rarity = raritySelect ? raritySelect.value : '';
        const maxDamage = maxDamageInput ? parseInt(maxDamageInput.value) || null : null;
        const maxStack = maxStackInput ? parseInt(maxStackInput.value) || null : null;
        const repairCost = repairCostInput ? parseInt(repairCostInput.value) || null : null;

        const nutrition = foodNutrition && foodNutrition.value.trim() !== '' ? parseInt(foodNutrition.value) : null;
        const saturation = foodSaturation && foodSaturation.value.trim() !== '' ? parseFloat(foodSaturation.value) : null;
        const canAlwaysEat = foodCanAlwaysEat ? foodCanAlwaysEat.checked : false;
        const eatSeconds = foodEatSeconds && foodEatSeconds.value.trim() !== '' ? parseFloat(foodEatSeconds.value) : null;

        const clearEffects = foodClearEffects ? foodClearEffects.checked : false;
        const useCooldownSeconds = foodUseCooldown && foodUseCooldown.value.trim() !== '' ? parseFloat(foodUseCooldown.value) : null;

        const foodEffects = getFoodEffects();
        const toolRules = getToolRules();

        if (!item) {
            if (resultBox) resultBox.innerHTML = '<span class="error">❌ 请选择或输入物品ID</span>';
            if (lengthWarning) lengthWarning.style.display = 'none';
            return;
        }

        const { damage, error } = calculateDamage(item, remainingDurability, unbreakable, maxDamage);
        if (error) {
            if (resultBox) resultBox.innerHTML = `<span class="error">❌ ${error}</span>`;
            if (lengthWarning) lengthWarning.style.display = 'none';
            return;
        }

        const displayNameInput = document.getElementById('displayNameInput');
        const itemNameInput = document.getElementById('itemNameInput');
        const loreInput = document.getElementById('loreInput');

        const displayName = displayNameInput?.value.trim() || null;
        const itemName = itemNameInput?.value.trim() || null;
        const lore = loreInput?.value.trim() || null;

        const displayStyle = getFieldStyle(displayNameInput);
        const itemNameStyle = getFieldStyle(itemNameInput);
        const loreStyle = getFieldStyle(loreInput);

        const enchants = getEnchantments();
        const attributes = getAttributes();
        const blocks = getBlocks();

        const toolEnabledChecked = toolEnabled ? toolEnabled.checked : false;
        const toolDefaultSpeedVal = toolDefaultSpeed && toolDefaultSpeed.value.trim() !== '' ? parseFloat(toolDefaultSpeed.value) : null;
        const toolDamagePerBlockVal = toolDamagePerBlock && toolDamagePerBlock.value.trim() !== '' ? parseInt(toolDamagePerBlock.value) : null;

        const config = {
            targets,
            item,
            count,
            displayName,
            displayStyle,
            itemName,
            itemNameStyle,
            lore,
            loreStyle,
            enchants: [...enchants],
            damage,
            unbreakable,
            glint,
            attributes: [...attributes],
            blocks: [...blocks],
            rarity: rarity || null,
            maxDamage: maxDamage,
            maxStack: maxStack,
            repairCost: repairCost,
            nutrition: nutrition,
            saturation: saturation,
            canAlwaysEat: canAlwaysEat,
            eatSeconds: eatSeconds,
            clearEffects: clearEffects,
            useCooldownSeconds: useCooldownSeconds,
            foodEffects: [...foodEffects],
            toolEnabled: toolEnabledChecked,
            toolDefaultSpeed: toolDefaultSpeedVal,
            toolDamagePerBlock: toolDamagePerBlockVal,
            toolRules: [...toolRules],
        };

        try {
            const command = generateGive(version, config);

            // ---------- 记录到历史（附带完整 config 以便生成描述） ----------
            addToHistory(command, config);

            const unsupported = getUnsupportedFeatures(version, config);
            let displayHtml = command;
            if (unsupported.length > 0) {
                const warnHtml = `<div style="color:#e6a800;font-size:13px;margin-top:6px;padding:6px 10px;background:#2a1a00;border-radius:6px;border:1px solid #b8860b;">
                    ⚠️ 注意：您选择的游戏版本不支持以下功能，这些设置已被忽略：<br>
                    ${unsupported.map(f => `• ${f}`).join('<br>')}
                </div>`;
                displayHtml = command + warnHtml;
            }
            if (resultBox) resultBox.innerHTML = displayHtml;
            if (lengthWarning) {
                if (command.length > 256) {
                    lengthWarning.style.display = 'inline';
                } else {
                    lengthWarning.style.display = 'none';
                }
            }
        } catch (err) {
            if (resultBox) resultBox.innerHTML = `<span class="error">❌ ${err.message}</span>`;
            if (lengthWarning) lengthWarning.style.display = 'none';
        }
    });
}
