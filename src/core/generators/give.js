// ============================================================
// 主生成函数 (支持所有版本)
// ============================================================

import { buildNBT_1_20_4 } from './nbt.js';
import { buildComponents_1_20_5_6, buildComponents_1_21, buildComponents_1_21_1, buildComponents_1_21_2, buildComponents_1_21_3, buildComponents_1_21_4, buildComponents_1_21_5 } from './components.js';
import { isUnstackable } from './constants.js';

// 使用旧版 NBT 格式的版本列表
const NBT_VERSIONS = ['1.20.2', '1.20.3', '1.20.4'];

const NEW_COMPONENT_VERSIONS = ['1.21.5', '1.21.6', '1.21.7', '1.21.8', '1.21.9', '1.21.10', '1.21.11', '26.1', '26.2'];

function getDefaultTarget(version) {
    if (version === '1.21.1') return '@p';
    return '@s';
}

export function generateGive(version, config) {
    const {
        targets: inputTargets,
        item,
        count = 1,
        displayName = null,
        displayStyle = {},
        itemName = null,
        itemNameStyle = {},
        lore = null,
        loreStyle = {},
        enchants = [],
        damage = 0,
        unbreakable = false,
        glint = false,
        attributes = [],
        blocks = [],
        rarity = null,
        maxDamage = null,
        maxStack = null,
        repairCost = null,
        nutrition = null,
        saturation = null,
        canAlwaysEat = false,
        eatSeconds = null,
        foodEffects = [],
        clearEffects = false,
        useCooldownSeconds = null,
        toolEnabled = false,
        toolDefaultSpeed = null,
        toolDamagePerBlock = null,
        toolRules = [],
        
    } = config;

    if (!item) return '❌ 请选择物品';

    const targets = inputTargets || getDefaultTarget(version);

    // 校验
    if (maxStack !== null && maxStack !== undefined) {
        if (maxStack < 1 || maxStack > 99) {
            return '❌ 最大堆叠必须在 1 ~ 99 之间';
        }
        if (isUnstackable(item) && maxStack > 1) {
            return `❌ 物品 "${item}" 不可堆叠，最大堆叠只能为 1（当前为 ${maxStack}）`;
        }
    }

    if (maxDamage !== null && maxDamage !== undefined) {
        if (maxDamage < 1 || maxDamage > 2147483647) {
            return '❌ 最大耐久必须在 1 ~ 2147483647 之间';
        }
    }

    if (repairCost !== null && repairCost !== undefined) {
        if (repairCost < 0 || repairCost > 2147483647) {
            return '❌ 修复消耗必须在 0 ~ 2147483647 之间';
        }
    }

    let command = `/give ${targets} ${item}`;
    let itemData = '';

    // ----- 版本路由 -----
    if (NBT_VERSIONS.includes(version)) {
        // 1.20.2 ~ 1.20.4：旧版 NBT 格式
        itemData = buildNBT_1_20_4(
            displayName, displayStyle, itemName, itemNameStyle,
            lore, loreStyle, enchants, damage, unbreakable,
            attributes, blocks, rarity, maxDamage, repairCost,
            nutrition, saturation, canAlwaysEat, eatSeconds,
            foodEffects, clearEffects, useCooldownSeconds,
            toolEnabled, toolDefaultSpeed, toolDamagePerBlock, toolRules
        );
    } else if (version === '1.20.5' || version === '1.20.6') {
        let effectiveMaxStack = maxStack;
        if (isUnstackable(item) && maxStack === 1) effectiveMaxStack = null;
        itemData = buildComponents_1_20_5_6(
            displayName, displayStyle, itemName, itemNameStyle,
            lore, loreStyle, enchants, damage, unbreakable,
            glint, attributes, blocks, rarity, maxDamage, effectiveMaxStack, repairCost,
            nutrition, saturation, canAlwaysEat, null, [],
            clearEffects, useCooldownSeconds,
            toolEnabled, toolDefaultSpeed, toolDamagePerBlock, toolRules
        );
    } else if (version === '1.21.1') {
        let effectiveMaxStack = maxStack;
        if (isUnstackable(item) && maxStack === 1) effectiveMaxStack = null;
        itemData = buildComponents_1_21_1(
            displayName, displayStyle, itemName, itemNameStyle,
            lore, loreStyle, enchants, damage, unbreakable,
            glint, attributes, blocks, rarity, maxDamage, effectiveMaxStack, repairCost,
            nutrition, saturation, canAlwaysEat, eatSeconds,
            foodEffects,
            toolEnabled, toolDefaultSpeed, toolDamagePerBlock, toolRules
        );
    } else if (version === '1.21.2') {
        let effectiveMaxStack = maxStack;
        if (isUnstackable(item) && maxStack === 1) effectiveMaxStack = null;
        itemData = buildComponents_1_21_2(
            displayName, displayStyle, itemName, itemNameStyle,
            lore, loreStyle, enchants, damage, unbreakable,
            glint, attributes, blocks, rarity, maxDamage, effectiveMaxStack, repairCost,
            nutrition, saturation, canAlwaysEat, eatSeconds,
            foodEffects,
            clearEffects, useCooldownSeconds,
            toolEnabled, toolDefaultSpeed, toolDamagePerBlock, toolRules
        );
    } else if (version === '1.21.3') {
        let effectiveMaxStack = maxStack;
        if (isUnstackable(item) && maxStack === 1) effectiveMaxStack = null;
        itemData = buildComponents_1_21_3(
            displayName, displayStyle, itemName, itemNameStyle,
            lore, loreStyle, enchants, damage, unbreakable,
            glint, attributes, blocks, rarity, maxDamage, effectiveMaxStack, repairCost,
            nutrition, saturation, canAlwaysEat, eatSeconds,
            foodEffects,
            clearEffects, useCooldownSeconds,
            toolEnabled, toolDefaultSpeed, toolDamagePerBlock, toolRules
        );
    } else if (version === '1.21.4') {
        let effectiveMaxStack = maxStack;
        if (isUnstackable(item) && maxStack === 1) effectiveMaxStack = null;
        itemData = buildComponents_1_21_4(
            displayName, displayStyle, itemName, itemNameStyle,
            lore, loreStyle, enchants, damage, unbreakable,
            glint, attributes, blocks, rarity, maxDamage, effectiveMaxStack, repairCost,
            nutrition, saturation, canAlwaysEat, eatSeconds,
            foodEffects,
            clearEffects, useCooldownSeconds,
            toolEnabled, toolDefaultSpeed, toolDamagePerBlock, toolRules
        );
    } else if (NEW_COMPONENT_VERSIONS.includes(version)) {
        let effectiveMaxStack = maxStack;
        if (isUnstackable(item) && maxStack === 1) effectiveMaxStack = null;
        itemData = buildComponents_1_21_5(
            displayName, displayStyle, itemName, itemNameStyle,
            lore, loreStyle, enchants, damage, unbreakable,
            glint, attributes, blocks, rarity, maxDamage, effectiveMaxStack, repairCost,
            nutrition, saturation, canAlwaysEat, eatSeconds,
            foodEffects,
            clearEffects, useCooldownSeconds,
            toolEnabled, toolDefaultSpeed, toolDamagePerBlock, toolRules
        );
    } else {
        // 默认 1.21
        let effectiveMaxStack = maxStack;
        if (isUnstackable(item) && maxStack === 1) effectiveMaxStack = null;
        itemData = buildComponents_1_21(
            displayName, displayStyle, itemName, itemNameStyle,
            lore, loreStyle, enchants, damage, unbreakable,
            glint, attributes, blocks, rarity, maxDamage, effectiveMaxStack, repairCost,
            nutrition, saturation, canAlwaysEat, eatSeconds,
            foodEffects,
            toolEnabled, toolDefaultSpeed, toolDamagePerBlock, toolRules
        );
    }

    if (itemData) command += itemData;
    if (count > 1) command += ` ${count}`;

    return command;
}
