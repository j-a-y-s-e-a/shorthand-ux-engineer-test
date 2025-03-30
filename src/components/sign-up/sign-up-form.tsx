"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import { AnimatePresence, motion } from "motion/react"
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";
import { createUser } from "@/server/actions";
import { formSchema } from "@/lib/schema";
import { MAX_PAGE_COUNT } from "@/lib/constants";

import PersonalInformation from "./pages/1-personal-information";
import OrganizationalInformation from "./pages/2-organizational-information";
import TeamManagement from "./pages/3-team-management";
import PricingPlan from "./pages/4-pricing-plan";
import TermsAndConditions from "./pages/5-terms-and-conditions";
import Confirmation from "./pages/6-confirmation";

const formSteps = [
  { id: 'personal-information', title: "Personal Information", fields: ["name", "email", "password"] },
  { id: 'organization-information', title: "Organization Information", fields: ["organizationName", "organizationSize", "organizationCategory"] },
  { id: 'team-management', title: "Team Management", fields: ["userRole", "teamMemberInvites"] },
  { id: 'pricing-plan', title: "Pricing Plan", fields: ["pricingPlan"] },
  { id: 'terms-and-conditions', title: "Terms and Conditions", fields: ["acceptTermsAndConditions", "acceptMailingList"] },
  { id: 'confirmation', title: "Confirmation", fields: [] },
]

export type FormData = z.infer<typeof formSchema>;

export function SignUpForm() {
  const [page, setPage] = useState<number>(0);
  const [animationDirection, setAnimationDirection] = useState<number>(0);

  const calculateProgress = useMemo(() => Math.round((page / MAX_PAGE_COUNT) * 100), [page]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      organizationName: "",
      organizationSize: undefined,
      organizationCategory: undefined,
      userRole: undefined,
      teamMemberInvites: [],
      pricingPlan: undefined,
      acceptTermsAndConditions: undefined,
      acceptMailingList: false
    },
  })

  function handlePrevious(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    setAnimationDirection(-1);
    setPage((prevPage) => prevPage - 1);
  }

  async function handleNext(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const isValid = await form.trigger(formSteps[page].fields as any, { shouldFocus: true });

    if (isValid) {
      setAnimationDirection(1);
      setPage((prevPage) => prevPage + 1);
    }
  }

  const variants = {
    enter: (direction: number) => {
      return {
        transform: direction > 0 ? 'translateX(50%)' : 'translateX(-50%)',
        opacity: 0
      };
    },
    center: {
      transform: 'translateX(0%)',
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        transform: direction < 0 ? 'translateX(50%)' : 'translateX(-50%)',
        opacity: 0
      };
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr] gap-4 overflow-y-auto overflow-x-hidden rounded-md border shadow-md w-[80vw] sm:w-[500px] min-h-[500px]">
      <div className="flex flex-row gap-4 border-b items-center text-muted-foreground text-xs py-2 px-4 font-mono tracking-tighter">
        <div className="text-nowrap leading-none">
          {`Step ${page + 1} / ${MAX_PAGE_COUNT + 1}`}
        </div>
        <Progress value={calculateProgress} />
      </div>
      <div>
        <Form {...form}>
          <form
            className="grid grid-rows-[1fr_auto] gap-4 h-full"
            onSubmit={form.handleSubmit(async (formData) => {
              console.log("Submitted Data:", JSON.stringify(formData, null, 4));

              // Demo handling of data
              const response = await createUser(formData);

              if (response === "USER_CREATED") {
                toast.success(`Registration successful`)
              } else {
                toast.error(`Error: Registration unsuccessful (${response})`)
              }
            })}>

            <AnimatePresence initial={false} mode="wait" custom={animationDirection}>
              <motion.div
                key={page}
                custom={animationDirection}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="w-full h-full p-4"
              >
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl tracking-tight leading-none">{formSteps[page].title}</h2>
                  </div>

                  {/** Step 1: Personal Information */}
                  {page === 0 && (
                    <PersonalInformation />
                  )}
                  {/** Step 2: Organisational Information */}
                  {page === 1 && (
                    <OrganizationalInformation />
                  )}
                  {/** Step 3: User Role and Team Members */}
                  {page === 2 && (
                    <TeamManagement />
                  )}
                  {/** Step 4: Pricing PLan and Terms */}
                  {page === 3 && (
                    <PricingPlan />
                  )}
                  {/** Step 5: Terms and Conditions */}
                  {page === 4 && (
                    <TermsAndConditions />
                  )}
                  {/** Confirmation Page */}
                  {page === 5 && (
                    <Confirmation />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/** Button Row */}
            <div className="flex flex-row justify-end border-t gap-2 py-2 px-4">
              {page > 0 && (
                <Button type="button" size="sm" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
              {page < 5 && (
                <Button type="button" size="sm" onClick={handleNext}>
                  Next
                </Button>
              )}
              {page === 5 && (
                <Button type="submit" size="sm">
                  Create
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div >
  )
}


