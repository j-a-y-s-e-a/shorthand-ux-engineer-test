"use client";

import { SignUpForm } from "@/components/sign-up/sign-up-form";

export default function Home() {
  return (
    <div className="container mx-auto grid grid-rows-[auto_1fr] justify-center items-center min-h-screen p-8 font-sans">
      <header className="flex flex-row gap-4 text-muted-foreground text-sm font-mono tracking-tighter">
        <h1>
          Jordan Collins
        </h1>
        <div>
          {'/'}
        </div>
        <div>
          Shorthand Project
        </div>
      </header>
      <main>
        <SignUpForm />
      </main >
    </div >
  );
}
