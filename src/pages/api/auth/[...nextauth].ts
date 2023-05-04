import NextAuth from "next-auth/next";
import GitHubProvider from "next-auth/providers/github";

const clientId = process.env.GITHUB_ID || "";
const clientSecret = process.env.GITHUB_SECRET || "";

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId,
      clientSecret,
    }),
  ],
});
