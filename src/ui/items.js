// ============================================================
// 物品搜索建议 (支持下拉选择 + 输入过滤)
// ============================================================

import { getDOM } from './dom.js';

let allItems = [];
let filteredItems = [];
let isDropdownOpen = false;

// 获取当前版本的所有物品
export function getItems() {
    return allItems;
}

// 加载物品数据
export async function loadItems(version) {
    try {
        const response = await fetch(`src/data/items/${version}.json`);
        if (!response.ok) {
            // 如果文件不存在，尝试加载默认版本
            console.warn(`⚠️ 版本 ${version} 的物品数据不存在，尝试加载 1.21 数据`);
            const fallbackResponse = await fetch('src/data/items/1.21.json');
            if (!fallbackResponse.ok) throw new Error('加载默认物品数据失败');
            allItems = await fallbackResponse.json();
        } else {
            allItems = await response.json();
        }
        // 按名称排序
        allItems.sort((a, b) => a.name.localeCompare(b.name));
        console.log(`✅ 已加载 ${allItems.length} 个物品 (版本 ${version})`);
        return allItems;
    } catch (error) {
        console.error('加载物品失败:', error);
        allItems = [];
        return [];
    }
}

// 过滤物品（根据输入文本匹配ID或名称）
function filterItems(query) {
    if (!query.trim()) {
        return allItems.slice(0, 50);
    }
    const lowerQuery = query.toLowerCase().trim();
    return allItems.filter(item =>
        item.id.toLowerCase().includes(lowerQuery) ||
        item.name.includes(lowerQuery)
    ).slice(0, 100);
}

// 渲染下拉列表
function renderDropdown(items, searchInput) {
    const dom = getDOM();
    const { suggestionsBox } = dom;

    if (items.length === 0) {
        suggestionsBox.innerHTML = '<div class="no-results">❌ 没有找到匹配的物品</div>';
        suggestionsBox.style.display = 'block';
        return;
    }

    suggestionsBox.innerHTML = items.map(item =>
        `<div class="suggestion-item" data-id="${item.id}">
            <span style="color:#8ab0d0;">${item.id}</span>
            <span style="color:#556;font-size:12px;margin-left:8px;">— ${item.name}</span>
        </div>`
    ).join('');
    suggestionsBox.style.display = 'block';

    document.querySelectorAll('.suggestion-item').forEach(el => {
        el.addEventListener('click', () => {
            searchInput.value = el.dataset.id;
            suggestionsBox.style.display = 'none';
            isDropdownOpen = false;
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        });
    });
}

// 设置物品搜索
export function setupItemSearch() {
    const dom = getDOM();
    const { itemSearch, suggestionsBox } = dom;

    itemSearch.addEventListener('input', () => {
        const query = itemSearch.value;
        filteredItems = filterItems(query);
        renderDropdown(filteredItems, itemSearch);
        isDropdownOpen = true;
    });

    itemSearch.addEventListener('focus', () => {
        if (allItems.length === 0) return;
        const query = itemSearch.value;
        filteredItems = filterItems(query);
        renderDropdown(filteredItems, itemSearch);
        isDropdownOpen = true;
    });

    itemSearch.addEventListener('blur', () => {
        setTimeout(() => {
            suggestionsBox.style.display = 'none';
            isDropdownOpen = false;
        }, 200);
    });

    itemSearch.addEventListener('keydown', (e) => {
        const items = suggestionsBox.querySelectorAll('.suggestion-item');
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
            const selected = suggestionsBox.querySelector('.suggestion-item.selected');
            if (selected) {
                itemSearch.value = selected.dataset.id;
                suggestionsBox.style.display = 'none';
                isDropdownOpen = false;
                itemSearch.dispatchEvent(new Event('input', { bubbles: true }));
            }
        } else if (e.key === 'Escape') {
            suggestionsBox.style.display = 'none';
            isDropdownOpen = false;
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.item-search-wrapper')) {
            suggestionsBox.style.display = 'none';
            isDropdownOpen = false;
        }
    });
}

export function getFilteredItems() {
    return filteredItems;
}