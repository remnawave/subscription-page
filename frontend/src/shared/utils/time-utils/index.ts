import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(duration)
dayjs.extend(timezone)

export * from './s-to-ms/s-to-ms.util'
