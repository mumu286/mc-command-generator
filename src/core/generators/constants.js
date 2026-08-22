// ============================================================
// 常量：不可堆叠物品列表
// ============================================================

export const UNSTACKABLE_ITEMS = [
    // 下界合金工具
    'minecraft:netherite_sword', 'minecraft:netherite_pickaxe', 'minecraft:netherite_axe',
    'minecraft:netherite_shovel', 'minecraft:netherite_hoe',
    // 钻石工具
    'minecraft:diamond_sword', 'minecraft:diamond_pickaxe', 'minecraft:diamond_axe',
    'minecraft:diamond_shovel', 'minecraft:diamond_hoe',
    // 铁工具
    'minecraft:iron_sword', 'minecraft:iron_pickaxe', 'minecraft:iron_axe',
    'minecraft:iron_shovel', 'minecraft:iron_hoe',
    // 石工具
    'minecraft:stone_sword', 'minecraft:stone_pickaxe', 'minecraft:stone_axe',
    'minecraft:stone_shovel', 'minecraft:stone_hoe',
    // 木工具
    'minecraft:wooden_sword', 'minecraft:wooden_pickaxe', 'minecraft:wooden_axe',
    'minecraft:wooden_shovel', 'minecraft:wooden_hoe',
    // 金工具
    'minecraft:golden_sword', 'minecraft:golden_pickaxe', 'minecraft:golden_axe',
    'minecraft:golden_shovel', 'minecraft:golden_hoe',
    // 下界合金装备
    'minecraft:netherite_helmet', 'minecraft:netherite_chestplate',
    'minecraft:netherite_leggings', 'minecraft:netherite_boots',
    // 钻石装备
    'minecraft:diamond_helmet', 'minecraft:diamond_chestplate',
    'minecraft:diamond_leggings', 'minecraft:diamond_boots',
    // 铁装备
    'minecraft:iron_helmet', 'minecraft:iron_chestplate',
    'minecraft:iron_leggings', 'minecraft:iron_boots',
    // 锁链装备
    'minecraft:chainmail_helmet', 'minecraft:chainmail_chestplate',
    'minecraft:chainmail_leggings', 'minecraft:chainmail_boots',
    // 金装备
    'minecraft:golden_helmet', 'minecraft:golden_chestplate',
    'minecraft:golden_leggings', 'minecraft:golden_boots',
    // 皮革装备
    'minecraft:leather_helmet', 'minecraft:leather_chestplate',
    'minecraft:leather_leggings', 'minecraft:leather_boots',
    'minecraft:turtle_helmet',
    // 其他工具/武器
    'minecraft:bow', 'minecraft:crossbow', 'minecraft:trident',
    'minecraft:shield', 'minecraft:elytra',
    'minecraft:fishing_rod', 'minecraft:carrot_on_a_stick',
    'minecraft:warped_fungus_on_a_stick', 'minecraft:brush',
    'minecraft:flint_and_steel', 'minecraft:shears',
    'minecraft:debug_stick', 'minecraft:knowledge_book',
    'minecraft:enchanted_book',
    'minecraft:totem_of_undying',
    'minecraft:spyglass',
    // 药水
    'minecraft:potion', 'minecraft:splash_potion', 'minecraft:lingering_potion',
    // 其他
    'minecraft:armor_stand',
    'minecraft:compass', 'minecraft:recovery_compass',
    'minecraft:clock',
    'minecraft:filled_map', 'minecraft:map',
];

export function isUnstackable(itemId) {
    return UNSTACKABLE_ITEMS.includes(itemId);
}