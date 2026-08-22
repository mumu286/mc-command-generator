// ============================================================
// 食用效果管理
// ============================================================

let foodEffects = [];
let effectIdCounter = 0;

// 预定义效果列表 (用于搜索建议)
export const EFFECT_TYPES = [
    { id: 'speed', label: '速度' },
    { id: 'slowness', label: '缓慢' },
    { id: 'haste', label: '急迫' },
    { id: 'mining_fatigue', label: '挖掘疲劳' },
    { id: 'strength', label: '力量' },
    { id: 'instant_damage', label: '瞬间伤害' },
    { id: 'instant_health', label: '瞬间治疗' },
    { id: 'jump_boost', label: '跳跃提升' },
    { id: 'nausea', label: '反胃' },
    { id: 'regeneration', label: '生命恢复' },
    { id: 'resistance', label: '抗性提升' },
    { id: 'fire_resistance', label: '抗火' },
    { id: 'water_breathing', label: '水下呼吸' },
    { id: 'invisibility', label: '隐身' },
    { id: 'blindness', label: '失明' },
    { id: 'night_vision', label: '夜视' },
    { id: 'hunger', label: '饥饿' },
    { id: 'weakness', label: '虚弱' },
    { id: 'poison', label: '中毒' },
    { id: 'wither', label: '凋零' },
    { id: 'health_boost', label: '生命提升' },
    { id: 'absorption', label: '伤害吸收' },
    { id: 'saturation', label: '饱和' },
    { id: 'glowing', label: '发光' },
    { id: 'levitation', label: '漂浮' },
    { id: 'luck', label: '幸运' },
    { id: 'unluck', label: '霉运' },
    { id: 'slow_falling', label: '缓降' },
    { id: 'conduit_power', label: '潮涌能量' },
    { id: 'dolphins_grace', label: '海豚的恩惠' },
    { id: 'bad_omen', label: '不祥之兆' },
    { id: 'hero_of_the_village', label: '村庄英雄' },
    { id: 'darkness', label: '黑暗' },
    { id: 'weaving', label: '盘丝' },
    { id: 'oozing', label: '渗浆' },
    { id: 'wind_charged', label: '蓄风' },
    { id: 'infested', label: '虫蚀' },
];

export function getFoodEffects() {
    return foodEffects;
}

export function clearFoodEffects() {
    foodEffects = [];
}

export function renderEffectList(effectListEl) {
    if (foodEffects.length === 0) {
        effectListEl.innerHTML = '<div style="color:#445;font-size:13px;text-align:center;padding:12px 0;">还没有添加食用效果</div>';
        return;
    }
    const typeLabels = {
        'none': '无',
        'effect': '给予状态效果',
        'clear': '清除状态效果',
        'remove': '移除状态效果',
        'teleport': '随机传送',
        'teleport_randomly': '随机传送 (新版)',
        'clear_all_effects': '清除所有效果'
    };
    effectListEl.innerHTML = foodEffects.map((eff, index) => {
        let detail = '';
        if (eff.type === 'teleport' || eff.type === 'teleport_randomly') {
            detail = ` 概率:${eff.probability || 1.0} 直径:${eff.diameter || 10}`;
        } else if (eff.type === 'clear_all_effects') {
            detail = ` 概率:${eff.probability || 1.0}`;
        } else if (eff.type === 'effect') {
            const effectLabel = EFFECT_TYPES.find(e => e.id === eff.effectId)?.label || eff.effectId || '未知效果';
            detail = ` ${effectLabel} ${eff.duration || 60}刻 等级${eff.amplifier || 0}`;
        }
        return `<div class="effect-tag">
                    <span class="effect-name">${typeLabels[eff.type] || eff.type}${detail}</span>
                    <button data-index="${index}" class="remove-effect">✕</button>
                </div>`;
    }).join('');

    document.querySelectorAll('.remove-effect').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            foodEffects.splice(index, 1);
            renderEffectList(effectListEl);
        });
    });
}

export function setupEffectSearch(effectSearch, effectSuggestions) {
    function renderEffectSuggestions(query) {
        if (!query.trim()) {
            effectSuggestions.style.display = 'none';
            return;
        }
        const lowerQuery = query.toLowerCase().trim();
        const matches = EFFECT_TYPES.filter(e =>
            e.id.toLowerCase().includes(lowerQuery) ||
            e.label.includes(lowerQuery)
        );
        if (lowerQuery.includes(':')) {
            matches.push({ id: lowerQuery, label: '自定义: ' + lowerQuery });
        }
        const uniqueMatches = matches.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).slice(0, 12);

        if (uniqueMatches.length === 0) {
            effectSuggestions.innerHTML = '<div class="no-results">没有找到匹配的效果</div>';
            effectSuggestions.style.display = 'block';
            return;
        }

        effectSuggestions.innerHTML = uniqueMatches.map(e =>
            `<div class="suggestion-item" data-id="${e.id}">
                <span style="color:#8ab0d0;">${e.id}</span>
                <span style="color:#556;font-size:12px;margin-left:8px;">— ${e.label}</span>
            </div>`
        ).join('');
        effectSuggestions.style.display = 'block';

        document.querySelectorAll('#effectSuggestions .suggestion-item').forEach(el => {
            el.addEventListener('click', () => {
                effectSearch.value = el.dataset.id;
                effectSuggestions.style.display = 'none';
                effectSearch.dispatchEvent(new Event('input', { bubbles: true }));
            });
        });
    }

    effectSearch.addEventListener('input', () => {
        renderEffectSuggestions(effectSearch.value);
    });

    effectSearch.addEventListener('focus', () => {
        if (effectSearch.value.trim()) {
            renderEffectSuggestions(effectSearch.value);
        }
    });

    effectSearch.addEventListener('blur', () => {
        setTimeout(() => {
            effectSuggestions.style.display = 'none';
        }, 200);
    });

    effectSearch.addEventListener('keydown', (e) => {
        const items = effectSuggestions.querySelectorAll('.suggestion-item');
        if (items.length === 0) return;
        let currentIndex = -1;
        items.forEach((el, idx) => {
            if (el.classList.contains('selected')) {
                currentIndex = idx;
                el.classList.remove('selected');
            }
        });
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = Math.min(currentIndex + 1, items.length - 1);
            items[nextIndex].classList.add('selected');
            items[nextIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = Math.max(currentIndex - 1, 0);
            items[prevIndex].classList.add('selected');
            items[prevIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selected = effectSuggestions.querySelector('.suggestion-item.selected');
            if (selected) {
                effectSearch.value = selected.dataset.id;
                effectSuggestions.style.display = 'none';
                effectSearch.dispatchEvent(new Event('input', { bubbles: true }));
            }
        } else if (e.key === 'Escape') {
            effectSuggestions.style.display = 'none';
        }
    });
}

export function setupFoodEffectControls(
    effectTypeSelect, effectSearch, effectProbability, effectDiameter,
    effectDuration, effectAmplifier, addEffectBtn, effectListEl
) {
    addEffectBtn.addEventListener('click', () => {
        const type = effectTypeSelect.value;
        const effectId = effectSearch.value.trim() || 'speed';
        const probability = effectProbability.value.trim() !== '' ? parseFloat(effectProbability.value) : null;
        const diameter = effectDiameter.value.trim() !== '' ? parseInt(effectDiameter.value) : null;
        const duration = effectDuration.value.trim() !== '' ? parseInt(effectDuration.value) : null;
        const amplifier = effectAmplifier.value.trim() !== '' ? parseInt(effectAmplifier.value) : null;

        if (type === 'none') {
            alert('请选择有效的效果类型');
            return;
        }

        // teleport / teleport_randomly: 需要概率和直径，不能重复
        if (type === 'teleport' || type === 'teleport_randomly') {
            if (probability === null || isNaN(probability) || probability < 0 || probability > 1) {
                alert('随机传送需要有效的概率 (0 ~ 1)');
                return;
            }
            if (diameter === null || isNaN(diameter) || diameter < 1) {
                alert('随机传送需要有效的直径 (≥ 1)');
                return;
            }
            if (foodEffects.some(e => e.type === type)) {
                alert(`效果类型 "${type}" 已添加，不能重复`);
                return;
            }
            foodEffects.push({
                id: ++effectIdCounter,
                type: type,
                probability: probability,
                diameter: diameter,
            });
        // clear_all_effects: 需要概率，不需要直径/持续时间/等级
        } else if (type === 'clear_all_effects') {
            if (probability === null || isNaN(probability) || probability < 0 || probability > 1) {
                alert('清除所有效果需要有效的概率 (0 ~ 1)');
                return;
            }
            if (foodEffects.some(e => e.type === 'clear_all_effects')) {
                alert('清除所有效果已添加，不能重复');
                return;
            }
            foodEffects.push({
                id: ++effectIdCounter,
                type: type,
                probability: probability,
            });
        } else if (type === 'effect') {
            if (duration === null || isNaN(duration) || duration < 1) {
                alert('请输入有效的持续时间（≥ 1 刻）');
                return;
            }
            if (amplifier === null || isNaN(amplifier) || amplifier < 0) {
                alert('请输入有效的等级（≥ 0）');
                return;
            }
            if (foodEffects.some(e => e.type === 'effect')) {
                alert('给予状态效果已添加，不能重复');
                return;
            }
            foodEffects.push({
                id: ++effectIdCounter,
                type: type,
                effectId: effectId,
                duration: duration,
                amplifier: amplifier,
                probability: 1.0,
            });
        } else {
            if (foodEffects.some(e => e.type === type)) {
                alert(`效果类型 "${type}" 已添加，不能重复`);
                return;
            }
            foodEffects.push({
                id: ++effectIdCounter,
                type: type,
            });
        }

        renderEffectList(effectListEl);
        effectSearch.value = '';
        effectProbability.value = '';
        effectDiameter.value = '';
        effectDuration.value = '';
        effectAmplifier.value = '';
        effectTypeSelect.value = 'none';
    });

    // 键盘支持
    effectProbability.addEventListener('keydown', (e) => { if (e.key === 'Enter') addEffectBtn.click(); });
    effectDiameter.addEventListener('keydown', (e) => { if (e.key === 'Enter') addEffectBtn.click(); });
    effectDuration.addEventListener('keydown', (e) => { if (e.key === 'Enter') addEffectBtn.click(); });
    effectAmplifier.addEventListener('keydown', (e) => { if (e.key === 'Enter') addEffectBtn.click(); });
}
