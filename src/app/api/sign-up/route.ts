export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Do something with the data", body);

    return new Response("USER_CREATED", {
      status: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });

  } catch (error) {
    console.error("Error parsing request body", error);

    return new Response("USER_NOT_CREATED", {
      status: 418,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
}
