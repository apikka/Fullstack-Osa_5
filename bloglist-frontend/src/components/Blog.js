const Blog = ({blog, handleLike, handleDelete, user}) => {
  const visible = {display : user.id === blog.user[0].id ? '' : 'none'}

  return (
    <div class="blog" data-cy='blog'>
      {blog.title} {blog.author} {blog.likes}
      <button data-cy='like' onClick={handleLike}>Like</button>
      <button data-cy='delete' style={visible} onClick={handleDelete}>Delete</button>
    </div>  
  )
}

export default Blog