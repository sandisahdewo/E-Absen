import AsyncStorage from '@react-native-community/async-storage'

const setUserLogin = async (user) => {
  await AsyncStorage.setItem('user', JSON.stringify(user))
}

const getUserLogin = async () => {
  const user = await AsyncStorage.getItem('user')
  const parseUser = JSON.parse(user)
  return parseUser
}

const removeUserLogin = async () => {
  await AsyncStorage.removeItem('user')
}

const StorageUser = {
  setUserLogin,
  getUserLogin,
  removeUserLogin
}

export default StorageUser