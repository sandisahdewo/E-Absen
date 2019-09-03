import {Post} from './methods'

const changePassword = (formData, userId) => Post(`change-password/${userId}`, formData)

const User = {
  changePassword
}

export default User