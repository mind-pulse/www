// 添加指定天数
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// 减去指定天数
export const subtractDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

// 添加指定月数
export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

// 减去指定月数
export const subtractMonths = (date: Date, months: number): Date => {
  const result = new Date(date)
  result.setMonth(result.getMonth() - months)
  return result
}

// 添加指定年数
export const addYears = (date: Date, years: number): Date => {
  const result = new Date(date)
  result.setFullYear(result.getFullYear() + years)
  return result
}

// 减去指定年数
export const subtractYears = (date: Date, years: number): Date => {
  const result = new Date(date)
  result.setFullYear(result.getFullYear() - years)
  return result
}
