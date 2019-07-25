import {Post, Get} from './methods'

const Checkin = (data) => Post('apel_checkins', data)
const FindLastCheckinToday = (userId) => Get(`apel_checkins/user-last-checkin-today/${userId}`)

const Apel = {
  Checkin,
  FindLastCheckinToday
}

export default Apel