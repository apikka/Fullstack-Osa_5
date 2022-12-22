import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import blogService from './services/blogs'
import loginService from './services/login'
import Alert from './components/Alert'
import Togglable from './components/Togglable'
import axios from 'axios'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
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
      blogService.setToken(userInfo.token)
      setPassword('')
      setUsername('')

    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Do you want to delete ${blog.title}?`)) {
      const del = await blogService.deleteBlog(blog.id)

      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
    
  }

  const handleLike = async (blog) => {
    const newBlog = {...blog, likes : blog.likes + 1} 

    const update = await blogService.update(blog.id, newBlog)

    setBlogs(blogs.map(b => b.id !== blog.id ? b : update))

  }
  
  const handleNewBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      "author" : author,
      "title" : title, 
      "url" : url
    }
    const postNewBlog = await blogService.create(newBlog)
    blogFormRef.current.toggleVisibility()
    setBlogs(blogs.concat(postNewBlog))

    setTitle('')
    setAuthor('')
    setUrl('')

    setErrorMessage(`${newBlog.title} was added successfully`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
    
  }

  const logOut = () => {
    setUser(null)
    window.localStorage.removeItem('loggedInUser')
  }

  if (user === null) {
    return (
      <>
      {errorMessage !== null && <Alert alertMessage={errorMessage}/>}
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
      {errorMessage !== null && <Alert alertMessage={errorMessage}/>}
      <p>User {user.name} is logged in</p>
      <button onClick={logOut}>Log out</button>
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} user={user} blog={blog} handleLike={() => handleLike(blog)} handleDelete={() => handleDelete(blog)}/>
      )}
      <h2>Create new</h2>
      <Togglable buttonLabel='New blog' ref={blogFormRef}>
        <NewBlog handleNewBlog={handleNewBlog} title={title} author={author} url={url} setUrl={setUrl} setTitle={setTitle} setAuthor={setAuthor}/>
      </Togglable>
    </div>
  )
}

export default App
