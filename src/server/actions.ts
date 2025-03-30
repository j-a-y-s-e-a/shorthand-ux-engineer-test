"use server";

import { BASE_URL } from "@/lib/constants";
import { formSchema } from "@/lib/schema";

export async function createUser(data: any) {
  // Validate data
  const { success: isValidData } = formSchema.safeParse(data);

  if (!isValidData) {
    return "INVALID_FORM_DATA";
  }

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