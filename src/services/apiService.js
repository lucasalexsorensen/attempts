const HOSTNAME = (typeof process.env.HOSTNAME !== 'undefined') ? process.env.HOSTNAME : 'https://attempts.herokuapp.com'
const PORT = (typeof process.env.PORT !== 'undefined') ? process.env.PORT : 80
console.log(process.env.HOSTNAME)
let API_URL
if (Number(PORT) === 80) {
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
  let response
  try {
    response = await window.axios.get(`${API_URL}/api/character/${realm}/${name}/statistics`)
    response = response.data
  } catch (ex) {
    console.log(ex)
    response = null
  }
  return response
}
