// ============================================================
// 历史记录 (本次程序运行期间生成的指令 + 配置中文描述)
// ============================================================

import { EFFECT_TYPES } from './food.js';

let history = [];            // { command, config, timestamp }，最新在最前


export function addToHistory(command, config = null) {
    if (!command || typeof command !== 'string') return;

    // 与最新一条完全相同则不重复存储（仅比较最新一条，允许间隔后重复生成）
    if (history.length > 0 && history[0].command === command) {
        return;
    }

    history.unshift({ command, config: config || null, timestamp: Date.now() });
    // 无上限，不截断
}

export function getHistory() {
    return history;
}

export function clearHistory() {
    history = [];
}

// ============================================================
// 中文映射表
// ============================================================

const CN_NUM = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九', 10: '十' };

const ENCHANT_NAMES = {
    sharpness: '锋利', smite: '亡灵杀手', bane_of_arthropods: '节肢杀手',
    fire_aspect: '火焰附加', looting: '抢夺', knockback: '击退',
    unbreaking: '耐久', mending: '经验修补', efficiency: '效率',
    fortune: '时运', silk_touch: '精准采集', protection: '保护',
    fire_protection: '火焰保护', blast_protection: '爆炸保护',
    projectile_protection: '弹射物保护', feather_falling: '摔落保护',
    respiration: '水下呼吸', aqua_affinity: '水下速掘', thorns: '荆棘',
    depth_strider: '深海探索者', frost_walker: '冰霜行者', soul_speed: '灵魂疾行',
    swift_sneak: '迅捷潜行', power: '力量', punch: '冲击', flame: '火矢',
    infinity: '无限', loyalty: '忠诚', impaling: '穿刺', riptide: '激流',
    channeling: '引雷', multishot: '多重射击', quick_charge: '快速装填',
    piercing: '穿透', density: '密度', breach: '破甲', wind_burst: '风爆',
};

const ATTRIBUTE_NAMES = {
    'generic.attack_speed': '攻速',
    'generic.attack_damage': '攻击伤害',
    'generic.attack_knockback': '攻击击退',
    'generic.max_health': '最大生命',
    'generic.armor': '护甲',
    'generic.armor_toughness': '护甲韧性',
    'generic.knockback_resistance': '击退抗性',
    'generic.movement_speed': '移动速度',
    'generic.flying_speed': '飞行速度',
    'generic.jump_strength': '跳跃力度',
    'generic.gravity': '重力',
    'generic.luck': '幸运',
    'generic.follow_range': '跟随范围',
    'generic.scale': '体型',
    'generic.step_height': '台阶高度',
    'generic.safe_fall_distance': '安全坠落距离',
    'generic.fall_damage_multiplier': '坠落伤害倍率',
    'generic.burning_time': '燃烧时间',
    'generic.explosion_knockback_resistance': '爆炸击退抗性',
    'generic.mining_efficiency': '挖掘效率',
    'generic.sneaking_speed': '潜行速度',
    'generic.submerged_mining_speed': '水下挖掘速度',
    'generic.sweeping_damage_ratio': '横扫伤害比例',
    'generic.water_movement_efficiency': '水下移动效率',
    'generic.oxygen_bonus': '氧气加成',
    'generic.movement_efficiency': '移动效率',
    'player.block_interaction_range': '方块交互距离',
    'player.entity_interaction_range': '实体交互距离',
    'player.block_break_speed': '方块破坏速度',
    'player.mining_efficiency': '挖掘效率',
};

const ITEM_NAMES = {
    diamond_sword: '钻石剑', netherite_sword: '下界合金剑', iron_sword: '铁剑',
    golden_sword: '金剑', stone_sword: '石剑', wooden_sword: '木剑',
    diamond_pickaxe: '钻石镐', netherite_pickaxe: '下界合金镐', iron_pickaxe: '铁镐',
    diamond_axe: '钻石斧', diamond_shovel: '钻石锹', diamond_hoe: '钻石锄',
    bow: '弓', crossbow: '弩', trident: '三叉戟', shield: '盾牌',
    diamond_helmet: '钻石头盔', diamond_chestplate: '钻石胸甲',
    diamond_leggings: '钻石护腿', diamond_boots: '钻石靴子',
    netherite_helmet: '下界合金头盔', netherite_chestplate: '下界合金胸甲',
    netherite_leggings: '下界合金护腿', netherite_boots: '下界合金靴子',
    elytra: '鞘翅', totem_of_undying: '不死图腾', golden_apple: '金苹果',
    enchanted_golden_apple: '附魔金苹果', bread: '面包', cooked_beef: '牛排',
    apple: '苹果', carrot: '胡萝卜', golden_carrot: '金胡萝卜',
    potion: '药水', stick: '木棍', diamond: '钻石', netherite_ingot: '下界合金锭',
    ender_pearl: '末影珍珠', firework_rocket: '烟花火箭',
};

const BLOCK_NAMES = {
    stone: '石头', cobblestone: '圆石', dirt: '泥土', grass_block: '草方块',
    sand: '沙子', gravel: '砂砾', oak_log: '橡木原木', oak_planks: '橡木木板',
    deepslate: '深板岩', netherrack: '下界岩', obsidian: '黑曜石',
    diamond_ore: '钻石矿石', iron_ore: '铁矿石', gold_ore: '金矿石',
    coal_ore: '煤矿石', redstone_ore: '红石矿石', lapis_ore: '青金石矿石',
    emerald_ore: '绿宝石矿石', ancient_debris: '远古残骸', bedrock: '基岩',
};

const COLOR_NAMES = {
    white: '白', light_gray: '浅灰', gray: '灰', black: '黑', red: '红',
    dark_red: '深红', orange: '橙', gold: '金', yellow: '黄', green: '绿',
    dark_green: '深绿', aqua: '湖蓝', dark_aqua: '深湖蓝', blue: '蓝',
    dark_blue: '深蓝', purple: '紫', dark_purple: '深紫', pink: '粉',
};

const RARITY_NAMES = {
    common: '普通', uncommon: '罕见', rare: '稀有', epic: '史诗',
};

// ---------- 工具函数 ----------
function stripId(id) {
    if (!id) return '';
    return String(id).replace(/^minecraft:/, '');
}

function getItemName(item) {
    const key = stripId(item);
    return ITEM_NAMES[key] || key;
}

function getBlockName(id) {
    const key = stripId(id);
    return BLOCK_NAMES[key] || key;
}

function getEnchantName(id) {
    const key = stripId(id);
    return ENCHANT_NAMES[key] || key;
}

function getAttributeName(type) {
    if (!type) return '';
    return ATTRIBUTE_NAMES[type] || ATTRIBUTE_NAMES[stripId(type)] || stripId(type);
}

function toCnNum(n) {
    return Number.isInteger(n) && CN_NUM[n] ? CN_NUM[n] : String(n);
}

// ============================================================
// 将 config 转换为人类可读的中文描述
// ============================================================
export function buildDescription(config) {
    if (!config) return '';
    const parts = [];

    // 1. 名称（自定义显示名称优先，否则物品中文名）
    const name = config.displayName || getItemName(config.item);
    if (name) parts.push(name);

    // 2. 文本样式
    const styleParts = [];
    [config.displayStyle, config.itemNameStyle, config.loreStyle].forEach(st => {
        if (!st) return;
        if (st.bold) styleParts.push('加粗');
        if (st.italic) styleParts.push('斜体');
        if (st.underline) styleParts.push('下划线');
        if (st.strikethrough) styleParts.push('删除线');
        if (st.obfuscated) styleParts.push('乱码');
        if (st.color && st.color !== 'white') {
            styleParts.push('颜色：' + (COLOR_NAMES[st.color] || st.color));
        }
    });
    if (styleParts.length) parts.push([...new Set(styleParts)].join('、'));

    // 3. 附魔
    if (Array.isArray(config.enchants) && config.enchants.length) {
        config.enchants.forEach(en => {
            const enName = getEnchantName(en.id || en.name || en.type);
            const lvl = toCnNum(parseInt(en.level ?? en.lvl ?? 1, 10) || 1);
            parts.push(`${enName}${lvl}`);
        });
    }

    // 4. 属性
    if (Array.isArray(config.attributes) && config.attributes.length) {
        config.attributes.forEach(attr => {
            const aName = getAttributeName(attr.type || attr.id || attr.name);
            const amt = attr.amount ?? attr.value ?? 0;
            parts.push(`${aName}${amt}`);
        });
    }

    // 5. 耐久
    if (config.unbreakable) parts.push('无法破坏');
    if (config.maxDamage) parts.push(`${config.maxDamage}耐久`);

    // 6. 食物
    if (config.nutrition != null || config.saturation != null || config.canAlwaysEat) {
        parts.push('可食用');
    }

    // 7. 食用效果
    if (Array.isArray(config.foodEffects) && config.foodEffects.length) {
        config.foodEffects.forEach(eff => {
            const t = eff.type;
            if (t === 'effect') {
                const label = EFFECT_TYPES.find(e => e.id === eff.effectId)?.label || eff.effectId || '效果';
                parts.push(`食用后获得${label}`);
            } else if (t === 'teleport' || t === 'teleport_randomly') {
                parts.push('食用后随机传送');
            } else if (t === 'clear_all_effects') {
                parts.push('食用后清除效果');
            } else if (t === 'clear') {
                parts.push('食用后清除状态效果');
            } else if (t === 'remove') {
                parts.push('食用后移除状态效果');
            }
        });
    }

    // 8. 食用后净化
    if (config.clearEffects) parts.push('食用后净化');

    // 9. 冷却
    if (config.useCooldownSeconds != null) parts.push(`冷却${config.useCooldownSeconds}秒`);

    // 10. 工具规则
    if (Array.isArray(config.toolRules) && config.toolRules.length) {
        const names = config.toolRules.map(r => getBlockName(r.blockId || r.block || r.id));
        const shown = names.slice(0, 2).join('、');
        parts.push('可挖掘' + shown + (names.length > 2 ? '等' : ''));
    }

    // 11. 方块交互
    if (Array.isArray(config.blocks) && config.blocks.length) {
        config.blocks.forEach(b => {
            const bName = getBlockName(b.blockId || b.block || b.id);
            const action = String(b.type || b.action || '').toLowerCase();
            if (action.includes('place')) parts.push(`可放置于${bName}`);
            else if (action.includes('break')) parts.push(`可破坏${bName}`);
        });
    }

    // 12. 稀有度
    if (config.rarity && RARITY_NAMES[config.rarity]) parts.push(RARITY_NAMES[config.rarity]);

    // 13. 修复消耗
    if (config.repairCost != null) parts.push(`修复消耗${config.repairCost}`);

    // 14. 数量
    if (config.count && config.count > 1) parts.push(`数量${config.count}`);

    return parts.join('，');
}

// ============================================================
// 复制 / 转义
// ============================================================
async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        } catch (e) {
            return false;
        }
    }
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ============================================================
// 渲染历史列表
// ============================================================
function renderHistory(listEl) {
    if (history.length === 0) {
        listEl.innerHTML = '<div class="history-empty">还没有生成过指令</div>';
        return;
    }

    listEl.innerHTML = history.map((item, index) => {
        const desc = buildDescription(item.config);
        return `<div class="history-item">
                    <div class="history-row">
                        <span class="history-text" title="${escapeHtml(item.command)}">${escapeHtml(item.command)}</span>
                        <button class="history-copy-btn" data-index="${index}" type="button">复制</button>
                    </div>
                    ${desc ? `<div class="history-desc">${escapeHtml(desc)}</div>` : ''}
                </div>`;
    }).join('');

    listEl.querySelectorAll('.history-copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const index = parseInt(btn.dataset.index, 10);
            const record = history[index];
            if (!record) return;
            const ok = await copyText(record.command);
            if (ok) {
                btn.textContent = '已复制';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = '复制';
                    btn.classList.remove('copied');
                }, 1200);
            }
        });
    });
}

// ============================================================
// 绑定弹窗交互
// ============================================================
export function setupHistoryPanel() {
    const btn = document.getElementById('historyBtn');
    const panel = document.getElementById('historyPanel');
    if (!btn || !panel) return;

    const closeBtn = document.getElementById('historyCloseBtn');
    const listEl = document.getElementById('historyList');

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = panel.style.display === 'flex';
        if (isOpen) {
            panel.style.display = 'none';
        } else {
            renderHistory(listEl);
            panel.style.display = 'flex';
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.style.display = 'none';
        });
    }

    // ---------- 点击弹窗外部关闭 ----------
    document.addEventListener('click', (e) => {
        if (panel.style.display === 'none') return;
        if (panel.contains(e.target)) return;        // 点击弹窗内部，不关闭
        if (btn.contains(e.target)) return;          // 点击历史按钮，交给按钮自身逻辑
        panel.style.display = 'none';
    });
}

