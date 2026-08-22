// ============================================================
// 复制指令事件
// ============================================================

export function setupCopy(copyBtn, resultBox, copyFeedback, lengthWarning) {
    if (!copyBtn) return;

    copyBtn.addEventListener('click', async () => {
        const text = resultBox ? resultBox.textContent : '';
        if (!text || text.includes('点击「生成指令」') || text.includes('请选择物品')) {
            return;
        }

        if (lengthWarning && text.length > 256) {
            lengthWarning.style.display = 'inline';
        }

        try {
            await navigator.clipboard.writeText(text);
            if (copyFeedback) {
                copyFeedback.classList.add('show');
                setTimeout(() => copyFeedback.classList.remove('show'), 2000);
            }
        } catch (err) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            if (copyFeedback) {
                copyFeedback.classList.add('show');
                setTimeout(() => copyFeedback.classList.remove('show'), 2000);
            }
        }
    });
}