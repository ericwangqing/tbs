const thousands = (num) => {
  return num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}

const formatNumWithUnit = (num) => {
  if (num < 10000) return `${num}`
  else if (num < 100000000) return `${Math.floor(num / 1000)}K`
  else if (num < 100000000000) return `${Math.floor(num / 1000000)}M`
  else if (num < 100000000000000) return `${Math.floor(num / 1000000000)}G`
  else if (num < 100000000000000000) return `${Math.floor(num / 1000000000000)}T`
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

const formatTimeRange = (range) => {
  return formatDayTime(range[0]) +  ' ~ ' + formatDayTime(range[1])
}

const formatDayTime = (timestamp) => {
  return 'Jan/01/2022'
}

// keep three units, e.g.: 3 years 2 months 1 day, 2 days 3 hours 52 minutes.
const formatDayTimeWithUnit = (dayTime) => {
  return '3 years 2 months 1 day'
}

const randomBetween = (min, max, precision = 0) => {
  const p = Math.pow(10, precision)
  return Math.round((min + Math.random() * (max - min)) * p) / p
}

const getRandomHex = (size) => {
  return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
}

const getPublicKeyString = () => {
  return '0x' + getRandomHex(128)
}

const getAddressKeyString = () => {
  return '0x' + getRandomHex(32)
}

export {
  thousands,
  formatNumWithUnit,
  formatTime,
  formatTimeRange,
  formatDayTimeWithUnit,
  randomBetween,
  getPublicKeyString,
  getAddressKeyString
}
