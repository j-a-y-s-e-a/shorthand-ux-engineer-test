"use client";

import { createUser } from "@/server/actions";

export default function Home() {
  return (
    <div className="container grid grid-rows-[20px_1fr] items-center justify-center min-h-screen p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-600">
      <header className="flex gap-6 flex-wrap items-center justify-center">
        <button>
          Change theme
        </button>
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center bg-amber-800 h-[200px] w-full rounded-lg p-4">
        <div className="grid grid-rows-[30px_1fr] gap-4 w-full h-full">
          <div className="bg-amber-100">
            Progress bar
          </div>
          <div className=" bg-amber-300">
            <form onSubmit={async (e) => {
              e.preventDefault();

              const formData = new FormData(e.currentTarget);
              const data = Object.fromEntries(formData.entries());

              const response = await createUser(data);

              if (response === "USER_CREATED") {
                console.log("User created successfully");
              } else {
                console.error("Error creating user");
              }
            }}>
              <input type="text" name="username" placeholder="Username" required />
              <input type="email" name="email" placeholder="Email" required />
              <button type="submit">Sign Up</button>
              <button type="reset">Reset</button>
            </form>
          </div>
        </div>
      </main >
    </div >
  );
}
