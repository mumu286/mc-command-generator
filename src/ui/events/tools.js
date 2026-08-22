// ============================================================
// 工具规则管理 (含方块搜索修复)
// ============================================================

import { getItems } from '../items.js';

let toolRules = [];
let toolRuleIdCounter = 0;

export function getToolRules() {
    return toolRules;
}

export function clearToolRules() {
    toolRules = [];
}

export function renderToolRuleList(toolRuleListEl) {
    if (toolRules.length === 0) {
        toolRuleListEl.innerHTML = '<div style="color:#445;font-size:13px;text-align:center;padding:12px 0;">还没有添加目标方块规则</div>';
        return;
    }
    toolRuleListEl.innerHTML = toolRules.map((rule, index) => {
        const dropText = rule.correctDrop ? '✅ 正确掉落' : '❌ 不正确掉落';
        return `<div class="tool-rule-tag">
                    <span class="tool-rule-name">${rule.blockId} — 速度:${rule.speed} ${dropText}</span>
                    <button data-index="${index}" class="remove-tool-rule">✕</button>
                </div>`;
    }).join('');

    document.querySelectorAll('.remove-tool-rule').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            toolRules.splice(index, 1);
            renderToolRuleList(toolRuleListEl);
        });
    });
}

export function setupToolSearch(toolBlockSearch, toolBlockSuggestions) {
    function renderToolSuggestions(query) {
        if (!query.trim()) {
            toolBlockSuggestions.style.display = 'none';
            return;
        }
        const lowerQuery = query.toLowerCase().trim();
        const allItems = getItems();
        // 检查数据是否加载
        if (allItems.length === 0) {
            toolBlockSuggestions.innerHTML = '<div class="no-results">⏳ 物品数据加载中，请稍后...</div>';
            toolBlockSuggestions.style.display = 'block';
            return;
        }
        const matches = allItems.filter(item =>
            item.id.toLowerCase().includes(lowerQuery) ||
            item.name.includes(lowerQuery)
        ).slice(0, 12);

        if (matches.length === 0) {
            toolBlockSuggestions.innerHTML = '<div class="no-results">❌ 没有找到匹配的方块</div>';
            toolBlockSuggestions.style.display = 'block';
            return;
        }

        toolBlockSuggestions.innerHTML = matches.map(item =>
            `<div class="suggestion-item" data-id="${item.id}">
                <span style="color:#8ab0d0;">${item.id}</span>
                <span style="color:#556;font-size:12px;margin-left:8px;">— ${item.name}</span>
            </div>`
        ).join('');
        toolBlockSuggestions.style.display = 'block';

        document.querySelectorAll('#toolBlockSuggestions .suggestion-item').forEach(el => {
            el.addEventListener('click', () => {
                toolBlockSearch.value = el.dataset.id;
                toolBlockSuggestions.style.display = 'none';
                toolBlockSearch.dispatchEvent(new Event('input', { bubbles: true }));
            });
        });
    }

    toolBlockSearch.addEventListener('input', () => {
        renderToolSuggestions(toolBlockSearch.value);
    });

    toolBlockSearch.addEventListener('focus', () => {
        if (toolBlockSearch.value.trim()) {
            renderToolSuggestions(toolBlockSearch.value);
        }
    });

    toolBlockSearch.addEventListener('blur', () => {
        setTimeout(() => {
            toolBlockSuggestions.style.display = 'none';
        }, 200);
    });

    toolBlockSearch.addEventListener('keydown', (e) => {
        const items = toolBlockSuggestions.querySelectorAll('.suggestion-item');
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
            const selected = toolBlockSuggestions.querySelector('.suggestion-item.selected');
            if (selected) {
                toolBlockSearch.value = selected.dataset.id;
                toolBlockSuggestions.style.display = 'none';
                toolBlockSearch.dispatchEvent(new Event('input', { bubbles: true }));
            }
        } else if (e.key === 'Escape') {
            toolBlockSuggestions.style.display = 'none';
        }
    });
}

export function setupToolRuleControls(
    toolBlockSearch, toolRuleSpeed, toolRuleCorrectDrop,
    addToolRuleBtn, toolRuleList
) {
    addToolRuleBtn.addEventListener('click', () => {
        const blockId = toolBlockSearch.value.trim();
        const speed = parseFloat(toolRuleSpeed.value);
        const correctDrop = toolRuleCorrectDrop.value === 'true';

        if (!blockId) {
            alert('请搜索并选择一个方块');
            return;
        }
        if (isNaN(speed) || speed < 0) {
            alert('请输入有效的挖掘速度（≥ 0）');
            return;
        }

        if (toolRules.some(r => r.blockId === blockId)) {
            alert('该方块已添加规则，不能重复');
            return;
        }

        toolRules.push({
            id: ++toolRuleIdCounter,
            blockId: blockId,
            speed: speed,
            correctDrop: correctDrop,
        });
        renderToolRuleList(toolRuleList);
        toolBlockSearch.value = '';
        toolRuleSpeed.value = '';
        toolBlockSuggestions.style.display = 'none';
    });

    toolRuleSpeed.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addToolRuleBtn.click();
        }
    });
}