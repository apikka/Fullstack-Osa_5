const Blog = ({blog, handleLike}) => (
  <div>
    {blog.title} {blog.author} {blog.likes}
    <button onClick={handleLike}>Like</button>
  </div>  
)

export default Blog