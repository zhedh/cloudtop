export const formatPercent = (radio: number): string => {
  return (radio * 100).toFixed(2)
}

export const formatElapsedTime = (elapsedTime: number, fixed = 2): string => {
  if (elapsedTime >= 1000) {
    return (elapsedTime / 1000).toFixed(fixed) + 's'
  }

  return elapsedTime.toFixed(fixed) + 'ms'
}
