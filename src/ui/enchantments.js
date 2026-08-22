// ============================================================
// 附魔管理（自动控制光效）
// ============================================================

import { getDOM } from './dom.js';

let enchantments = [];

export function getEnchantments() {
    return enchantments;
}

export function setupEnchantmentManager() {
    const dom = getDOM();
    const { enchantSelect, enchantCustom, enchantLevel, addEnchantBtn, enchantListEl } = dom;

    function renderEnchantList() {
        if (enchantments.length === 0) {
            enchantListEl.innerHTML = '<div class="enchant-empty">还没有添加附魔</div>';
        } else {
            enchantListEl.innerHTML = enchantments.map((ench, index) => {
                let displayName = ench.id;
                if (!ench.isCustom) {
                    const option = document.querySelector(`#enchantSelect option[value="${ench.id}"]`);
                    if (option) displayName = option.textContent;
                }
                return `<div class="enchant-tag">
                            <span class="enchant-name">${displayName} ${ench.level}</span>
                            <button data-index="${index}" class="remove-enchant">✕</button>
                        </div>`;
            }).join('');

            document.querySelectorAll('.remove-enchant').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    enchantments.splice(index, 1);
                    renderEnchantList();
                });
            });
        }

        // ===== 自动控制光效 =====
        const dom2 = getDOM();
        const glintCheck = dom2.glintCheck;
        if (glintCheck) {
            if (enchantments.length === 0) {
                // 没有附魔 → 自动取消光效
                glintCheck.checked = false;
            }
            // 有附魔时：不强制修改，保留用户手动选择
            // 但添加附魔时会在 addEnchantBtn 中主动勾选
        }
    }

    // 添加附魔按钮
    addEnchantBtn.addEventListener('click', () => {
        let id = enchantCustom.value.trim();
        let isCustom = false;
        if (!id) {
            id = enchantSelect.value;
            isCustom = false;
        } else {
            isCustom = true;
        }
        const level = parseInt(enchantLevel.value) || 1;

        if (enchantments.some(e => e.id === id)) {
            alert('该附魔已添加，不能重复');
            return;
        }

        enchantments.push({ id, level, isCustom });
        
        // ===== 添加附魔后自动勾选光效 =====
        const dom2 = getDOM();
        const glintCheck = dom2.glintCheck;
        if (glintCheck) {
            glintCheck.checked = true;
        }
        
        renderEnchantList();
        enchantCustom.value = '';
    });

    enchantLevel.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addEnchantBtn.click();
        }
    });
    enchantCustom.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addEnchantBtn.click();
        }
    });

    renderEnchantList();

    return { renderEnchantList, clearEnchantments: () => { enchantments = []; renderEnchantList(); } };
}