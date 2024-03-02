import axiosClient from './axiosClient'

export const signInAPI = async (payload) => {
  const data = await axiosClient.post('/auth/login', payload);

  return data
}
