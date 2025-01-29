//Middleware that makes sure that any route that goes down /api/protected needs the user to be authenticated for them to be accessed

import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired();

export const config = {
  matcher: "/api/protected/:path*",
};
