import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

const thousands = (num) => {
  return num.toString().split('.')[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}

const formatNumWithUnit = (num) => {
  if (num < 10000) return `${num}`
  else if (num < 10000000) return `${Math.floor(num / 100) / 10}K`
  else if (num < 10000000000) return `${Math.floor(num / 100000) / 10}M`
  else if (num < 10000000000000) return `${Math.floor(num / 100000000) / 10}G`
  else if (num < 10000000000000000) return `${Math.floor(num / 100000000000) / 10}T`
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
  return dayjs(timestamp).format('MM/DD/YYYY')
}

// keep three units, e.g.: 3 years 2 months 1 day, 2 days 3 hours 52 minutes.
const formatDayTimeWithUnit = (dayTime) => {
  const duration = dayjs.duration(dayTime, 's')
  const timeUnits = ['years', 'months', 'days', 'hours', 'minutes', 'seconds']
  let res = ''
  let t = 0
  for (let i = 0; i < timeUnits.length; i++) {
    const val = duration[`${timeUnits[i]}`]()
    if (val) {
      res += val + timeUnits[i]
      t++
    }
    if (val === 1) res.substring(0, res.length - 1)
    res += ' '
    if (t === 3) break
  }
  res.substring(0, res.length - 1)
  return res
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
