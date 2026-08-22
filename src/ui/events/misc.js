// ============================================================
// 杂项事件 (版本切换、无法破坏)
// ============================================================

import { loadItems } from '../items.js';

export function setupVersionSwitch(versionSelect) {
    if (!versionSelect) return;
    versionSelect.addEventListener('change', () => {
        loadItems(versionSelect.value);
    });
}

export function setupUnbreakable(unbreakableCheck, unbreakableHint, damageInput) {
    if (!unbreakableCheck) return;
    unbreakableCheck.addEventListener('change', () => {
        const checked = unbreakableCheck.checked;
        if (unbreakableHint) unbreakableHint.style.display = checked ? 'inline' : 'none';
        if (damageInput) {
            damageInput.disabled = checked;
            if (checked) damageInput.value = '0';
        }
    });
}