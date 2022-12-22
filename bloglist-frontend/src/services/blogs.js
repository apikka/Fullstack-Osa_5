import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newBlog => {
  const config = {
    headers : { Authorization : token},
  }

  const res = await axios.post(baseUrl, newBlog, config)
  return res.data
}

const update = async (id, newBlog) => {
  const res = await axios.put(`${baseUrl}/${id}`, newBlog)
  return res.data
}

const deleteBlog = async (id) => {
  const res = await axios.delete(`${baseUrl}/${id}`)
}

export default { setToken, getAll, create, update, deleteBlog }