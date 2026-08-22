// ============================================================
// 1.20.2-1.20.4 NBT 格式构建 (旧版 NBT 标签)
// ============================================================

/**
 * 构建 NBT 字符串（1.20.2-1.20.4）
 * 支持的标签：
 * - Enchantments: [{id:"sharpness",lvl:5}]
 * - display: {Name:'{"text":"名称"}', Lore:['{"text":"描述1"}','{"text":"描述2"}']}
 * - AttributeModifiers: [{AttributeName:"generic.attack_damage",Name:"generic.attack_damage",Amount:10,Operation:0,UUID:[I;1,2,3,4]}]
 * - FoodComponents: {hunger:4,saturation:0.6,alwaysEdible:1b,fast:1b} (仅对食物类物品有效)
 * - CustomPotionEffects: [{Id:1,Amplifier:0,Duration:200}] (仅对药水类物品有效)
 * - CanDestroy: ["stone","grass_block"]
 * - CanPlaceOn: ["stone"]
 * - HideFlags: 1 (隐藏附魔文本等，但不能隐藏光效本身)
 * - Unbreakable: 1b
 * - Damage: 1000 (已损耗耐久)
 * - RepairCost: 5 (铁砧修复消耗)
 * - Rarity: "epic" (稀有度)
 *
 * 注意：1.20.4 不支持 enchantment_glint_override，光效无法隐藏。
 *       FoodComponents 仅对食物类物品有效，非食物无效。
 *       不存在 tool 组件、consumable 组件。
 *       1.20.4 不支持 MaxDamage 标签，即使写入也不会生效，因此忽略。
 */
export function buildNBT_1_20_4(
    displayName, displayStyle, itemName, itemNameStyle,
    lore, loreStyle, enchants, damage, unbreakable,
    attributes, blocks, rarity, maxDamage, repairCost,
    nutrition, saturation, canAlwaysEat, eatSeconds,
    foodEffects,
    toolEnabled, toolDefaultSpeed, toolDamagePerBlock, toolRules
) {
    const nbtParts = [];

    // ----- 附魔 Enchantments -----
    if (enchants.length > 0) {
        const enchantList = enchants.map(e => {
            let id = e.id.replace(/^"|"$/g, '');
            if (id.startsWith('minecraft:')) {
                id = id.substring('minecraft:'.length);
            }
            return `{id:"${id}",lvl:${e.level}}`;
        }).join(',');
        nbtParts.push(`Enchantments:[${enchantList}]`);
    }

    // ----- 显示 display (名称 + Lore) -----
    const displayParts = [];
    if (displayName) {
        const jsonObj = { text: displayName };
        if (displayStyle.bold) jsonObj.bold = true;
        if (displayStyle.italic) jsonObj.italic = true;
        if (displayStyle.underline) jsonObj.underlined = true;
        if (displayStyle.strikethrough) jsonObj.strikethrough = true;
        if (displayStyle.obfuscated) jsonObj.obfuscated = true;
        if (displayStyle.color && displayStyle.color !== 'white') {
            jsonObj.color = displayStyle.color;
        }
        const jsonStr = JSON.stringify(jsonObj);
        displayParts.push(`Name:'${jsonStr}'`);
    }

    // Lore: 将 itemName 和 lore 合并为 Lore 列表
    const loreList = [];
    if (itemName) {
        const jsonObj = { text: itemName };
        if (itemNameStyle.bold) jsonObj.bold = true;
        if (itemNameStyle.italic) jsonObj.italic = true;
        if (itemNameStyle.underline) jsonObj.underlined = true;
        if (itemNameStyle.strikethrough) jsonObj.strikethrough = true;
        if (itemNameStyle.obfuscated) jsonObj.obfuscated = true;
        if (itemNameStyle.color && itemNameStyle.color !== 'white') {
            jsonObj.color = itemNameStyle.color;
        }
        loreList.push(`'${JSON.stringify(jsonObj)}'`);
    }
    if (lore) {
        const jsonObj = { text: lore };
        if (loreStyle.bold) jsonObj.bold = true;
        if (loreStyle.italic) jsonObj.italic = true;
        if (loreStyle.underline) jsonObj.underlined = true;
        if (loreStyle.strikethrough) jsonObj.strikethrough = true;
        if (loreStyle.obfuscated) jsonObj.obfuscated = true;
        if (loreStyle.color && loreStyle.color !== 'white') {
            jsonObj.color = loreStyle.color;
        }
        loreList.push(`'${JSON.stringify(jsonObj)}'`);
    }
    if (loreList.length > 0) {
        displayParts.push(`Lore:[${loreList.join(',')}]`);
    }

    if (displayParts.length > 0) {
        nbtParts.push(`display:{${displayParts.join(',')}}`);
    }

    // ----- 属性修改器 AttributeModifiers -----
    // 1.20.2-1.20.4 不支持属性修饰符（实测 AttributeModifiers 标签无法正常工作），已禁用
    // if (attributes && attributes.length > 0) {
    //     const attrList = attributes.map((attr, index) => {
    //         const uuid = `[I;${index+1},${Date.now() % 100000},${Math.floor(Math.random()*100000)},${Math.floor(Math.random()*100000)}]`;
    //         let attrName = attr.type || '';
    //         if (!attrName.startsWith('generic.')) {
    //             attrName = `generic.${attrName}`;
    //         }
    //         const amount = attr.amount;
    //         const operation = attr.operation || 0;
    //         return `{AttributeName:"${attrName}",Name:"${attrName}",Amount:${amount},Operation:${operation},UUID:${uuid}}`;
    //     }).join(',');
    //     nbtParts.push(`AttributeModifiers:[${attrList}]`);
    // }


    // ----- 耐久度、无法破坏、修复消耗 -----
    if (damage !== 0) nbtParts.push(`Damage:${damage}`);
    if (unbreakable) nbtParts.push(`Unbreakable:1b`);
    // 1.20.2-1.20.4 不支持 MaxDamage 标签，即使写入也不生效，因此忽略
    // if (maxDamage !== null && maxDamage > 0) nbtParts.push(`MaxDamage:${maxDamage}`);
    if (repairCost !== null && repairCost >= 0) nbtParts.push(`RepairCost:${repairCost}`);

    // ----- 稀有度 -----
    if (rarity) nbtParts.push(`Rarity:"${rarity}"`);

    // ----- 食物组件 FoodComponents -----
    const hasFoodData = nutrition !== null || saturation !== null || canAlwaysEat || eatSeconds !== null || (foodEffects && foodEffects.length > 0);
    if (hasFoodData) {
        let foodObj = {};
        if (nutrition !== null) foodObj.hunger = nutrition;
        if (saturation !== null) foodObj.saturation = saturation;
        if (canAlwaysEat) foodObj.alwaysEdible = '1b';
        if (eatSeconds !== null) {
            foodObj.fast = eatSeconds < 1.6 ? '1b' : '0b';
        }
        const foodSnbt = Object.entries(foodObj).map(([k, v]) => `${k}:${v}`).join(',');
        nbtParts.push(`FoodComponents:{${foodSnbt}}`);
    }

    // ----- 方块交互 CanDestroy / CanPlaceOn -----
    if (blocks && blocks.length > 0) {
        const placeBlocks = blocks.filter(b => b.type === 'place' || b.type === 'both').map(b => {
            let id = b.blockId;
            if (id.startsWith('minecraft:')) id = id.substring('minecraft:'.length);
            return `"${id}"`;
        });
        const breakBlocks = blocks.filter(b => b.type === 'break' || b.type === 'both').map(b => {
            let id = b.blockId;
            if (id.startsWith('minecraft:')) id = id.substring('minecraft:'.length);
            return `"${id}"`;
        });
        if (placeBlocks.length > 0) {
            nbtParts.push(`CanPlaceOn:[${placeBlocks.join(',')}]`);
        }
        if (breakBlocks.length > 0) {
            nbtParts.push(`CanDestroy:[${breakBlocks.join(',')}]`);
        }
    }

    // ----- 工具规则 tool (1.20.4 不支持) -----
    // 忽略 toolEnabled 等

    return nbtParts.length ? `{${nbtParts.join(',')}}` : '';
}