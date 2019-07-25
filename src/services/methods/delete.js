import axios from 'axios'
import {RootPath} from '../config/path'

const config = {
  headers: {
    'Accept' : 'application/json'
  }
}

const Delete = (path, id) => {
  const promise = new Promise((resolve, reject) => {
    axios.delete(`${RootPath}/${path}/${id}`, config)
         .then(res => {
            resolve(res.data)
         })
         .catch(err => {
            reject(err)
         })
  })
  return promise
}

export default Delete