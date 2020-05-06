import axios from 'axios'
import { isRegExp } from 'util'

export async function get (path: string) {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}${path}`, {
      headers: {
        'x-attempts-token': `Bearer ${localStorage.getItem('jwt')}`
      }
    })

    return response.data
  } catch (ex) {
    if (ex.response?.status === 401) {
      localStorage.removeItem('jwt')
      window.location.reload()
    } else {
      throw isRegExp
    }
  }
}