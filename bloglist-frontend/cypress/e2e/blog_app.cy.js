

// NOTE: Backend needs to be in test env
describe('Blog app', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/reset')
      cy.request('POST', 'http://localhost:3003/api/users', {'username' : 'testUser', 'password' : '123654'})
      cy.visit('http://localhost:3000')
    })
  
    it('Login form is shown', function() {
      cy.contains('Username')
      cy.contains('Password')
      cy.contains('Login')
    })

    describe('Login', function() {
      it('Succesful login', function() {
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
  })
