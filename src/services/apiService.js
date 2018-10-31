const HOSTNAME = (typeof process.env.HOSTNAME !== 'undefined') ? process.env.HOSTNAME : 'https://attempts.herokuapp.com'
const PORT = (typeof process.env.PORT !== 'undefined') ? process.env.PORT : 80
let API_URL
if (PORT === 80) {
  API_URL = `${HOSTNAME}`
} else {
  API_URL = `${HOSTNAME}:${PORT}`
}

export const apiService = {
  API_URL,
  fetchCharacters,
  fetchStatistics
}

async function fetchCharacters () {
  const response = await window.axios.get(`${API_URL}/api/characters`)
  return response.data.characters
}

async function fetchStatistics (name, realm) {
  const response = await window.axios.get(`${API_URL}/api/character/${realm}/${name}/statistics`)
  return response.data
}
