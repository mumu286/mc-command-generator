// ============================================================
// 属性管理（支持自定义ID）
// ============================================================

import { getDOM } from './dom.js';

let attributes = [];

export const ATTRIBUTE_TYPES = [
    { id: 'generic.attack_damage', label: '攻击伤害', category: '战斗' },
    { id: 'generic.attack_speed', label: '攻击速度', category: '战斗' },
    { id: 'generic.attack_knockback', label: '攻击击退', category: '战斗' },
    { id: 'generic.sweeping_damage_ratio', label: '横扫伤害比例', category: '战斗' },
    { id: 'generic.armor', label: '护甲值', category: '防御' },
    { id: 'generic.armor_toughness', label: '护甲韧性', category: '防御' },
    { id: 'generic.knockback_resistance', label: '击退抗性', category: '防御' },
    { id: 'generic.movement_speed', label: '移动速度', category: '移动' },
    { id: 'generic.flying_speed', label: '飞行速度', category: '移动' },
    { id: 'generic.jump_strength', label: '跳跃强度', category: '移动' },
    { id: 'generic.step_height', label: '跨越高度', category: '移动' },
    { id: 'generic.fall_damage_multiplier', label: '掉落伤害倍率', category: '移动' },
    { id: 'generic.safe_fall_distance', label: '安全掉落距离', category: '移动' },
    { id: 'generic.sneaking_speed', label: '潜行速度', category: '移动' },
    { id: 'generic.water_movement_efficiency', label: '水中移动效率', category: '移动' },
    { id: 'generic.movement_efficiency', label: '移动效率', category: '移动' },
    { id: 'generic.block_break_speed', label: '方块破坏速度', category: '交互' },
    { id: 'generic.submerged_mining_speed', label: '水下挖掘速度', category: '交互' },
    { id: 'generic.block_interaction_range', label: '方块交互距离', category: '交互' },
    { id: 'generic.entity_interaction_range', label: '实体交互距离', category: '交互' },
    { id: 'generic.max_health', label: '最大生命值', category: '生命' },
    { id: 'generic.luck', label: '幸运值', category: '生命' },
    { id: 'generic.gravity', label: '重力', category: '特殊' },
    { id: 'generic.scale', label: '体型缩放', category: '特殊' },
    { id: 'generic.follow_range', label: '跟随范围', category: '特殊' },
    { id: 'generic.tempt_range', label: '引诱范围', category: '特殊' },
];

export const OPERATIONS = [
    { value: 0, label: '相加' },
    { value: 1, label: '乘百分比' },
    { value: 2, label: '乘 (最终)' },
];

export const SLOTS = [
    { value: '', label: '任意' },
    { value: 'mainhand', label: '主手' },
    { value: 'offhand', label: '副手' },
    { value: 'head', label: '头部' },
    { value: 'chest', label: '胸部' },
    { value: 'legs', label: '腿部' },
    { value: 'feet', label: '脚部' },
];

export function getAttributes() {
    return attributes;
}

export function setupAttributeManager() {
    const dom = getDOM();
    const {
        attrTypeSelect,
        attrCustomId,
        attrAmountInput,
        attrOperationSelect,
        attrSlotSelect,
        addAttrBtn,
        attrListEl,
    } = dom;

    function renderAttrList() {
        if (attributes.length === 0) {
            attrListEl.innerHTML = '<div class="attr-empty">还没有添加属性</div>';
            return;
        }

        attrListEl.innerHTML = attributes.map((attr, index) => {
            const typeInfo = ATTRIBUTE_TYPES.find(t => t.id === attr.type);
            const typeLabel = typeInfo ? typeInfo.label : attr.type;
            const opLabel = OPERATIONS.find(o => o.value === attr.operation)?.label || attr.operation;
            const slotLabel = SLOTS.find(s => s.value === attr.slot)?.label || '任意';
            const slotDisplay = attr.slot ? ` [${slotLabel}]` : '';
            return `<div class="attr-tag">
                        <span class="attr-name">${typeLabel} ${attr.amount} (${opLabel})${slotDisplay}</span>
                        <button data-index="${index}" class="remove-attr">✕</button>
                    </div>`;
        }).join('');

        document.querySelectorAll('.remove-attr').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                attributes.splice(index, 1);
                renderAttrList();
            });
        });
    }

    addAttrBtn.addEventListener('click', () => {
        let type = attrCustomId.value.trim();
        if (!type) {
            type = attrTypeSelect.value;
        }
        const amount = parseFloat(attrAmountInput.value);
        const operation = parseInt(attrOperationSelect.value);
        const slot = attrSlotSelect.value;

        if (isNaN(amount) || amount === 0) {
            alert('请输入有效的数值（非零）');
            return;
        }

        if (attributes.some(a => a.type === type && a.operation === operation && a.slot === slot)) {
            alert('该属性已存在，不能重复添加');
            return;
        }

        attributes.push({ type, amount, operation, slot });
        renderAttrList();
        attrAmountInput.value = '1';
        attrCustomId.value = '';
    });

    attrAmountInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addAttrBtn.click();
        }
    });
    attrCustomId.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addAttrBtn.click();
        }
    });

    return { renderAttrList, clearAttributes: () => { attributes = []; renderAttrList(); } };
}