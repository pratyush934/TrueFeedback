import CredentialsProvider from "next-auth/providers/credentials";
import nextAuth, { NextAuthOptions } from "next-auth";
import { dbConnection } from "@/lib/dbConnect";
import { UserModel } from "@/models/User.model";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  
  providers: [

    CredentialsProvider({

      id: "credentials",
      name: "Credentials",

      credentials: {
        eamil: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        
        await dbConnection();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error(`No user found with this email`);
          }

          if (!user.isVerified) {
            throw new Error(`Please verify your account first`);
          }

          const checkisPasswordSame = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (checkisPasswordSame) {
            return user;
          } else {
            throw new Error(`So sad but this happend`);
          }

        } catch (error: any) {
          throw new Error(`Error aya hai in authOptions -> providers`, error);
        }
      },
    }),
  ],

  /* 
    1. jwt aur session me max to max detail daal dete hai
    2. is se db queries bach jayengi
  */

  callbacks: {  
    
    async jwt({ token, user }) {

      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }

      return token;
    },
    async session({ session, token }) {

      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET_KEY,

  pages: {
    signIn: '/sign-in',
  },

  
};
