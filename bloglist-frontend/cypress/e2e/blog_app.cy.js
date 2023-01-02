

// NOTE: Backend needs to be in test env
describe('Blog app', function() {
    beforeEach(function() {
      // Reset-endpoint cleans the test db before the tests are run
      // Note that all other describe-blocks are inside the 'Blog app'
      // so this applies to all tests in this file
      // take a look at the BE repository
      // files in ../controllers in particular
      // Backend runs in localhost:3003
      cy.request('POST', 'http://localhost:3003/api/reset')
      cy.request('POST', 'http://localhost:3003/api/users', {'username' : 'testUser', 'password' : '123654'})

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
      it('Logging in through API works', function() {
        cy.contains('User is logged in')
      })

    })
  })
