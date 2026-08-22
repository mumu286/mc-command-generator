// ============================================================
// 物品最大耐久度映射表 + 计算函数
// ============================================================

export const MAX_DURABILITY = {
    // 工具
    'minecraft:netherite_pickaxe': 2031,
    'minecraft:netherite_axe': 2031,
    'minecraft:netherite_shovel': 2031,
    'minecraft:netherite_hoe': 2031,
    'minecraft:netherite_sword': 2031,
    'minecraft:diamond_pickaxe': 1561,
    'minecraft:diamond_axe': 1561,
    'minecraft:diamond_shovel': 1561,
    'minecraft:diamond_hoe': 1561,
    'minecraft:diamond_sword': 1561,
    'minecraft:iron_pickaxe': 250,
    'minecraft:iron_axe': 250,
    'minecraft:iron_shovel': 250,
    'minecraft:iron_hoe': 250,
    'minecraft:iron_sword': 250,
    'minecraft:stone_pickaxe': 131,
    'minecraft:stone_axe': 131,
    'minecraft:stone_shovel': 131,
    'minecraft:stone_hoe': 131,
    'minecraft:stone_sword': 131,
    'minecraft:wooden_pickaxe': 59,
    'minecraft:wooden_axe': 59,
    'minecraft:wooden_shovel': 59,
    'minecraft:wooden_hoe': 59,
    'minecraft:wooden_sword': 59,
    'minecraft:golden_pickaxe': 32,
    'minecraft:golden_axe': 32,
    'minecraft:golden_shovel': 32,
    'minecraft:golden_hoe': 32,
    'minecraft:golden_sword': 32,
    // 装备
    'minecraft:netherite_helmet': 407,
    'minecraft:netherite_chestplate': 592,
    'minecraft:netherite_leggings': 555,
    'minecraft:netherite_boots': 481,
    'minecraft:diamond_helmet': 363,
    'minecraft:diamond_chestplate': 528,
    'minecraft:diamond_leggings': 495,
    'minecraft:diamond_boots': 429,
    'minecraft:iron_helmet': 165,
    'minecraft:iron_chestplate': 240,
    'minecraft:iron_leggings': 225,
    'minecraft:iron_boots': 195,
    'minecraft:chainmail_helmet': 165,
    'minecraft:chainmail_chestplate': 240,
    'minecraft:chainmail_leggings': 225,
    'minecraft:chainmail_boots': 195,
    'minecraft:golden_helmet': 77,
    'minecraft:golden_chestplate': 112,
    'minecraft:golden_leggings': 105,
    'minecraft:golden_boots': 91,
    'minecraft:leather_helmet': 55,
    'minecraft:leather_chestplate': 80,
    'minecraft:leather_leggings': 75,
    'minecraft:leather_boots': 65,
    'minecraft:turtle_helmet': 275,
    // 其他工具
    'minecraft:bow': 384,
    'minecraft:crossbow': 326,
    'minecraft:trident': 250,
    'minecraft:shield': 336,
    'minecraft:elytra': 432,
    'minecraft:fishing_rod': 64,
    'minecraft:carrot_on_a_stick': 25,
    'minecraft:warped_fungus_on_a_stick': 100,
    'minecraft:brush': 64,
    'minecraft:flint_and_steel': 64,
    'minecraft:shears': 238,
};

/**
 * 计算已消耗耐久度
 * @param {string} item - 物品ID
 * @param {number} remaining - 用户输入的剩余耐久度
 * @param {boolean} unbreakable - 是否勾选无法破坏
 * @param {number|null} customMaxDurability - 用户自定义最大耐久
 * @returns {{ damage: number, error: string|null }}
 */
export function calculateDamage(item, remaining, unbreakable, customMaxDurability) {
    if (unbreakable) {
        return { damage: 0, error: null };
    }

    if (remaining < 0) {
        return { damage: 0, error: '耐久度不能为负数' };
    }

    if (remaining === 0) {
        return { damage: 0, error: null };
    }

    // 优先使用自定义最大耐久，否则使用映射表
    let maxDura = customMaxDurability;
    if (!maxDura) {
        maxDura = MAX_DURABILITY[item];
    }
    if (!maxDura) {
        return { damage: 0, error: '该物品没有耐久度' };
    }

    if (remaining > maxDura) {
        return { damage: 0, error: `剩余耐久度不能超过最大耐久度 (${maxDura})` };
    }

    return { damage: maxDura - remaining, error: null };
}