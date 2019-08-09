import {Post, Get} from './methods'

const Checkin = (data) => Post('apel_checkins', data)
const FindLastCheckinToday = (userId) => Get(`apels/find-last-checkin-user/${userId}`)
const FindApelToday = () => Get('apels-today')
const FindApelOrIzinTodayByUserId = (userId) => Get(`apels/find-apel-or-izin-today-by-userid/${userId}`)

const Apel = {
  Checkin,
  FindLastCheckinToday,
  FindApelToday,
  FindApelOrIzinTodayByUserId
}

export default Apel