import { backendUrl } from "@/constants/env";
import axios from "axios";
import { User } from "next-auth";

export async function googleAuth(data: User) {
  try {
    const response = await axios.post(`${backendUrl}/auth/google-auth`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.status !== "success") {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }
  }
}
