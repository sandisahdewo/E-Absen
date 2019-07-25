import axios from 'axios'
import {RootPath} from '../config/path'

const config = {
  headers: {
    'Accept': 'application/json'
  }
}

const Get = (path) => {
  const promise = new Promise((resolve, reject) => {
    axios.get(`${RootPath}/${path}`, config)
         .then(res => {
            resolve(res.data)
         })
         .catch(err => {
            reject(err)
         })
  })
  return promise
}

export default Get