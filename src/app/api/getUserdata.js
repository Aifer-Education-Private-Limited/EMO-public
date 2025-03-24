import jwt from 'jsonwebtoken'
import axios from '../constants/axios'
export async function getUser() {
  let user = ''
  const token = localStorage.getItem('studentToken')
  if (token) {
    const decode = jwt.decode(token)
    if (decode) {
      const userId = decode.id
      const data = await axios.get(`/getUser/${userId}`)

      user = data.data.data[0]
    }
  }

  return user
}