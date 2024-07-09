import { NextApiRequest, NextApiResponse } from 'next'
import { redirect } from 'next/navigation'
 
//Redirects to home page after login on api/auth/callback
export const GET = () =>{
  redirect('/');
}