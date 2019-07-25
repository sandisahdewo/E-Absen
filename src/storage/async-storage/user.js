import AsyncStorage from '@react-native-community/async-storage'

const setUserLogin = async (user) => {
  await AsyncStorage.setItem('user', JSON.stringify(user))
}

const getUserLogin = async () => {
  const user = await AsyncStorage.getItem('user')
  const parseUser = JSON.parse(user)
  return parseUser
}

const StorageUser = {
  setUserLogin,
  getUserLogin
}

export default StorageUser