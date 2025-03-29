"use client";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SignUpForm } from "@/components/sign-up/sign-up-form";

export default function Home() {
  return (
    <div className="container mx-auto grid grid-rows-[20px_1fr] items-center justify-center min-h-screen p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex gap-6 flex-wrap items-center justify-center">
        <ThemeToggle />
      </header>
      <main className="row-start-2 items-start border border-2 shadow-md md:w-[750px] md:min-h-[500px] rounded-lg p-4">
        <SignUpForm />
      </main >
    </div >
  );
}
