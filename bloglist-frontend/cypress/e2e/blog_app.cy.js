

// NOTE: Backend needs to be in test env
describe('Blog app', function() {
    beforeEach(function() {
      // Reset-endpoint cleans the test db before the tests are run
      // Note that all other describe-blocks are inside the 'Blog app'
      // so this applies to all tests in this file
      // take a look at the BE repository
      // files in ../controllers in particular
      // Backend runs in localhost:3003
      // Login info could be in .env
      cy.request('POST', 'http://localhost:3003/api/reset')
      cy.request('POST', 'http://localhost:3003/api/users', {'username' : 'testUser', 'password' : '123654'})
      cy.request('POST', 'http://localhost:3003/api/users',{'username' : 'testUser2', 'password' : '123654'})

      // Frontend runs in localhost:3000
      cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function() {
      cy.contains('Username')
      cy.contains('Password')
      cy.contains('Login')
    })

    describe('Login', function() {
      it('Succesful login', function() {

        // Cypress best practises -guide instructs using data-cy tags in components
        // take a look at the form component in ../App.js
        cy.get('[data-cy="username"]').type('testUser')
        cy.get('[data-cy="password"]').type('123654')
        cy.get('[data-cy="login"]').click()
        cy.contains('User is logged in')
      })

      it('Wrong password', function() {
        cy.get('[data-cy="username"]').type('testUser')
        cy.get('[data-cy="password"]').type('wrongPassword')
        cy.get('[data-cy="login"]').click()
        cy.contains('Wrong credentials')
      })

      it('Wrong username', function() {
        cy.get('[data-cy="username"]').type('wrongUsername')
        cy.get('[data-cy="password"]').type('123654')
        cy.get('[data-cy="login"]').click()
        cy.contains('Wrong credentials')
      })
    })

    describe('When logged in', function() {
      beforeEach(function () {
        // Logging in through UI is slow
        // so we'll use the BE endpoint
        cy.login({username : 'testUser', password : '123654'})
        })
      it('A blog can be created', function() {
        cy.get('[data-cy="newBlog').click()
        cy.contains('Title')
        cy.contains('Author')
        cy.contains('URL')

        cy.get('[data-cy="title"]').type('Title of the new blog')
        cy.get('[data-cy="author"]').type('Author of the new blog')
        cy.get('[data-cy="url"]').type('https://testurl.com')

        cy.get('[data-cy="createNewBlog"]').click()

        cy.contains('Title of the new blog')
        cy.contains('Author of the new blog')        
      })

      it('Blog can be liked', function() {
        cy.createBlog({title : "A new blog", author : "Test author", url : "http://testurl.com"})

        cy.get('[data-cy="blog"]').contains(0) // Because zero likes in a new blog
        cy.get('[data-cy="like"]').click()
        cy.reload()
        cy.get('[data-cy="blog"]').contains(1) // Not sure if this is the best way
      })

      it('Blog can be deleted', function() {
        cy.createBlog({title : "A new blog", author : "Test author", url : "http://testurl.com"})

        cy.get('[data-cy="blog"]').contains("A new blog")
        cy.get('[data-cy="delete"]').click()

        cy.contains("A new blog").should('not.exist')
      })

      it('Only user that added the blog can delete it', function() {
        cy.createBlog({title : "A blog that can't be deleted", author : "Test author", url : "http://testurl.com"})

        cy.logout()

        cy.login({username : 'testUser2', password : '123654'})
        cy.contains('Delete').should('not.exist')
      })

      it('Blogs are ordered according to likes', function() {
        // This is WIP
        cy.createBlog({title : "Blog with 2nd most likes", author : "Test author", url : "http://testurl.com"})
        cy.createBlog({title : "Blog with the most likes", author : "Test author", url : "http://testurl.com"})

        cy.get('.blog').contains('Blog with 2nd most likes').contains('Like').click()
        
        cy.wait(400)

        cy.get('.blog').contains('Blog with the most likes').contains('Like').click()

        cy.wait(400)

        cy.get('.blog').contains('Blog with the most likes').contains('Like').click()

        cy.reload()

        cy.get('.blog').eq(0).contains('Blog with the most likes')


      })

    })
  })
