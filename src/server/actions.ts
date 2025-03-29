"use server";

import { BASE_URL } from "@/lib/constants";

export async function createUser(data: any) {
  // Send a POST request to the API endpoint
  const res = await fetch(`${BASE_URL}/api/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // Check if the response is ok
  if (!res.ok) {
    return "USER_NOT_CREATED";
  }

  return await res.text(); // USER_CREATED
}