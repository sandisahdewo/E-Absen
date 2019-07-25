import {Post, Get} from './methods'

const getJenisIzin = () => Get('jenis_izins')

const Izin = {
  getJenisIzin,
}

export default Izin