import jwt from 'jsonwebtoken'
import axios from '../constants/axios'

export async function getUserCourses() {
  let courses = ''
  const token = localStorage.getItem('studentToken')
  if (token) {
    const decode = jwt.decode(token)
    if (decode) {
      const userId = decode.id
      const {data} = await axios.get(`/getUserCourses/${userId}`)

      courses = data;
    }
  }

  return courses
}