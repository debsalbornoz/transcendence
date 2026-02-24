import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 🔥 Usuário fake para teste
        if (
          credentials?.email === "admin@email.com" &&
          credentials?.password === "123456"
        ) {
          return {
            id: "1",
            name: "Admin",
            email: "admin@email.com",
          }
        }

        return null
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }