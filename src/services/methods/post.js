import axios from 'axios'
import {RootPath} from '../config/path'

const config = {
  headers: {
    'Accept': 'application/json'
  }
}

const Post = (path, data, customHeader = {}) => {
  const promise = new Promise((resolve, reject) => {
    axios.post(`${RootPath}/${path}`, data, {...config, ...customHeader})
         .then(res => {
            resolve(res.data)
         })
         .catch(err => {
            reject(err)
         })
  })

  return promise
}

export default Post