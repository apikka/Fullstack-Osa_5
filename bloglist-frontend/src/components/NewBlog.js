

const NewBlog = ( {title, author, url, handleNewBlog, setUrl, setTitle, setAuthor} ) => {
    return (
        <form onSubmit={handleNewBlog}>
            <div>
                Title 
                <input data-cy='title' type='text' value={title} onChange={({target}) => setTitle(target.value)}/>
            </div>

            <div>
                Author 
                <input data-cy='author' type='text' value={author} onChange={({target}) => setAuthor(target.value)}/>
            </div>

            <div>
                URL 
                <input data-cy='url' type='text' value={url} onChange={({target}) => setUrl(target.value)}/>
            </div>
            <button data-cy='createNewBlog' type="submit">Create a new</button>
        </form>
    )
}

export default NewBlog