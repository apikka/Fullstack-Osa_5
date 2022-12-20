

const NewBlog = ( {title, author, url, handleNewBlog, setUrl, setTitle, setAuthor} ) => {
    return (
        <form onSubmit={handleNewBlog}>
            <div>
                Title 
                <input type='text' value={title} onChange={({target}) => setTitle(target.value)}/>
            </div>

            <div>
                Author 
                <input type='text' value={author} onChange={({target}) => setAuthor(target.value)}/>
            </div>

            <div>
                URL 
                <input type='text' value={url} onChange={({target}) => setUrl(target.value)}/>
            </div>
            <button type="submit">Create a new</button>
        </form>
    )
}

export default NewBlog