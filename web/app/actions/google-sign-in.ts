"use server";

import { signIn } from "@/auth";

export async function GoogleSignIn() {
  return await signIn("google", { redirectTo: "/" });
}
