// ============================================================
// 标签切换 (主标签 + 食物子标签)
// ============================================================

import { resetFoodSubTabs } from './utils.js';

export function setupTabSwitching() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            const targetPane = document.getElementById(`tab-${tabId}`);
            if (targetPane) targetPane.classList.add('active');

            if (tabId === 'food') {
                resetFoodSubTabs();
            }
        });
    });
}

export function setupFoodSubTabs() {
    document.querySelectorAll('.food-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.food-tab-btn').forEach(b => {
                b.style.opacity = '0.6';
                b.classList.remove('active');
            });
            btn.style.opacity = '1';
            btn.classList.add('active');
            const tabId = btn.dataset.foodtab;
            document.querySelectorAll('.food-sub-panel').forEach(pane => {
                pane.style.display = 'none';
            });
            const targetPane = document.getElementById(`food-${tabId}`);
            if (targetPane) targetPane.style.display = 'block';
        });
    });

    // 初始状态
    resetFoodSubTabs();
}