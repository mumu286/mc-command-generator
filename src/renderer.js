// ============================================================
// Minecraft 指令生成器 - 渲染进程 (主入口)
// ============================================================

import { getDOM } from './ui/dom.js';
import { loadItems, setupItemSearch } from './ui/items.js';
import { setupEnchantmentManager } from './ui/enchantments.js';
import { setupAttributeManager } from './ui/attributes.js';
import { setupBlockManager } from './ui/blocks.js';
import { setupEvents } from './ui/events/index.js';

async function loadTemplates() {
    const app = document.getElementById('app');
    try {
        const [leftPanel, rightPanel, bottomPanel] = await Promise.all([
            fetch('src/templates/left-panel.html').then(r => {
                if (!r.ok) throw new Error('left-panel.html 加载失败');
                return r.text();
            }),
            fetch('src/templates/right-panel/index.html').then(r => {
                if (!r.ok) throw new Error('right-panel/index.html 加载失败');
                return r.text();
            }),
            fetch('src/templates/bottom-panel.html').then(r => {
                if (!r.ok) throw new Error('bottom-panel.html 加载失败');
                return r.text();
            })
        ]);
        app.innerHTML = leftPanel + rightPanel + bottomPanel;

        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            const headerHtml = await fetch('src/templates/header.html').then(r => {
                if (!r.ok) throw new Error('header.html 加载失败');
                return r.text();
            });
            headerContainer.innerHTML = headerHtml;
        }

        // 加载右侧各选项卡
        const tabContentContainer = document.getElementById('tabContentContainer');
        if (tabContentContainer) {
            const tabFiles = [
                'tab-enchant.html',
                'tab-attribute.html',
                'tab-block.html',
                'tab-base.html',
                'tab-food.html',
            ];
            const tabContents = await Promise.all(
                tabFiles.map(file => 
                    fetch(`src/templates/right-panel/${file}`).then(r => {
                        if (!r.ok) throw new Error(`${file} 加载失败`);
                        return r.text();
                    })
                )
            );
            tabContentContainer.innerHTML = tabContents.join('');
        }
        console.log('✅ 模板加载完成');
        return true;
    } catch (error) {
        console.error('❌ 模板加载失败:', error);
        app.innerHTML = `
            <div style="color:#f66;text-align:center;padding:40px;background:#16213e;border-radius:16px;border:1px solid #0f3460;">
                <h2 style="color:#f66;">❌ 模板加载失败</h2>
                <p style="color:#8899aa;">错误详情: ${error.message}</p>
            </div>
        `;
        return false;
    }
}

async function init() {
    const loaded = await loadTemplates();
    if (!loaded) return;
    
    const dom = getDOM();
    const { versionSelect } = dom;
    
    // 首次加载物品数据
    await loadItems(versionSelect.value);
    
    const enchantManager = setupEnchantmentManager();
    const attrManager = setupAttributeManager();
    const blockManager = setupBlockManager();
    
    // 版本切换时重新加载数据并清空列表
    versionSelect.addEventListener('change', () => {
        loadItems(versionSelect.value);
        enchantManager.clearEnchantments();
        attrManager.clearAttributes();
        blockManager.clearBlocks();
    });
    
    setupItemSearch();
    setupEvents();
    
    console.log('🚀 Minecraft 指令生成器已启动');
}

init();