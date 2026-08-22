// ============================================================
// 辅助函数
// ============================================================

/**
 * 构建文本组件 JSON 数组字符串（每个字符独立对象）
 * 返回格式： '[{"text":"字1"},{"text":"字2"}]'
 */
export function buildTextComponentArray(text, style) {
    if (!text) return null;
    const parts = [];
    for (const char of text) {
        const obj = { text: char };
        if (style.bold) obj.bold = true;
        if (style.italic) obj.italic = true;
        if (style.underline) obj.underlined = true;
        if (style.strikethrough) obj.strikethrough = true;
        if (style.obfuscated) obj.obfuscated = true;
        if (style.color && style.color !== 'white') {
            obj.color = style.color;
        }
        parts.push(obj);
    }
    return JSON.stringify(parts);
}