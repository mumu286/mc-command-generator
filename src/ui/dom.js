// ============================================================
// DOM 元素引用 (惰性获取)
// ============================================================

export function getDOM() {
    return {
        // 主控件
        versionSelect: document.getElementById('versionSelect'),
        targetSelect: document.getElementById('targetSelect'),
        targetManual: document.getElementById('targetManual'),
        itemSearch: document.getElementById('itemSearch'),
        countInput: document.getElementById('countInput'),
        damageInput: document.getElementById('damageInput'),
        unbreakableCheck: document.getElementById('unbreakableCheck'),
        unbreakableHint: document.getElementById('unbreakableHint'),
        generateBtn: document.getElementById('generateBtn'),
        resultBox: document.getElementById('result'),
        copyBtn: document.getElementById('copyBtn'),
        copyFeedback: document.getElementById('copyFeedback'),
        lengthWarning: document.getElementById('lengthWarning'),
        suggestionsBox: document.getElementById('suggestions'),

        // 三个文本字段
        displayNameInput: document.getElementById('displayNameInput'),
        itemNameInput: document.getElementById('itemNameInput'),
        loreInput: document.getElementById('loreInput'),

        // 预览
        previewContent: document.getElementById('previewContent'),

        // 附魔
        enchantSelect: document.getElementById('enchantSelect'),
        enchantCustom: document.getElementById('enchantCustom'),
        enchantLevel: document.getElementById('enchantLevel'),
        addEnchantBtn: document.getElementById('addEnchantBtn'),
        enchantListEl: document.getElementById('enchantList'),
        glintCheck: document.getElementById('glintCheck'),

        // 属性
        attrTypeSelect: document.getElementById('attrTypeSelect'),
        attrCustomId: document.getElementById('attrCustomId'),
        attrAmountInput: document.getElementById('attrAmountInput'),
        attrOperationSelect: document.getElementById('attrOperationSelect'),
        attrSlotSelect: document.getElementById('attrSlotSelect'),
        addAttrBtn: document.getElementById('addAttrBtn'),
        attrListEl: document.getElementById('attrList'),

        // 方块
        blockSearch: document.getElementById('blockSearch'),
        blockTypeSelect: document.getElementById('blockTypeSelect'),
        addBlockBtn: document.getElementById('addBlockBtn'),
        blockListEl: document.getElementById('blockList'),
        blockSuggestions: document.getElementById('blockSuggestions'),

        // 基础
        raritySelect: document.getElementById('raritySelect'),
        maxDamageInput: document.getElementById('maxDamageInput'),
        maxStackInput: document.getElementById('maxStackInput'),
        repairCostInput: document.getElementById('repairCostInput'),

        // 食物消耗
        foodNutrition: document.getElementById('foodNutrition'),
        foodSaturation: document.getElementById('foodSaturation'),
        foodCanAlwaysEat: document.getElementById('foodCanAlwaysEat'),
        foodEatSeconds: document.getElementById('foodEatSeconds'),
        foodClearEffects: document.getElementById('foodClearEffects'),
        foodUseCooldown: document.getElementById('foodUseCooldown'),

        // 食用效果
        effectTypeSelect: document.getElementById('effectTypeSelect'),
        effectSearch: document.getElementById('effectSearch'),
        effectSuggestions: document.getElementById('effectSuggestions'),
        effectProbability: document.getElementById('effectProbability'),
        effectDiameter: document.getElementById('effectDiameter'),
        effectDuration: document.getElementById('effectDuration'),
        effectAmplifier: document.getElementById('effectAmplifier'),
        addEffectBtn: document.getElementById('addEffectBtn'),
        effectListEl: document.getElementById('effectList'),

        // 工具规则
        toolEnabled: document.getElementById('toolEnabled'),
        toolDefaultSpeed: document.getElementById('toolDefaultSpeed'),
        toolDamagePerBlock: document.getElementById('toolDamagePerBlock'),
        toolBlockSearch: document.getElementById('toolBlockSearch'),
        toolBlockSuggestions: document.getElementById('toolBlockSuggestions'),
        toolRuleSpeed: document.getElementById('toolRuleSpeed'),
        toolRuleCorrectDrop: document.getElementById('toolRuleCorrectDrop'),
        addToolRuleBtn: document.getElementById('addToolRuleBtn'),
        toolRuleList: document.getElementById('toolRuleList'),
    };
}
