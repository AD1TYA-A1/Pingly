import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {

    // console.log("Middleware is running");
    const token = req.cookies.get('token')?.value;
    // look inside the browser cookies and find the one named 'token'
    // ?.value means "if cookie exists, get its value, otherwise undefined"
    // so token = either the JWT string or undefined

    const protectedRoutes = ['/chat', '/onBoarding', '/profile','/explore','/chatAssist/professional' ];

    // list of pages that require login

    const isProtected = protectedRoutes.some(r => req.nextUrl.pathname.startsWith(r));
    // req.nextUrl.pathname = the URL the user is trying to visit e.g. "/chat"
    // .some() loops through the array and returns true if ANY item matches
    // .startsWith(r) means "/chat/room1" also counts as protected, not just "/chat"
    // so isProtected = true or false


    if (isProtected && !token) {
        // if the page needs login AND there is no token in cookies
        return NextResponse.redirect(new URL('/logIn', req.url));
        // kick them to /logIn page, don't let them in
    }

    if (token && req.nextUrl.pathname === '/logIn') {
        // if they HAVE a token (already logged in) AND they're trying to visit /logIn
        return NextResponse.redirect(new URL('/chat', req.url));
        // don't show them logIn page, send them straight to /chat
        // this stops logged in users from seeing the login page again
        // already logged in → skip login → go to chat
    }

    return NextResponse.next();
    // everything is fine — let the request through, load the page normally
}

export const config = {
    matcher: ['/chat/:path*', '/onBoarding/:path*', '/logIn/:path*','/profile/:path*','/explore/:path*','/chatAssist/professional/:path*'],
};
// tells Next.js which URLs this middleware should run on
// without this, middleware would run on EVERY request including images, CSS etc
// /chat/:path* means /chat AND /chat/anything/nested also triggers middleware