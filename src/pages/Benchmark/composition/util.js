const thousands = (num) => {
  return num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}

const formatNumWithUnit = (num) => {
  if (num < 10000) return `${num}`
  else if (num < 10000000) return `${Math.floor(num / 1000)}K`
  else if (num < 10000000000) return `${Math.floor(num / 1000000)}M`
  else if (num < 10000000000000) return `${Math.floor(num / 1000000000)}G`
  else if (num < 10000000000000000) return `${Math.floor(num / 1000000000000)}T`
}

const formatTime = (num) => {
  const hour = Math.floor(num / 60 / 24)
  const minute = Math.floor(num % (60 * 24) / 60)
  const second = num % (60 * 24) % 60
  const hourStr = `${hour}`.padStart(2, '0')
  const minuteStr = `${minute}`.padStart(2, '0')
  const secondStr = `${second}`.padStart(2, '0')
  return `${hourStr}:${minuteStr}.${secondStr}`
}

export {
  thousands,
  formatNumWithUnit,
  formatTime
}
