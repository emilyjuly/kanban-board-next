// pages/api/auth/[...nextauth].ts

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import middleware from '../../../middleware';

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
};

export default (req, res) => NextAuth(req, res, authOptions);

