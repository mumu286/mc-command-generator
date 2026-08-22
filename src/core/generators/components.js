// ============================================================
// 所有版本组件格式构建（1.20.5-1.20.6, 1.21, 1.21.1, 1.21.2, 1.21.3）
// ============================================================

import { buildTextComponentArray } from './utils.js';

// ========== 辅助函数 ==========

function buildTextComponentSingle(text, style) {
    if (!text) return null;
    const obj = { text };
    if (style.bold) obj.bold = true;
    if (style.italic) obj.italic = true;
    if (style.underline) obj.underlined = true;
    if (style.strikethrough) obj.strikethrough = true;
    if (style.obfuscated) obj.obfuscated = true;
    if (style.color && style.color !== 'white') {
        obj.color = style.color;
    }
    return JSON.stringify(obj);
}

function buildLoreSingle(itemName, itemNameStyle, lore, loreStyle) {
    const items = [];
    if (itemName) {
        const obj = { text: itemName };
        if (itemNameStyle.bold) obj.bold = true;
        if (itemNameStyle.italic) obj.italic = true;
        if (itemNameStyle.underline) obj.underlined = true;
        if (itemNameStyle.strikethrough) obj.strikethrough = true;
        if (itemNameStyle.obfuscated) obj.obfuscated = true;
        if (itemNameStyle.color && itemNameStyle.color !== 'white') obj.color = itemNameStyle.color;
        items.push(JSON.stringify(obj));
    }
    if (lore) {
        const obj = { text: lore };
        if (loreStyle.bold) obj.bold = true;
        if (loreStyle.italic) obj.italic = true;
        if (loreStyle.underline) obj.underlined = true;
        if (loreStyle.strikethrough) obj.strikethrough = true;
        if (loreStyle.obfuscated) obj.obfuscated = true;
        if (loreStyle.color && loreStyle.color !== 'white') obj.color = loreStyle.color;
        items.push(JSON.stringify(obj));
    }
    return items.length > 0 ? `[${items.join(',')}]` : null;
}

// ========== 1.20.5-1.20.6 ==========

export function buildComponents_1_20_5_6(
    displayName, displayStyle, itemName, itemNameStyle,
    lore, loreStyle, enchants, damage, unbreakable,
    glint, attributes, blocks, rarity, maxDamage, maxStack, repairCost,
    nutrition, saturation, canAlwaysEat, eatSeconds,
    foodEffects, clearEffects, useCooldownSeconds,
    toolEnabled, toolDefaultSpeed, toolDamagePerBlock, toolRules
) {
    const components = [];

    if (displayName) {
        components.push(`custom_name='${buildTextComponentSingle(displayName, displayStyle)}'`);
    }
    if (itemName) {
        components.push(`item_name='${buildTextComponentSingle(itemName, itemNameStyle)}'`);
    }
    if (itemName || lore) {
        const loreStr = buildLoreSingle(itemName, itemNameStyle, lore, loreStyle);
        if (loreStr) components.push(`lore=${loreStr}`);
    }

    if (enchants.length > 0) {
        const enchantObj = enchants.map(e => {
            let id = e.id.replace(/^"|"$/g, '');
            if (id.startsWith('minecraft:')) id = id.substring('minecraft:'.length);
            return `${id}:${e.level}`;
        }).join(',');
        components.push(`enchantments={${enchantObj}}`);
    }

    if (damage !== 0) components.push(`damage=${damage}`);
    if (unbreakable) components.push(`unbreakable={}`);
    components.push(`enchantment_glint_override=${glint}`);

    if (rarity) components.push(`rarity="${rarity}"`);

    if (maxDamage !== null && maxDamage > 0) components.push(`max_damage=${maxDamage}`);
    if (maxStack !== null && maxStack > 0 && maxStack <= 99) components.push(`max_stack_size=${maxStack}`);
    if (repairCost !== null && repairCost >= 0) components.push(`repair_cost=${repairCost}`);

    const hasFoodData = nutrition !== null || saturation !== null || canAlwaysEat;
    if (hasFoodData) {
        let foodObj = {};
        if (nutrition !== null) foodObj.nutrition = nutrition;
        if (saturation !== null) foodObj.saturation = saturation;
        if (canAlwaysEat) foodObj.can_always_eat = '1b';
        const foodSnbt = Object.entries(foodObj).map(([k, v]) => {
            if (k === 'can_always_eat') return `${k}:${v}`;
            return `${k}:${v}`;
        }).join(',');
        components.push(`food={${foodSnbt}}`);
    }

    if (toolEnabled) {
        let toolObj = {};
        if (toolDefaultSpeed !== null && toolDefaultSpeed >= 0) toolObj.default_mining_speed = toolDefaultSpeed;
        if (toolDamagePerBlock !== null && toolDamagePerBlock >= 0) toolObj.damage_per_block = toolDamagePerBlock;
        if (toolRules && toolRules.length > 0) {
            const rules = toolRules.map(rule => {
                let blockId = rule.blockId || '';
                if (blockId.startsWith('minecraft:')) blockId = blockId.substring('minecraft:'.length);
                blockId = blockId.replace(/^"|"$/g, '');
                return `{blocks:[${blockId}],speed:${rule.speed}f}`;
            }).join(',');
            toolObj.rules = `[${rules}]`;
        }
        const toolSnbt = Object.entries(toolObj).map(([k, v]) => {
            if (k === 'rules') return `${k}:${v}`;
            return `${k}:${v}`;
        }).join(',');
        if (Object.keys(toolObj).length > 0) components.push(`tool={${toolSnbt}}`);
    }

    if (blocks && blocks.length > 0) {
        const placeBlocks = blocks.filter(b => b.type === 'place' || b.type === 'both').map(b => b.blockId);
        const breakBlocks = blocks.filter(b => b.type === 'break' || b.type === 'both').map(b => b.blockId);
        if (placeBlocks.length > 0) {
            components.push(`can_place_on={predicates:[${placeBlocks.map(id => `{blocks:"${id}"}`).join(',')}]}`);
        }
        if (breakBlocks.length > 0) {
            components.push(`can_break={predicates:[${breakBlocks.map(id => `{blocks:"${id}"}`).join(',')}]}`);
        }
    }

    // 1.20.5-1.20.6 不支持属性修饰符（attribute_modifiers 组件会覆盖物品默认属性，而非追加），已禁用
    // if (attributes && attributes.length > 0) {
    //     const modifiers = attributes.map((attr, index) => {
    //         let type = attr.type || '';
    //         if (type.startsWith('minecraft:')) type = type.substring('minecraft:'.length);
    //         type = type.replace(/^"|"$/g, '');
    //         let slot = attr.slot || 'any';
    //         slot = slot.replace(/^"|"$/g, '');
    //         return `{id:custom_${Date.now()}_${index},type:${type},amount:${attr.amount},operation:"add_value",slot:${slot}}`;
    //     }).join(',');
    //     components.push(`attribute_modifiers=[${modifiers}]`);
    // }


    return components.length ? `[${components.join(',')}]` : '';
}

// ========== 1.21 ==========

export function buildComponents_1_21(
    displayName, displayStyle, itemName, itemNameStyle,
    lore, loreStyle, enchants, damage, unbreakable,
    glint, attributes, blocks, rarity, maxDamage, maxStack, repairCost,
    nutrition, saturation, canAlwaysEat, eatSeconds,
    foodEffects,
    toolEnabled, toolDefaultSpeed, toolDamagePerBlock, toolRules
) {
    const components = [];

    if (displayName) {
        const jsonArr = buildTextComponentArray(displayName, displayStyle);
        components.push(`custom_name='${jsonArr}'`);
    }
    if (itemName) {
        const jsonArr = buildTextComponentArray(itemName, itemNameStyle);
        components.push(`item_name='${jsonArr}'`);
    }
    if (lore) {
        const jsonArr = buildTextComponentArray(lore, loreStyle);
        components.push(`lore=['${jsonArr}']`);
    }

    if (enchants.length > 0) {
        const enchantObj = enchants.map(e => {
            const id = e.id.startsWith('minecraft:') ? e.id : `minecraft:${e.id}`;
            return `"${id}":${e.level}`;
        }).join(',');
        components.push(`enchantments={levels:{${enchantObj}}}`);
    }

    if (damage !== 0) components.push(`damage=${damage}`);
    if (unbreakable) components.push(`unbreakable={}`);
    components.push(`enchantment_glint_override=${glint}`);

    if (rarity) components.push(`rarity="${rarity}"`);

    if (maxDamage !== null && maxDamage > 0) components.push(`max_damage=${maxDamage}`);
    if (maxStack !== null && maxStack > 0 && maxStack <= 99) components.push(`max_stack_size=${maxStack}`);
    if (repairCost !== null && repairCost >= 0) components.push(`repair_cost=${repairCost}`);

    const hasFoodData = nutrition !== null || saturation !== null || canAlwaysEat || eatSeconds !== null || (foodEffects && foodEffects.length > 0);
    if (hasFoodData) {
        let foodObj = {};
        if (nutrition !== null) foodObj.nutrition = nutrition;
        if (saturation !== null) foodObj.saturation = saturation;
        if (canAlwaysEat) foodObj.can_always_eat = true;
        if (eatSeconds !== null) foodObj.eat_seconds = eatSeconds;
        if (foodEffects && foodEffects.length > 0) {
            const effectEntries = foodEffects.map(eff => {
                if (eff.type === 'effect') {
                    const effectId = (eff.effectId || 'speed').startsWith('minecraft:') ? eff.effectId : `minecraft:${eff.effectId || 'speed'}`;
                    return `{effect:{id:"${effectId}",duration:${eff.duration || 60},amplifier:${eff.amplifier || 0}},probability:1.0}`;
                } else if (eff.type === 'teleport') {
                    return `{effect:{id:"custom:teleport",diameter:${eff.diameter || 10}},probability:${eff.probability || 1.0}}`;
                } else if (eff.type === 'clear') {
                    return `{effect:{id:"custom:clear_effects"},probability:1.0}`;
                } else if (eff.type === 'remove') {
                    return `{effect:{id:"custom:remove_effect"},probability:1.0}`;
                }
                return null;
            }).filter(Boolean);
            if (effectEntries.length > 0) {
                foodObj.effects = `[${effectEntries.join(',')}]`;
            }
        }
        const foodSnbt = Object.entries(foodObj).map(([k, v]) => {
            if (k === 'effects') return `${k}:${v}`;
            if (typeof v === 'boolean') return `${k}:${v}`;
            return `${k}:${v}`;
        }).join(',');
        components.push(`food={${foodSnbt}}`);
    }

    if (toolEnabled) {
        let toolObj = {};
        if (toolDefaultSpeed !== null && toolDefaultSpeed >= 0) toolObj.default_mining_speed = toolDefaultSpeed;
        if (toolDamagePerBlock !== null && toolDamagePerBlock >= 0) toolObj.damage_per_block = toolDamagePerBlock;
        if (toolRules && toolRules.length > 0) {
            const rules = toolRules.map(rule => {
                return `{blocks:[${rule.blockId ? `"${rule.blockId}"` : ''}],speed:${rule.speed},correct_for_drops:${rule.correctDrop}}`;
            }).join(',');
            toolObj.rules = `[${rules}]`;
        }
        const toolSnbt = Object.entries(toolObj).map(([k, v]) => {
            if (k === 'rules') return `${k}:${v}`;
            return `${k}:${v}`;
        }).join(',');
        if (Object.keys(toolObj).length > 0) components.push(`tool={${toolSnbt}}`);
    }

    if (blocks && blocks.length > 0) {
        const placeBlocks = blocks.filter(b => b.type === 'place' || b.type === 'both').map(b => b.blockId);
        const breakBlocks = blocks.filter(b => b.type === 'break' || b.type === 'both').map(b => b.blockId);
        if (placeBlocks.length > 0) {
            components.push(`can_place_on={blocks:[${placeBlocks.map(id => `"${id}"`).join(',')}]}`);
        }
        if (breakBlocks.length > 0) {
            components.push(`can_break={blocks:[${breakBlocks.map(id => `"${id}"`).join(',')}]}`);
        }
    }

    if (attributes && attributes.length > 0) {
        const modifiers = attributes.map((attr, index) => {
            const id = `custom_${Date.now()}_${index}`;
            let operationStr = 'add_value';
            if (attr.operation === 1) operationStr = 'add_multiplied_base';
            else if (attr.operation === 2) operationStr = 'add_multiplied_total';
            let slotStr = '';
            if (attr.slot) slotStr = `,slot:"${attr.slot}"`;
            return `{type:"${attr.type}",amount:${attr.amount},operation:"${operationStr}"${slotStr},id:"${id}"}`;
        }).join(',');
        components.push(`attribute_modifiers=[${modifiers}]`);
    }

    return components.length ? `[${components.join(',')}]` : '';
}

// ========== 1.21.1 ==========

export function buildComponents_1_21_1(
    displayName, displayStyle, itemName, itemNameStyle,
    lore, loreStyle, enchants, damage, unbreakable,
    glint, attributes, blocks, rarity, maxDamage, maxStack, repairCost,
    nutrition, saturation, canAlwaysEat, eatSeconds,
    foodEffects,
    toolEnabled, toolDefaultSpeed, toolDamagePerBlock, toolRules
) {
    const components = [];

    if (displayName) {
        components.push(`custom_name='${buildTextComponentSingle(displayName, displayStyle)}'`);
    }
    if (itemName) {
        components.push(`item_name='${buildTextComponentSingle(itemName, itemNameStyle)}'`);
    }
    if (itemName || lore) {
        const loreStr = buildLoreSingle(itemName, itemNameStyle, lore, loreStyle);
        if (loreStr) components.push(`lore=${loreStr}`);
    }

    if (enchants.length > 0) {
        const enchantObj = enchants.map(e => {
            let id = e.id.replace(/^"|"$/g, '');
            if (id.startsWith('minecraft:')) id = id.substring('minecraft:'.length);
            return `${id}:${e.level}`;
        }).join(',');
        components.push(`enchantments={levels:{${enchantObj}}}`);
    }

    if (damage !== 0) components.push(`damage=${damage}`);
    if (unbreakable) components.push(`unbreakable={}`);
    components.push(`enchantment_glint_override=${glint}`);

    if (rarity) components.push(`rarity="${rarity}"`);

    if (maxDamage !== null && maxDamage > 0) components.push(`max_damage=${maxDamage}`);
    if (maxStack !== null && maxStack > 0 && maxStack <= 99) components.push(`max_stack_size=${maxStack}`);
    if (repairCost !== null && repairCost >= 0) components.push(`repair_cost=${repairCost}`);

    const hasFoodData = nutrition !== null || saturation !== null || canAlwaysEat || eatSeconds !== null || (foodEffects && foodEffects.length > 0);
    if (hasFoodData) {
        let foodObj = {};
        if (nutrition !== null) foodObj.nutrition = nutrition;
        if (saturation !== null) foodObj.saturation = saturation;
        if (canAlwaysEat) foodObj.can_always_eat = '1b';
        if (eatSeconds !== null) foodObj.eat_seconds = eatSeconds;
        if (foodEffects && foodEffects.length > 0) {
            const effectEntries = foodEffects.map(eff => {
                if (eff.type === 'effect') {
                    const effectId = (eff.effectId || 'speed').startsWith('minecraft:') ? eff.effectId : `minecraft:${eff.effectId || 'speed'}`;
                    return `{effect:{id:"${effectId}",duration:${eff.duration || 60},amplifier:${eff.amplifier || 0}},probability:1.0}`;
                } else if (eff.type === 'teleport') {
                    return `{effect:{id:"custom:teleport",diameter:${eff.diameter || 10}},probability:${eff.probability || 1.0}}`;
                } else if (eff.type === 'clear') {
                    return `{effect:{id:"custom:clear_effects"},probability:1.0}`;
                } else if (eff.type === 'remove') {
                    return `{effect:{id:"custom:remove_effect"},probability:1.0}`;
                }
                return null;
            }).filter(Boolean);
            if (effectEntries.length > 0) {
                foodObj.effects = `[${effectEntries.join(',')}]`;
            }
        }
        const foodSnbt = Object.entries(foodObj).map(([k, v]) => {
            if (k === 'can_always_eat') return `${k}:${v}`;
            if (k === 'effects') return `${k}:${v}`;
            return `${k}:${v}`;
        }).join(',');
        components.push(`food={${foodSnbt}}`);
    }

    if (toolEnabled) {
        let toolObj = {};
        if (toolDefaultSpeed !== null && toolDefaultSpeed >= 0) toolObj.default_mining_speed = toolDefaultSpeed;
        if (toolDamagePerBlock !== null && toolDamagePerBlock >= 0) toolObj.damage_per_block = toolDamagePerBlock;
        if (toolRules && toolRules.length > 0) {
            const rules = toolRules.map(rule => {
                return `{blocks:[${rule.blockId ? `"${rule.blockId}"` : ''}],speed:${rule.speed},correct_for_drops:${rule.correctDrop}}`;
            }).join(',');
            toolObj.rules = `[${rules}]`;
        }
        const toolSnbt = Object.entries(toolObj).map(([k, v]) => {
            if (k === 'rules') return `${k}:${v}`;
            return `${k}:${v}`;
        }).join(',');
        if (Object.keys(toolObj).length > 0) components.push(`tool={${toolSnbt}}`);
    }

    if (blocks && blocks.length > 0) {
        const placeBlocks = blocks.filter(b => b.type === 'place' || b.type === 'both').map(b => b.blockId);
        const breakBlocks = blocks.filter(b => b.type === 'break' || b.type === 'both').map(b => b.blockId);
        if (placeBlocks.length > 0) {
            components.push(`can_place_on={predicates:[${placeBlocks.map(id => `{blocks:"${id}"}`).join(',')}]}`);
        }
        if (breakBlocks.length > 0) {
            components.push(`can_break={predicates:[${breakBlocks.map(id => `{blocks:"${id}"}`).join(',')}]}`);
        }
    }

    if (attributes && attributes.length > 0) {
        const modifiers = attributes.map((attr, index) => {
            const id = `"custom_${Date.now()}_${index}"`;
            const type = `"${attr.type}"`;
            const amount = attr.amount;
            let operationStr = '"add_value"';
            if (attr.operation === 1) operationStr = '"add_multiplied_base"';
            else if (attr.operation === 2) operationStr = '"add_multiplied_total"';
            const slot = `"${attr.slot || 'any'}"`;
            return `{type:${type},amount:${amount},operation:${operationStr},slot:${slot},id:${id}}`;
        }).join(',');
        components.push(`attribute_modifiers={modifiers:[${modifiers}]}`);
    }

    return components.length ? `[${components.join(',')}]` : '';
}

// ========== 1.21.2 ==========

export function buildComponents_1_21_2(
    displayName, displayStyle, itemName, itemNameStyle,
    lore, loreStyle, enchants, damage, unbreakable,
    glint, attributes, blocks, rarity, maxDamage, maxStack, repairCost,
    nutrition, saturation, canAlwaysEat, eatSeconds,
    foodEffects, clearEffects, useCooldownSeconds,
    toolEnabled, toolDefaultSpeed, toolDamagePerBlock, toolRules
) {
    const components = [];

    if (displayName) {
        components.push(`custom_name='${buildTextComponentSingle(displayName, displayStyle)}'`);
    }
    if (itemName) {
        const jsonArr = buildTextComponentArray(itemName, itemNameStyle);
        components.push(`item_name='${jsonArr}'`);
    }
    if (itemName || lore) {
        const loreItems = [];
        if (itemName) {
            const jsonArr = buildTextComponentArray(itemName, itemNameStyle);
            loreItems.push(`'${jsonArr}'`);
        }
        if (lore) {
            const jsonArr = buildTextComponentArray(lore, loreStyle);
            loreItems.push(`'${jsonArr}'`);
        }
        if (loreItems.length > 0) {
            components.push(`lore=[${loreItems.join(',')}]`);
        }
    }

    if (enchants.length > 0) {
        const enchantObj = enchants.map(e => {
            let id = e.id.replace(/^"|"$/g, '');
            if (id.startsWith('minecraft:')) id = id.substring('minecraft:'.length);
            return `${id}:${e.level}`;
        }).join(',');
        components.push(`enchantments={${enchantObj}}`);
    }

    if (damage !== 0) components.push(`damage=${damage}`);
    if (unbreakable) components.push(`unbreakable={}`);
    components.push(`enchantment_glint_override=${glint}`);

    if (rarity) components.push(`rarity="${rarity}"`);

    if (maxDamage !== null && maxDamage > 0) components.push(`max_damage=${maxDamage}`);
    if (maxStack !== null && maxStack > 0 && maxStack <= 99) components.push(`max_stack_size=${maxStack}`);
    if (repairCost !== null && repairCost >= 0) components.push(`repair_cost=${repairCost}`);

    const hasFoodData = nutrition !== null || saturation !== null || canAlwaysEat;
    if (hasFoodData) {
        let foodObj = {};
        foodObj.nutrition = (nutrition !== null) ? nutrition : 1;
        foodObj.saturation = (saturation !== null) ? saturation : 0.6;
        if (canAlwaysEat) foodObj.can_always_eat = '1b';
        const foodSnbt = Object.entries(foodObj).map(([k, v]) => {
            if (k === 'can_always_eat') return `${k}:${v}`;
            return `${k}:${v}`;
        }).join(',');
        components.push(`food={${foodSnbt}}`);
    }

    const hasConsumableData = eatSeconds !== null || (foodEffects && foodEffects.length > 0);
    if (hasConsumableData) {
        let consumableObj = {};
        if (eatSeconds !== null) {
            consumableObj.consume_seconds = eatSeconds;
        } else {
            consumableObj.consume_seconds = 1.6;
        }
        if (foodEffects && foodEffects.length > 0) {
            const directEffects = [];
            const applyEffects = [];
            foodEffects.forEach(eff => {
                if (eff.type === 'teleport_randomly') {
                    const diam = eff.diameter || 50;
                    const prob = eff.probability !== undefined ? eff.probability : 1.0;
                    directEffects.push(`{type:teleport_randomly,probability:${prob},diameter:${diam}}`);
                } else if (eff.type === 'clear_all_effects') {
                    const prob = eff.probability !== undefined ? eff.probability : 1.0;
                    directEffects.push(`{type:clear_all_effects,probability:${prob}}`);
                } else if (eff.type === 'effect') {
                    let effectId = eff.effectId || 'speed';
                    if (effectId.startsWith('minecraft:')) effectId = effectId.substring('minecraft:'.length);
                    const dur = eff.duration || 60;
                    const amp = eff.amplifier || 0;
                    applyEffects.push(`{id:${effectId},duration:${dur},amplifier:${amp},ShowParticles:1b,ShowIcon:1b}`);
                } else if (eff.type === 'clear') {
                    applyEffects.push(`{id:"custom:clear_effects"}`);
                } else if (eff.type === 'remove') {
                    applyEffects.push(`{id:"custom:remove_effect"}`);
                } else if (eff.type === 'teleport') {
                    const diam = eff.diameter || 10;
                    applyEffects.push(`{id:"custom:teleport",diameter:${diam}}`);
                }
            });
            const allEffects = [];
            directEffects.forEach(e => allEffects.push(e));
            if (applyEffects.length > 0) {
                const prob = 1.0;
                allEffects.push(`{type:apply_effects,probability:${prob},effects:[${applyEffects.join(',')}]}`);
            }
            if (allEffects.length > 0) {
                consumableObj.on_consume_effects = `[${allEffects.join(',')}]`;
            }
        }
        // 如果勾选了清除效果，追加到 on_consume_effects 数组
        if (clearEffects) {
            const clearEntry = '{type:clear_all_effects,probability:1}';
            if (consumableObj.on_consume_effects) {
                consumableObj.on_consume_effects = consumableObj.on_consume_effects.slice(0, -1) + ',' + clearEntry + ']';
            } else {
                consumableObj.on_consume_effects = '[' + clearEntry + ']';
            }
        }
        const consumableSnbt = Object.entries(consumableObj).map(([k, v]) => {
            if (k === 'on_consume_effects') return `${k}:${v}`;
            return `${k}:${v}`;
        }).join(',');
        components.push(`consumable={${consumableSnbt}}`);
    }

    // use_cooldown（独立顶层组件）
    if (useCooldownSeconds !== null && useCooldownSeconds >= 0) {
        components.push(`use_cooldown={seconds:${useCooldownSeconds}}`);
    }


    if (toolEnabled) {
        let toolObj = {};
        if (toolDefaultSpeed !== null && toolDefaultSpeed >= 0) toolObj.default_mining_speed = toolDefaultSpeed;
        if (toolDamagePerBlock !== null && toolDamagePerBlock >= 0) toolObj.damage_per_block = toolDamagePerBlock;
        if (toolRules && toolRules.length > 0) {
            const rules = toolRules.map(rule => {
                let blockId = rule.blockId || '';
                if (blockId.startsWith('minecraft:')) blockId = blockId.substring('minecraft:'.length);
                blockId = blockId.replace(/^"|"$/g, '');
                return `{blocks:[${blockId}],speed:${rule.speed}f}`;
            }).join(',');
            toolObj.rules = `[${rules}]`;
        }
        const toolSnbt = Object.entries(toolObj).map(([k, v]) => {
            if (k === 'rules') return `${k}:${v}`;
            return `${k}:${v}`;
        }).join(',');
        if (Object.keys(toolObj).length > 0) components.push(`tool={${toolSnbt}}`);
    }

    if (blocks && blocks.length > 0) {
        const placeBlocks = blocks.filter(b => b.type === 'place' || b.type === 'both').map(b => b.blockId);
        const breakBlocks = blocks.filter(b => b.type === 'break' || b.type === 'both').map(b => b.blockId);
        if (placeBlocks.length > 0) {
            components.push(`can_place_on={predicates:[${placeBlocks.map(id => `{blocks:"${id}"}`).join(',')}]}`);
        }
        if (breakBlocks.length > 0) {
            components.push(`can_break={predicates:[${breakBlocks.map(id => `{blocks:"${id}"}`).join(',')}]}`);
        }
    }

    if (attributes && attributes.length > 0) {
        const modifiers = attributes.map((attr, index) => {
            let type = attr.type || '';
            if (type.startsWith('minecraft:')) type = type.substring('minecraft:'.length);
            if (type.startsWith('generic.')) type = type.substring('generic.'.length);
            type = type.replace(/^"|"$/g, '');
            const amount = attr.amount;
            let slot = attr.slot || 'any';
            slot = slot.replace(/^"|"$/g, '');
            const id = `"custom_${Date.now()}_${index}"`;
            const operation = 'add_value';
            return `{type:${type},amount:${amount},slot:${slot},id:${id},operation:${operation}}`;
        }).join(',');
        components.push(`attribute_modifiers=[${modifiers}]`);
    }

    return components.length ? `[${components.join(',')}]` : '';
}

// ========== 1.21.3 ==========

export function buildComponents_1_21_3(
    displayName, displayStyle, itemName, itemNameStyle,
    lore, loreStyle, enchants, damage, unbreakable,
    glint, attributes, blocks, rarity, maxDamage, maxStack, repairCost,
    nutrition, saturation, canAlwaysEat, eatSeconds,
    foodEffects, clearEffects, useCooldownSeconds,
    toolEnabled, toolDefaultSpeed, toolDamagePerBlock, toolRules
) {
    const components = [];

    // custom_name: 数组格式，外层单引号
    if (displayName) {
        const jsonArr = buildTextComponentArray(displayName, displayStyle);
        components.push(`custom_name='${jsonArr}'`);
    }

    // item_name: 数组格式，外层单引号
    if (itemName) {
        const jsonArr = buildTextComponentArray(itemName, itemNameStyle);
        components.push(`item_name='${jsonArr}'`);
    }

    // lore: 简化字符串数组格式 ['文本1', '文本2']
    // 颜色使用 § 符号，不能使用 JSON 文本组件
    if (itemName || lore) {
        const loreItems = [];
        if (itemName) {
            let text = itemName;
            if (itemNameStyle.bold) text = '§l' + text;
            if (itemNameStyle.italic) text = '§o' + text;
            if (itemNameStyle.underline) text = '§n' + text;
            if (itemNameStyle.strikethrough) text = '§m' + text;
            if (itemNameStyle.obfuscated) text = '§k' + text;
            if (itemNameStyle.color && itemNameStyle.color !== 'white') {
                const colorMap = {
                    'black': '0', 'dark_blue': '1', 'dark_green': '2', 'dark_aqua': '3',
                    'dark_red': '4', 'dark_purple': '5', 'gold': '6', 'gray': '7',
                    'dark_gray': '8', 'blue': '9', 'green': 'a', 'aqua': 'b',
                    'red': 'c', 'light_purple': 'd', 'yellow': 'e', 'white': 'f'
                };
                const colorCode = colorMap[itemNameStyle.color];
                if (colorCode) text = '§' + colorCode + text;
            }
            loreItems.push(`'${text}'`);
        }
        if (lore) {
            let text = lore;
            if (loreStyle.bold) text = '§l' + text;
            if (loreStyle.italic) text = '§o' + text;
            if (loreStyle.underline) text = '§n' + text;
            if (loreStyle.strikethrough) text = '§m' + text;
            if (loreStyle.obfuscated) text = '§k' + text;
            if (loreStyle.color && loreStyle.color !== 'white') {
                const colorMap = {
                    'black': '0', 'dark_blue': '1', 'dark_green': '2', 'dark_aqua': '3',
                    'dark_red': '4', 'dark_purple': '5', 'gold': '6', 'gray': '7',
                    'dark_gray': '8', 'blue': '9', 'green': 'a', 'aqua': 'b',
                    'red': 'c', 'light_purple': 'd', 'yellow': 'e', 'white': 'f'
                };
                const colorCode = colorMap[loreStyle.color];
                if (colorCode) text = '§' + colorCode + text;
            }
            loreItems.push(`'${text}'`);
        }
        if (loreItems.length > 0) {
            components.push(`lore=[${loreItems.join(',')}]`);
        }
    }

    // ----- 附魔 (有 levels 包裹) -----
    if (enchants.length > 0) {
        const enchantObj = enchants.map(e => {
            let id = e.id.replace(/^"|"$/g, '');
            if (id.startsWith('minecraft:')) id = id.substring('minecraft:'.length);
            return `${id}:${e.level}`;
        }).join(',');
        components.push(`enchantments={levels:{${enchantObj}}}`);
    }

    if (damage !== 0) components.push(`damage=${damage}`);
    if (unbreakable) components.push(`unbreakable={}`);
    components.push(`enchantment_glint_override=${glint}`);

    if (rarity) components.push(`rarity="${rarity}"`);

    if (maxDamage !== null && maxDamage > 0) components.push(`max_damage=${maxDamage}`);
    if (maxStack !== null && maxStack > 0 && maxStack <= 99) components.push(`max_stack_size=${maxStack}`);
    if (repairCost !== null && repairCost >= 0) components.push(`repair_cost=${repairCost}`);

    // ----- 食物（仅营养和饱和度） -----
    const hasFoodData = nutrition !== null || saturation !== null || canAlwaysEat;
    if (hasFoodData) {
        let foodObj = {};
        foodObj.nutrition = (nutrition !== null) ? nutrition : 1;
        foodObj.saturation = (saturation !== null) ? saturation : 0.6;
        if (canAlwaysEat) foodObj.can_always_eat = '1b';
        const foodSnbt = Object.entries(foodObj).map(([k, v]) => {
            if (k === 'can_always_eat') return `${k}:${v}`;
            return `${k}:${v}`;
        }).join(',');
        components.push(`food={${foodSnbt}}`);
    }

    // ----- 消耗品（食用行为和效果） -----
    const hasConsumableData = eatSeconds !== null || (foodEffects && foodEffects.length > 0);
    if (hasConsumableData) {
        let consumableObj = {};
        if (eatSeconds !== null) {
            consumableObj.consume_seconds = eatSeconds;
        } else {
            consumableObj.consume_seconds = 1.6;
        }
        if (foodEffects && foodEffects.length > 0) {
            const effectEntries = foodEffects.map(eff => {
                if (eff.type === 'effect') {
                    let effectId = eff.effectId || 'speed';
                    if (effectId.startsWith('minecraft:')) effectId = effectId.substring('minecraft:'.length);
                    const dur = eff.duration || 60;
                    const amp = eff.amplifier || 0;
                    return `{id:${effectId},duration:${dur},amplifier:${amp},ShowParticles:0b,ShowIcon:0b}`;
                } else if (eff.type === 'clear') {
                    return `{id:"custom:clear_effects"}`;
                } else if (eff.type === 'remove') {
                    return `{id:"custom:remove_effect"}`;
                } else if (eff.type === 'teleport') {
                    const diam = eff.diameter || 10;
                    return `{id:"custom:teleport",diameter:${diam}}`;
                }
                return null;
            }).filter(Boolean);
            if (effectEntries.length > 0) {
                const prob = (foodEffects[0] && foodEffects[0].probability) ? foodEffects[0].probability : 1.0;
                consumableObj.on_consume_effects = `[{type:apply_effects,probability:${prob},effects:[${effectEntries.join(',')}]}]`;
            }
        }
        const consumableSnbt = Object.entries(consumableObj).map(([k, v]) => {
            if (k === 'on_consume_effects') return `${k}:${v}`;
            return `${k}:${v}`;
        }).join(',');
        components.push(`consumable={${consumableSnbt}}`);
    }

    // ----- 工具规则 -----
    if (toolEnabled) {
        let toolObj = {};
        if (toolDefaultSpeed !== null && toolDefaultSpeed >= 0) toolObj.default_mining_speed = toolDefaultSpeed;
        if (toolDamagePerBlock !== null && toolDamagePerBlock >= 0) toolObj.damage_per_block = toolDamagePerBlock;
        if (toolRules && toolRules.length > 0) {
            const rules = toolRules.map(rule => {
                let blockId = rule.blockId || '';
                if (blockId.startsWith('minecraft:')) blockId = blockId.substring('minecraft:'.length);
                blockId = blockId.replace(/^"|"$/g, '');
                return `{blocks:[${blockId}],speed:${rule.speed}f}`;
            }).join(',');
            toolObj.rules = `[${rules}]`;
        }
        const toolSnbt = Object.entries(toolObj).map(([k, v]) => {
            if (k === 'rules') return `${k}:${v}`;
            return `${k}:${v}`;
        }).join(',');
        if (Object.keys(toolObj).length > 0) components.push(`tool={${toolSnbt}}`);
    }

    // ----- 方块交互 (predicates 包裹) -----
    if (blocks && blocks.length > 0) {
        const placeBlocks = blocks.filter(b => b.type === 'place' || b.type === 'both').map(b => b.blockId);
        const breakBlocks = blocks.filter(b => b.type === 'break' || b.type === 'both').map(b => b.blockId);
        if (placeBlocks.length > 0) {
            components.push(`can_place_on={predicates:[${placeBlocks.map(id => `{blocks:"${id}"}`).join(',')}]}`);
        }
        if (breakBlocks.length > 0) {
            components.push(`can_break={predicates:[${breakBlocks.map(id => `{blocks:"${id}"}`).join(',')}]}`);
        }
    }

    // ----- 属性修饰符 -----
    if (attributes && attributes.length > 0) {
        const modifiers = attributes.map((attr, index) => {
            let type = attr.type || '';
            if (type.startsWith('minecraft:')) {
                type = type.substring('minecraft:'.length);
            }
            if (type.startsWith('generic.')) {
                type = type.substring('generic.'.length);
            }
            type = type.replace(/^"|"$/g, '');
            const amount = attr.amount;
            let slot = attr.slot || 'any';
            slot = slot.replace(/^"|"$/g, '');
            const id = `"custom_${Date.now()}_${index}"`;
            const operation = '"add_value"';
            return `{type:${type},amount:${amount},slot:${slot},id:${id},operation:${operation}}`;
        }).join(',');
        components.push(`attribute_modifiers=[${modifiers}]`);
    }

    return components.length ? `[${components.join(',')}]` : '';
}

// ========== 1.21.4 ==========

export function buildComponents_1_21_4(
    displayName, displayStyle, itemName, itemNameStyle,
    lore, loreStyle, enchants, damage, unbreakable,
    glint, attributes, blocks, rarity, maxDamage, maxStack, repairCost,
    nutrition, saturation, canAlwaysEat, eatSeconds,
    foodEffects, clearEffects, useCooldownSeconds,
    toolEnabled, toolDefaultSpeed, toolDamagePerBlock, toolRules
) {
    const components = [];

    // custom_name: JSON 数组，外层单引号
    if (displayName) {
        const jsonArr = buildTextComponentArray(displayName, displayStyle);
        components.push(`custom_name='${jsonArr}'`);
    }

    // item_name: JSON 对象，外层单引号
    if (itemName) {
        const jsonObj = buildTextComponentSingle(itemName, itemNameStyle);
        components.push(`item_name='${jsonObj}'`);
    }

    // lore: 简化 § 字符串数组 ['文本1', '文本2']
    if (itemName || lore) {
        const loreItems = [];
        if (itemName) {
            const obj = { text: itemName };
            if (itemNameStyle.bold) obj.bold = true;
            if (itemNameStyle.italic) obj.italic = true;
            if (itemNameStyle.underline) obj.underlined = true;
            if (itemNameStyle.strikethrough) obj.strikethrough = true;
            if (itemNameStyle.obfuscated) obj.obfuscated = true;
            if (itemNameStyle.color && itemNameStyle.color !== 'white') {
                obj.color = itemNameStyle.color;
            }
            loreItems.push(`'[${JSON.stringify([obj])}]'`);
        }
        if (lore) {
            const obj = { text: lore };
            if (loreStyle.bold) obj.bold = true;
            if (loreStyle.italic) obj.italic = true;
            if (loreStyle.underline) obj.underlined = true;
            if (loreStyle.strikethrough) obj.strikethrough = true;
            if (loreStyle.obfuscated) obj.obfuscated = true;
            if (loreStyle.color && loreStyle.color !== 'white') {
                obj.color = loreStyle.color;
            }
            loreItems.push(`'[${JSON.stringify([obj])}]'`);
        }
        if (loreItems.length > 0) {
            components.push(`lore=[${loreItems.join(',')}]`);
        }
    }

    // ----- 附魔 (levels 包裹) -----
    if (enchants.length > 0) {
        const enchantObj = enchants.map(e => {
            let id = e.id.replace(/^"|"$/g, '');
            if (id.startsWith('minecraft:')) id = id.substring('minecraft:'.length);
            return `${id}:${e.level}`;
        }).join(',');
        components.push(`enchantments={levels:{${enchantObj}}}`);
    }

    if (damage !== 0) components.push(`damage=${damage}`);
    if (unbreakable) components.push(`unbreakable={}`);
    components.push(`enchantment_glint_override=${glint}`);

    if (rarity) components.push(`rarity="${rarity}"`);

    if (maxDamage !== null && maxDamage > 0) components.push(`max_damage=${maxDamage}`);
    if (maxStack !== null && maxStack > 0 && maxStack <= 99) components.push(`max_stack_size=${maxStack}`);
    if (repairCost !== null && repairCost >= 0) components.push(`repair_cost=${repairCost}`);

    // ----- 食物（营养+饱和度+can_always_eat） -----
    const hasFoodData = nutrition !== null || saturation !== null || canAlwaysEat;
    if (hasFoodData) {
        let foodObj = {};
        foodObj.nutrition = (nutrition !== null) ? nutrition : 1;
        foodObj.saturation = (saturation !== null) ? saturation : 0.6;
        if (canAlwaysEat) foodObj.can_always_eat = '1b';
        const foodSnbt = Object.entries(foodObj).map(([k, v]) => `${k}:${v}`).join(',');
        components.push(`food={${foodSnbt}}`);
    }

    // ----- 消耗品（食用时间+效果）food+consumable 必须共存 -----
    const hasConsumableData = eatSeconds !== null || (foodEffects && foodEffects.length > 0) || hasFoodData;
    if (hasConsumableData) {
        let consumableObj = {};
        if (eatSeconds !== null) {
            consumableObj.consume_seconds = eatSeconds;
        } else {
            consumableObj.consume_seconds = 1.6;
        }
        if (foodEffects && foodEffects.length > 0) {
            const effectEntries = foodEffects.map(eff => {
                if (eff.type === 'effect') {
                    let effectId = eff.effectId || 'speed';
                    if (effectId.startsWith('minecraft:')) effectId = effectId.substring('minecraft:'.length);
                    const dur = eff.duration || 60;
                    const amp = eff.amplifier || 0;
                    return `{id:${effectId},duration:${dur},amplifier:${amp},ShowParticles:1b,ShowIcon:1b}`;
                } else if (eff.type === 'clear') {
                    return `{id:"custom:clear_effects"}`;
                } else if (eff.type === 'remove') {
                    return `{id:"custom:remove_effect"}`;
                } else if (eff.type === 'teleport') {
                    const diam = eff.diameter || 10;
                    return `{id:"custom:teleport",diameter:${diam}}`;
                }
                return null;
            }).filter(Boolean);
            if (effectEntries.length > 0) {
                const prob = (foodEffects[0] && foodEffects[0].probability) ? foodEffects[0].probability : 1.0;
                consumableObj.on_consume_effects = `[{type:apply_effects,probability:${prob},effects:[${effectEntries.join(',')}]}]`;
            }
        }
        // 如果勾选了清除效果，追加到 on_consume_effects 数组
        if (clearEffects) {
            const clearEntry = '{type:clear_all_effects,probability:1}';
            if (consumableObj.on_consume_effects) {
                consumableObj.on_consume_effects = consumableObj.on_consume_effects.slice(0, -1) + ',' + clearEntry + ']';
            } else {
                consumableObj.on_consume_effects = '[' + clearEntry + ']';
            }
        }
        const consumableSnbt = Object.entries(consumableObj)
            .map(([k, v]) => k === 'on_consume_effects' ? `${k}:${v}` : `${k}:${v}`)
            .join(',');
        components.push(`consumable={${consumableSnbt}}`);
    }

    // ----- 工具规则 (blocks 无引号, speed 带 f 后缀) -----
    if (toolEnabled) {
        let toolObj = {};
        if (toolDefaultSpeed !== null && toolDefaultSpeed >= 0) toolObj.default_mining_speed = toolDefaultSpeed;
        if (toolDamagePerBlock !== null && toolDamagePerBlock >= 0) toolObj.damage_per_block = toolDamagePerBlock;
        if (toolRules && toolRules.length > 0) {
            const rules = toolRules.map(rule => {
                let blockId = rule.blockId || '';
                if (blockId.startsWith('minecraft:')) blockId = blockId.substring('minecraft:'.length);
                blockId = blockId.replace(/^"|"$/g, '');
                return `{blocks:[${blockId}],speed:${rule.speed}f}`;
            }).join(',');
            toolObj.rules = `[${rules}]`;
        }
        const toolSnbt = Object.entries(toolObj)
            .map(([k, v]) => k === 'rules' ? `${k}:${v}` : `${k}:${v}`)
            .join(',');
        if (Object.keys(toolObj).length > 0) components.push(`tool={${toolSnbt}}`);
    }

    // ----- 方块交互 (predicates 包裹) -----
    if (blocks && blocks.length > 0) {
        const placeBlocks = blocks.filter(b => b.type === 'place' || b.type === 'both').map(b => b.blockId);
        const breakBlocks = blocks.filter(b => b.type === 'break' || b.type === 'both').map(b => b.blockId);
        if (placeBlocks.length > 0) {
            components.push(`can_place_on={predicates:[${placeBlocks.map(id => `{blocks:"${id}"}`).join(',')}]}`);
        }
        if (breakBlocks.length > 0) {
            components.push(`can_break={predicates:[${breakBlocks.map(id => `{blocks:"${id}"}`).join(',')}]}`);
        }
    }

    // ----- 属性修饰符 (operation 为字符串, id 加引号) -----
    if (attributes && attributes.length > 0) {
        const modifiers = attributes.map((attr, index) => {
            let type = attr.type || '';
            if (type.startsWith('minecraft:')) type = type.substring('minecraft:'.length);
            if (type.startsWith('generic.')) type = type.substring('generic.'.length);
            type = type.replace(/^"|"$/g, '');
            const amount = attr.amount;
            let slot = attr.slot || 'any';
            slot = slot.replace(/^"|"$/g, '');
            const id = `"custom_${Date.now()}_${index}"`;
            return `{type:${type},amount:${amount},slot:${slot},id:${id},operation:"add_value"}`;
        }).join(',');
        components.push(`attribute_modifiers=[${modifiers}]`);
    }

    return components.length ? `[${components.join(',')}]` : '';
}

// ========== 1.21.5 ==========

export function buildComponents_1_21_5(
    displayName, displayStyle, itemName, itemNameStyle,
    lore, loreStyle, enchants, damage, unbreakable,
    glint, attributes, blocks, rarity, maxDamage, maxStack, repairCost,
    nutrition, saturation, canAlwaysEat, eatSeconds,
    foodEffects, clearEffects, useCooldownSeconds,
    toolEnabled, toolDefaultSpeed, toolDamagePerBlock, toolRules
) {
    const components = [];

    // custom_name: 直接 JSON 数组，无外层单引号，text 键不加引号
    if (displayName) {
        const obj = { text: displayName };
        if (displayStyle.bold) obj.bold = true;
        if (displayStyle.italic) obj.italic = true;
        if (displayStyle.underline) obj.underlined = true;
        if (displayStyle.strikethrough) obj.strikethrough = true;
        if (displayStyle.obfuscated) obj.obfuscated = true;
        if (displayStyle.color && displayStyle.color !== 'white') obj.color = displayStyle.color;
        components.push(`custom_name=[${JSON.stringify(obj)}]`);
    }

    // item_name: 直接 JSON 数组，无外层单引号
    if (itemName) {
        const obj = { text: itemName };
        if (itemNameStyle.bold) obj.bold = true;
        if (itemNameStyle.italic) obj.italic = true;
        if (itemNameStyle.underline) obj.underlined = true;
        if (itemNameStyle.strikethrough) obj.strikethrough = true;
        if (itemNameStyle.obfuscated) obj.obfuscated = true;
        if (itemNameStyle.color && itemNameStyle.color !== 'white') obj.color = itemNameStyle.color;
        components.push(`item_name=[${JSON.stringify(obj)}]`);
    }

    // lore: 直接 JSON 对象数组，不嵌套字符串
    if (itemName || lore) {
        const loreItems = [];
        if (itemName) {
            const obj = { text: itemName };
            if (itemNameStyle.bold) obj.bold = true;
            if (itemNameStyle.italic) obj.italic = true;
            if (itemNameStyle.underline) obj.underlined = true;
            if (itemNameStyle.strikethrough) obj.strikethrough = true;
            if (itemNameStyle.obfuscated) obj.obfuscated = true;
            if (itemNameStyle.color && itemNameStyle.color !== 'white') obj.color = itemNameStyle.color;
            loreItems.push(JSON.stringify(obj));
        }
        if (lore) {
            const obj = { text: lore };
            if (loreStyle.bold) obj.bold = true;
            if (loreStyle.italic) obj.italic = true;
            if (loreStyle.underline) obj.underlined = true;
            if (loreStyle.strikethrough) obj.strikethrough = true;
            if (loreStyle.obfuscated) obj.obfuscated = true;
            if (loreStyle.color && loreStyle.color !== 'white') obj.color = loreStyle.color;
            loreItems.push(JSON.stringify(obj));
        }
        if (loreItems.length > 0) {
            components.push(`lore=[${loreItems.join(',')}]`);
        }
    }

    // ----- 附魔 (无 levels 包裹层) -----
    if (enchants.length > 0) {
        const enchantObj = enchants.map(e => {
            let id = e.id.replace(/^"|"$/g, '');
            if (id.startsWith('minecraft:')) id = id.substring('minecraft:'.length);
            return `${id}:${e.level}`;
        }).join(',');
        components.push(`enchantments={${enchantObj}}`);
    }

    if (damage !== 0) components.push(`damage=${damage}`);
    if (unbreakable) components.push(`unbreakable={}`);
    components.push(`enchantment_glint_override=${glint}`);

    if (rarity) components.push(`rarity="${rarity}"`);

    if (maxDamage !== null && maxDamage > 0) components.push(`max_damage=${maxDamage}`);
    if (maxStack !== null && maxStack > 0 && maxStack <= 99) components.push(`max_stack_size=${maxStack}`);
    if (repairCost !== null && repairCost >= 0) components.push(`repair_cost=${repairCost}`);

    // ----- 食物 (can_always_eat 用 true/false) -----
    const hasFoodData = nutrition !== null || saturation !== null || canAlwaysEat;
    if (hasFoodData) {
        let foodObj = {};
        foodObj.nutrition = (nutrition !== null) ? nutrition : 1;
        foodObj.saturation = (saturation !== null) ? saturation : 0.6;
        if (canAlwaysEat) foodObj.can_always_eat = true;
        const foodSnbt = Object.entries(foodObj)
            .map(([k, v]) => `${k}:${v}`)
            .join(',');
        components.push(`food={${foodSnbt}}`);
    }

    // ----- 消耗品 -----
    const hasConsumableData = eatSeconds !== null || (foodEffects && foodEffects.length > 0) || hasFoodData;
    if (hasConsumableData) {
        let consumableObj = {};
        if (eatSeconds !== null) {
            consumableObj.consume_seconds = eatSeconds;
        } else {
            consumableObj.consume_seconds = 1.6;
        }
        if (foodEffects && foodEffects.length > 0) {
            const effectEntries = foodEffects.map(eff => {
                if (eff.type === 'effect') {
                    let effectId = eff.effectId || 'speed';
                    if (effectId.startsWith('minecraft:')) effectId = effectId.substring('minecraft:'.length);
                    const dur = eff.duration || 60;
                    const amp = eff.amplifier || 0;
                    return `{id:${effectId},duration:${dur},amplifier:${amp},ShowParticles:0b,ShowIcon:0b}`;
                } else if (eff.type === 'clear') {
                    return `{id:"custom:clear_effects"}`;
                } else if (eff.type === 'remove') {
                    return `{id:"custom:remove_effect"}`;
                } else if (eff.type === 'teleport') {
                    const diam = eff.diameter || 10;
                    return `{id:"custom:teleport",diameter:${diam}}`;
                }
                return null;
            }).filter(Boolean);
            if (effectEntries.length > 0) {
                const prob = (foodEffects[0] && foodEffects[0].probability) ? foodEffects[0].probability : 1.0;
                consumableObj.on_consume_effects = `[{type:apply_effects,probability:${prob},effects:[${effectEntries.join(',')}]}]`;
            }
        }
        // 如果勾选了清除效果，追加到 on_consume_effects 数组
        if (clearEffects) {
            const clearEntry = '{type:clear_all_effects,probability:1}';
            if (consumableObj.on_consume_effects) {
                consumableObj.on_consume_effects = consumableObj.on_consume_effects.slice(0, -1) + ',' + clearEntry + ']';
            } else {
                consumableObj.on_consume_effects = '[' + clearEntry + ']';
            }
        }
        const consumableSnbt = Object.entries(consumableObj).map(([k, v]) => {
            if (k === 'on_consume_effects') return `${k}:${v}`;
            return `${k}:${v}`;
        }).join(',');
        components.push(`consumable={${consumableSnbt}}`);
    }

    // ----- 工具规则 -----
    if (toolEnabled) {
        let toolObj = {};
        if (toolDefaultSpeed !== null && toolDefaultSpeed >= 0) toolObj.default_mining_speed = toolDefaultSpeed;
        if (toolDamagePerBlock !== null && toolDamagePerBlock >= 0) toolObj.damage_per_block = toolDamagePerBlock;
        if (toolRules && toolRules.length > 0) {
            const rules = toolRules.map(rule => {
                let blockId = rule.blockId || '';
                if (blockId.startsWith('minecraft:')) blockId = blockId.substring('minecraft:'.length);
                blockId = blockId.replace(/^"|"$/g, '');
                return `{blocks:[${blockId}],speed:${rule.speed}f}`;
            }).join(',');
            toolObj.rules = `[${rules}]`;
        }
        const toolSnbt = Object.entries(toolObj)
            .map(([k, v]) => k === 'rules' ? `${k}:${v}` : `${k}:${v}`)
            .join(',');
        if (Object.keys(toolObj).length > 0) components.push(`tool={${toolSnbt}}`);
    }

    // ----- 方块交互 (无 predicates 包裹层，直接数组) -----
    if (blocks && blocks.length > 0) {
        const placeBlocks = blocks.filter(b => b.type === 'place' || b.type === 'both').map(b => b.blockId);
        const breakBlocks = blocks.filter(b => b.type === 'break' || b.type === 'both').map(b => b.blockId);
        if (placeBlocks.length > 0) {
            components.push(`can_place_on=[${placeBlocks.map(id => `{blocks:"${id}"}`).join(',')}]`);
        }
        if (breakBlocks.length > 0) {
            components.push(`can_break=[${breakBlocks.map(id => `{blocks:"${id}"}`).join(',')}]`);
        }
    }

    // ----- 属性修饰符 -----
    if (attributes && attributes.length > 0) {
        const modifiers = attributes.map((attr, index) => {
            let type = attr.type || '';
            if (type.startsWith('minecraft:')) type = type.substring('minecraft:'.length);
            if (type.startsWith('generic.')) type = type.substring('generic.'.length);
            type = type.replace(/^"|"$/g, '');
            const amount = attr.amount;
            let slot = attr.slot || 'any';
            slot = slot.replace(/^"|"$/g, '');
            const id = `"custom_${Date.now()}_${index}"`;
            return `{type:${type},amount:${amount},slot:${slot},id:${id},operation:"add_value"}`;
        }).join(',');
        components.push(`attribute_modifiers=[${modifiers}]`);
    }

    return components.length ? `[${components.join(',')}]` : '';
}
