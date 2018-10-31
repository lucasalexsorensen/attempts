const API_URL = `${process.env.HOSTNAME}:${process.env.PORT}`

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
