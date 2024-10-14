// types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      addressValidated?: boolean;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    addressValidated?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    addressValidated?: boolean;
  }
}
