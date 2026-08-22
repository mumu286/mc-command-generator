/**
 * 生成 /give 命令（极简版）
 * @param {string} version - 游戏版本，如 "1.20.4" 或 "1.21"
 * @param {object} config - 用户配置
 * @param {string} config.targets - 目标选择器，默认 "@s"
 * @param {string} config.item - 物品ID，必填
 * @param {number} config.count - 数量，默认 1
 * @returns {string} 生成的完整命令
 */
export function generateGive(version, config) {
  // 解构配置，提供默认值
  const { targets = '@s', item, count = 1 } = config;

  // 基本校验
  if (!item) {
    throw new Error('物品ID不能为空');
  }

  // 构建命令（版本差异目前只影响数量上限，但我们先忽略）
  let command = `/give ${targets} ${item}`;

  // 如果数量不为1，则加上数量参数
  if (count > 1) {
    command += ` ${count}`;
  }

  return command;
}