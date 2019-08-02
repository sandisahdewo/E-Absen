import {Post, Get} from './methods'

const Checkin = (data) => Post('apel_checkins', data)
const FindLastCheckinToday = (userId) => Get(`apels/find-last-checkin-user/${userId}`)
const FindApelToday = () => Get('apels-today')

const Apel = {
  Checkin,
  FindLastCheckinToday,
  FindApelToday
}

export default Apel