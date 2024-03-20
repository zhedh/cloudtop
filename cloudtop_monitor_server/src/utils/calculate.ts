/**
 * 计算比率
 * @param numerator 分子
 * @param denominator 分母
 * @param fixed 保留小数的位数
 * @returns
 */
export const calculateRatio = (
  numerator: number,
  denominator: number,
  fixed = 4
): number => {
  if (denominator === 0) return 0

  return Number((numerator / denominator).toFixed(fixed))
}

/**
 * 计算增长率
 * @param num1
 * @param num2
 * @param fixed
 * @returns
 */
export const calculateGrowthRate = (num1: number, num2: number, fixed = 4) => {
  if (!num2) return null

  return Number(((num1 - num2) / num2).toFixed(fixed))
}

/**
 * 计算健康得分
 * @param radio 报错率
 * @returns
 */
export const calculateScore = (radio: number) => {
  if (radio <= 0.5 / 100) return 100 // 当报错率 ≤ 0.5%，得分100
  if (radio < 10 / 100) return 100 - 10 * radio * 100 // 当 0.5% < 报错率 < 10%，得分：100 - 10 × 报错率
  return 0 // 当报错率 ≥ 10%，得分 = 0
}

/**
 * 计算耗时得分
 * @param time 毫秒
 */
export const calculateTimeScore = (time: number) => {
  if (time <= 1000) return 100 // 小于等于 1000ms，100分
  const score = 100 - (time - 1000) * 100 // 当报错率 ≥ 10%，得分 = 0
  return score > 0 ? score : 0
}
