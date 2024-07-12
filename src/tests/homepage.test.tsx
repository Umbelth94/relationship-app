import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import Home from '../app/page'
import * as Auth0Client  from '@auth0/nextjs-auth0/client'
 
describe('HomePage', () => {

  const mockUserUser: jest.SpyInstance = jest
    .spyOn(Auth0Client, 'useUser')

  beforeEach(() => {
    mockUserUser
      .mockReturnValue({
          user: { email: "email@example.com", name: "testUserName" } as Auth0Client.UserProfile,
          isLoading: false,
          error: undefined,
          checkSession: function (): Promise<void> {
              throw new Error('Function not implemented.')
          }
      })
  })

  it('should show sign out button when user is logged in', () => {
    const { queryByText } = render(<Auth0Client.UserProvider><Home /></Auth0Client.UserProvider>)
    const signInButton = queryByText('Sign Out')
    const signOutButton = queryByText('Sign In')

    waitFor(() => {
        expect(signInButton).toBeInTheDocument()
        expect(signOutButton).toBe(undefined)
    })
  })

  it('should show sign in button when user is logged out', () => {
    mockUserUser
      .mockReturnValue({
          user: undefined,
          isLoading: false,
          error: undefined,
          checkSession: function (): Promise<void> {
              throw new Error('Function not implemented.')
          }
      })

    const { queryByText } = render(<Auth0Client.UserProvider><Home /></Auth0Client.UserProvider>)
    const signInButton = queryByText('Sign Out')
    const signOutButton = queryByText('Sign In')

    waitFor(() => {
        expect(signInButton).toBeInTheDocument()
        expect(signOutButton).toBe(undefined)
    })
  })
})