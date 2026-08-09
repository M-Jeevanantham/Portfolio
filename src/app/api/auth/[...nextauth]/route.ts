import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma, withDB } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Check if any user exists in DB. If not, auto-create the initial admin!
        const userCount = await withDB(() => prisma.user.count());
        if (userCount === 0) {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const initialAdmin = await withDB(() =>
            prisma.user.create({
              data: {
                email: credentials.email.toLowerCase(),
                password: hashedPassword,
                name: "System Admin",
              },
            })
          );
          return { id: initialAdmin.id, email: initialAdmin.email, name: initialAdmin.name };
        }

        const user = await withDB(() =>
          prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          })
        );

        if (!user) {
          throw new Error("No admin account found with this email");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return { id: user.id, email: user.email, name: user.name };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "cybernetic-secret-key-2026",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
