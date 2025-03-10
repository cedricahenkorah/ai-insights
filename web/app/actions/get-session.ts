"use server";

import { auth } from "@/auth";

export async function GetSession() {
  const session = await auth();

  return session;
}
