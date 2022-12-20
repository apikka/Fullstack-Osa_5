import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)


  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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
      blogService.setToken(user.token)
    }


  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const userInfo = await loginService.login({
        username, password
      })
      setUser(userInfo)
      window.localStorage.setItem('loggedInUser', JSON.stringify(userInfo))
      blogService.setToken(user.token)
      setPassword('')
      setUsername('')

    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  
  const handleNewBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      "author" : author,
      "title" : title, 
      "url" : url
    }
    const postNewBlog = await blogService.create(newBlog)
    console.log(postNewBlog)

    setBlogs(blogs.concat(postNewBlog))

    setTitle('')
    setAuthor('')
    setUrl('')
    
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
      <p>User {user.name} is logged in</p>
      <button onClick={logOut}>Log out</button>
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      <h2>Create new</h2>
      <NewBlog handleNewBlog={handleNewBlog} title={title} author={author} url={url} setUrl={setUrl} setTitle={setTitle} setAuthor={setAuthor}/>
    </div>
  )
}

export default App
