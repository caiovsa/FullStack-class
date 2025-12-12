import axios from 'axios'

const BASE_URL = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getAll = () => {
  return axios.get(BASE_URL).then(response => response.data)
}

const getByName = (name) => {
  return axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`).then(response => response.data)
}

export default { getAll, getByName }
