import {Get} from './methods'

const GetStatistik = (satkerId) => Get(`statistik-apel/v3/${satkerId}`)

const StatistikApel = {
  GetStatistik
}

export default StatistikApel