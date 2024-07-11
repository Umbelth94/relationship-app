import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import Home from '../app/page'
import * as Auth0Client  from '@auth0/nextjs-auth0/client'
 
describe('Home', () => {
  it('renders a heading', () => {

    let mockUserUser = jest
        .spyOn(Auth0Client, 'useUser')
        .mockReturnValue({
            user: { email: "email@example.com", name: "testUserName" } as Auth0Client.UserProfile,
            isLoading: false,
            error: undefined,
            checkSession: function (): Promise<void> {
                throw new Error('Function not implemented.')
            }
        })

    render(<Auth0Client.UserProvider><Home /></Auth0Client.UserProvider>)
    const signInButton = screen.queryByText('Sign In')

    waitFor(() => {
        expect(signInButton).toBeInTheDocument()
    })
  })

  it('should fetch data', async () => {
    let response = await fetch('http://localhost:3000/api/protected/status')
    let json = await response.json()
    expect(json).toBe({test:""})
  })
})