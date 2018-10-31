const HOSTNAME = process.env.HOSTNAME || 'https://attempts.herokuapp.com'
const PORT = process.env.PORT || 80
const API_URL = `${HOSTNAME}:${PORT}`

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
