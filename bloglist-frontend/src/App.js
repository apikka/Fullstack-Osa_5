import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const userLogin = window.localStorage.getItem('loggedInUser')

    if (userLogin) {
      const user = JSON.parse(userLogin)
      setUser(user)
    }


  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const userInfo = await loginService.login({
        username, password
      })
      setUser(userInfo)
      setPassword('')
      setUsername('')

      window.localStorage.setItem('loggedInUser', JSON.stringify(userInfo))

    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logOut = () => {
    setUser(null)
    window.localStorage.removeItem('loggedInUser')
  }

  if (user === null) {
    return (
      <>
      <h1>Login to application</h1>
      <form onSubmit={handleLogin} >
        <div>
          Username
          <input type="text" value={username} name="Username"  onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          Password
          <input type="password" value={password} name="Password"  onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
      </>
    )
  }
  return (
    <div>
      <p>`User {user.name} is logged in`</p>
      <button onClick={logOut}>Log out</button>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
