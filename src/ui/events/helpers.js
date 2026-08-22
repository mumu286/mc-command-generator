// ============================================================
// 辅助函数 (预览更新 + 乱码动效 + 样式读取)
// ============================================================

import { getDOM } from '../dom.js';

// ----- 乱码字符集（日文平假名 + 片假名 + 韩文音节） -----
const OBFUSCATED_CHARS =
    // 日文平假名 (46个)
    'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん' +
    // 日文片假名 (46个)
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
    // 韩文音节 (常用组合，约50个)
    '가나다라마바사아자차카타파하' +
    '거너더러머버서어저처커터퍼허' +
    '겨녀려며벼셔여져쳐켜텨펴혀' +
    '고노도로모보소오조초코토포호';

// 随机获取一个乱码字符
function getRandomObfuscatedChar() {
    return OBFUSCATED_CHARS[Math.floor(Math.random() * OBFUSCATED_CHARS.length)];
}

// 对文本应用乱码效果（每个字符替换为随机日/韩字符）
function applyObfuscated(text) {
    if (!text) return '';
    return text.split('').map(() => getRandomObfuscatedChar()).join('');
}

// ----- 获取某个字段的样式配置（修复版，更健壮） -----
export function getFieldStyle(fieldElement) {
    // 默认样式
    const defaultStyle = { bold: false, italic: false, underline: false, strikethrough: false, obfuscated: false, color: 'white' };
    
    if (!fieldElement) return defaultStyle;

    // 方法1：通过 data-target 属性直接查找对应的工具栏
    const fieldId = fieldElement.id || '';
    let targetName = '';
    if (fieldId.endsWith('Input')) {
        targetName = fieldId.replace('Input', ''); // displayNameInput -> displayName
    } else {
        targetName = fieldId;
    }
    // 查找 data-target 匹配的 .style-toolbar
    let toolbar = document.querySelector(`.style-toolbar[data-target="${targetName}"]`);
    if (toolbar) {
        return readToolbarStyles(toolbar);
    }

    // 方法2：通过最近的 .text-field-group 查找
    let group = fieldElement.closest('.text-field-group');
    if (!group) {
        // 手动向上遍历父级
        let parent = fieldElement.parentElement;
        while (parent) {
            if (parent.classList && parent.classList.contains('text-field-group')) {
                group = parent;
                break;
            }
            parent = parent.parentElement;
        }
    }
    if (group) {
        toolbar = group.querySelector('.style-toolbar');
        if (toolbar) {
            return readToolbarStyles(toolbar);
        }
    }

    // 方法3：如果仍然找不到，尝试通过输入框的 name 属性或类名匹配
    // 这里不再继续，直接返回默认
    return defaultStyle;
}

// 从工具栏读取样式
function readToolbarStyles(toolbar) {
    const bold = toolbar.querySelector('.style-bold')?.checked || false;
    const italic = toolbar.querySelector('.style-italic')?.checked || false;
    const underline = toolbar.querySelector('.style-underline')?.checked || false;
    const strikethrough = toolbar.querySelector('.style-strikethrough')?.checked || false;
    const obfuscated = toolbar.querySelector('.style-obfuscated')?.checked || false;
    const color = toolbar.querySelector('.style-color')?.value || 'white';
    return { bold, italic, underline, strikethrough, obfuscated, color };
}

// ----- 预览更新（含乱码动效） -----
export function setupPreview() {
    const dom = getDOM();
    const {
        displayNameInput,
        itemNameInput,
        loreInput,
        previewContent,
    } = dom;

    // 动画循环控制
    let animationId = null;
    let isLoopRunning = false;

    // 检查是否有任何字段启用了乱码
    function checkAnyObfuscated() {
        const displayStyle = getFieldStyle(displayNameInput);
        const itemStyle = getFieldStyle(itemNameInput);
        const loreStyle = getFieldStyle(loreInput);
        return displayStyle.obfuscated || itemStyle.obfuscated || loreStyle.obfuscated;
    }

    // 更新预览（内部函数，会被动画循环调用）
    function renderPreview() {
        const displayText = displayNameInput.value.trim();
        const itemText = itemNameInput.value.trim();
        const loreText = loreInput.value.trim();

        const displayStyle = getFieldStyle(displayNameInput);
        const itemStyle = getFieldStyle(itemNameInput);
        const loreStyle = getFieldStyle(loreInput);

        let html = '';

        function buildPreviewLine(text, style) {
            if (!text) return '';

            let displayText = text;
            if (style.obfuscated) {
                displayText = applyObfuscated(text);
            }

            const fontWeight = style.bold ? 'bold' : 'normal';
            const fontStyle = style.italic ? 'italic' : 'normal';
            const textDecoration = [];
            if (style.underline) textDecoration.push('underline');
            if (style.strikethrough) textDecoration.push('line-through');
            const textDecorationStr = textDecoration.length ? textDecoration.join(' ') : 'none';
            const color = style.color;

            return `<div class="preview-line" style="
                font-weight: ${fontWeight};
                font-style: ${fontStyle};
                text-decoration: ${textDecorationStr};
                color: ${color};
                ${style.obfuscated ? 'text-shadow: 0 0 2px rgba(255,255,255,0.3);' : ''}
            ">${displayText}</div>`;
        }

        if (displayText) html += buildPreviewLine(displayText, displayStyle);
        if (itemText) html += buildPreviewLine(itemText, itemStyle);
        if (loreText) html += buildPreviewLine(loreText, loreStyle);

        if (!html) {
            html = '<span style="color:#556;font-style:italic;">输入文本后预览效果</span>';
        }

        previewContent.innerHTML = html;
    }

    // 启动动画循环
    function startObfuscationLoop() {
        if (isLoopRunning) return;

        function loop() {
            if (!checkAnyObfuscated()) {
                isLoopRunning = false;
                animationId = null;
                renderPreview();
                return;
            }
            renderPreview();
            animationId = requestAnimationFrame(loop);
        }

        isLoopRunning = true;
        loop();
    }

    // 停止动画循环
    function stopObfuscationLoop() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        isLoopRunning = false;
    }

    // 更新预览并控制循环
    function updatePreviewAndLoop() {
        renderPreview();
        if (checkAnyObfuscated()) {
            startObfuscationLoop();
        } else {
            stopObfuscationLoop();
        }
    }

    // ---------- 绑定事件 ----------
    displayNameInput.addEventListener('input', updatePreviewAndLoop);
    itemNameInput.addEventListener('input', updatePreviewAndLoop);
    loreInput.addEventListener('input', updatePreviewAndLoop);

    document.querySelectorAll('.style-toolbar').forEach(toolbar => {
        toolbar.addEventListener('change', updatePreviewAndLoop);
    });

    // 初始渲染
    updatePreviewAndLoop();

    return function cleanup() {
        stopObfuscationLoop();
        displayNameInput.removeEventListener('input', updatePreviewAndLoop);
        itemNameInput.removeEventListener('input', updatePreviewAndLoop);
        loreInput.removeEventListener('input', updatePreviewAndLoop);
    };
}