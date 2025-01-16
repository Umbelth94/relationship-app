//Creates the auth handler routes that are used throughout the application
//login, callback, logout, and me

import { handleAuth } from "@auth0/nextjs-auth0";

export const GET = handleAuth();
