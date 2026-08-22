// ============================================================
// 方块管理 (can_place_on / can_break)
// ============================================================

import { getDOM } from './dom.js';
import { getItems } from './items.js';

let blocks = [];

export const BLOCK_TYPES = [
    { value: 'place', label: '可放置于' },
    { value: 'break', label: '可破坏' },
    { value: 'both', label: '两者兼具' },
];

export function getBlocks() {
    return blocks;
}

export function setupBlockManager() {
    const dom = getDOM();
    const {
        blockSearch,
        blockTypeSelect,
        addBlockBtn,
        blockListEl,
        blockSuggestions,
    } = dom;

    // ---------- 搜索建议 ----------
    let filteredItems = [];

    function renderSuggestions(query) {
        if (!query.trim()) {
            blockSuggestions.style.display = 'none';
            return;
        }
        const lowerQuery = query.toLowerCase().trim();
        const allItems = getItems();
        // 如果物品数据为空，尝试提示用户
        if (allItems.length === 0) {
            blockSuggestions.innerHTML = '<div class="no-results">⏳ 物品数据加载中，请稍后...</div>';
            blockSuggestions.style.display = 'block';
            return;
        }
        filteredItems = allItems.filter(item =>
            item.id.toLowerCase().includes(lowerQuery) ||
            item.name.includes(lowerQuery)
        ).slice(0, 12);

        if (filteredItems.length === 0) {
            blockSuggestions.innerHTML = '<div class="no-results">❌ 没有找到匹配的方块</div>';
            blockSuggestions.style.display = 'block';
            return;
        }

        blockSuggestions.innerHTML = filteredItems.map(item =>
            `<div class="suggestion-item" data-id="${item.id}">
                <span style="color:#8ab0d0;">${item.id}</span>
                <span style="color:#556;font-size:12px;margin-left:8px;">— ${item.name}</span>
            </div>`
        ).join('');
        blockSuggestions.style.display = 'block';

        document.querySelectorAll('#blockSuggestions .suggestion-item').forEach(el => {
            el.addEventListener('click', () => {
                blockSearch.value = el.dataset.id;
                blockSuggestions.style.display = 'none';
                blockSearch.dispatchEvent(new Event('input', { bubbles: true }));
            });
        });
    }

    blockSearch.addEventListener('input', () => {
        renderSuggestions(blockSearch.value);
    });

    blockSearch.addEventListener('focus', () => {
        if (blockSearch.value.trim()) {
            renderSuggestions(blockSearch.value);
        }
    });

    blockSearch.addEventListener('blur', () => {
        setTimeout(() => {
            blockSuggestions.style.display = 'none';
        }, 200);
    });

    blockSearch.addEventListener('keydown', (e) => {
        const items = blockSuggestions.querySelectorAll('.suggestion-item');
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
            const selected = blockSuggestions.querySelector('.suggestion-item.selected');
            if (selected) {
                blockSearch.value = selected.dataset.id;
                blockSuggestions.style.display = 'none';
                blockSearch.dispatchEvent(new Event('input', { bubbles: true }));
            } else {
                addBlockBtn.click();
            }
        } else if (e.key === 'Escape') {
            blockSuggestions.style.display = 'none';
        }
    });

    // ---------- 渲染方块列表 ----------
    function renderBlockList() {
        if (blocks.length === 0) {
            blockListEl.innerHTML = '<div class="block-empty">还没有添加方块</div>';
            return;
        }

        blockListEl.innerHTML = blocks.map((block, index) => {
            const typeLabel = BLOCK_TYPES.find(t => t.value === block.type)?.label || block.type;
            const allItems = getItems();
            const itemInfo = allItems.find(i => i.id === block.blockId);
            const displayName = itemInfo ? itemInfo.name : block.blockId;
            return `<div class="block-tag">
                        <span class="block-name">${displayName} (${typeLabel})</span>
                        <button data-index="${index}" class="remove-block">✕</button>
                    </div>`;
        }).join('');

        document.querySelectorAll('.remove-block').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                blocks.splice(index, 1);
                renderBlockList();
            });
        });
    }

    // ---------- 添加方块 ----------
    addBlockBtn.addEventListener('click', () => {
        const blockId = blockSearch.value.trim();
        const type = blockTypeSelect.value;

        if (!blockId) {
            alert('请搜索并选择一个方块');
            return;
        }

        if (blocks.some(b => b.blockId === blockId && b.type === type)) {
            alert('该方块已添加，不能重复');
            return;
        }

        blocks.push({ blockId, type });
        renderBlockList();
        blockSearch.value = '';
        blockSuggestions.style.display = 'none';
    });

    // 初始渲染
    renderBlockList();

    return { renderBlockList, clearBlocks: () => { blocks = []; renderBlockList(); } };
}