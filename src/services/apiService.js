export const apiService = {
  fetchCharacters,
  fetchStatistics
}

const API_URL = 'http://localhost:3000'

async function fetchCharacters () {
  const response = await window.axios.get(`${API_URL}/api/characters`)
  return response.data.characters
}

async function fetchStatistics (name, realm) {
  const response = await window.axios.get(`${API_URL}/api/character/${realm}/${name}/statistics`)
  return response.data
}
