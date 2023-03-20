import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
export default function useTime() {
  function fromNow(date) {
    if (!Number.isNaN(date - 0)) {
      date = date - 0
    }
    if (typeof date === 'number') {
      if (date < 1e11) {
        date = date * 1000
      }
    }
    return dayjs(date).fromNow()
  }

  function formatTime(date) {
    if (typeof date === 'number') {
      if (date < 1e11) {
        date = date * 1000
      }
    }
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  }

  return {
    fromNow,
    formatTime,
  }
}
