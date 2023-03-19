import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
export default function useTime() {
  function fromNow(date) {
    if (typeof date === 'number') {
      if (date < 1e11) {
        date = date * 1000
      }
    }
    return dayjs(date).fromNow()
  }
  return {
    fromNow,
  }
}