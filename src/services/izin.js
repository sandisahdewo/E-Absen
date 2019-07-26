import {Post, Get} from './methods'

const getJenisIzin = () => Get('jenis_izins')
const postIzin = (data) => Post('izins', data, { 'Content-Type' : 'multipart/form-data' })

const Izin = {
  getJenisIzin,
  postIzin
}

export default Izin