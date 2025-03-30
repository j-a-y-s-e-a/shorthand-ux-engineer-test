"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeClosed, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { createUser } from "@/server/actions";
import { formSchema, organizationCategories, organizationSizes, pricingPlanOptions, userRoles } from "@/lib/schema";
import { MAX_PAGE_COUNT } from "@/lib/constants";
import pricingPlans from "@/lib/plans.json";
import { formatPlan } from "@/lib/utils";

const formSteps = [
  { id: 'personal-information', title: "Personal Information", fields: ["name", "email", "password"] },
  { id: 'organization-information', title: "Organization Information", fields: ["organizationName", "organizationSize", "organizationCategory"] },
  { id: 'team-structure', title: "Team Structure", fields: ["userRole", "teamMemberInvites"] },
  { id: 'pricing-plan', title: "Pricing Plan", fields: ["pricingPlan"] },
  { id: 'terms-and-conditions', title: "Terms and Conditions", fields: ["acceptTermsAndConditions", "acceptMailingList"] },
  { id: 'confirmation', title: "Confirmation", fields: [] },
]

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  const [animationDirection, setAnimationDirection] = useState<number>(0);

  // Memoize to prevent re-renders
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const calculateProgress = useMemo(() => Math.round((page / MAX_PAGE_COUNT) * 100), [page]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
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

  // Store invites as a field array
  const { fields: invites, append: addInvite, remove: removeInvite } = useFieldArray({
    control: form.control,
    name: "teamMemberInvites",
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
              const response = await createUser(formData);

              if (response === "USER_CREATED") {
                console.log("User created successfully");
              } else {
                console.error("Error creating user");
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
                    <div className="space-y-10">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex flex-row items-center justify-between">
                              <FormLabel>Name</FormLabel>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex flex-row items-center justify-between">
                              <FormLabel>Email</FormLabel>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <div className="flex flex-row items-center justify-between">
                              <FormLabel>Password</FormLabel>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <div className="relative flex flex-row items-center justify-between">
                                <Input type={showPassword ? "text" : "password"} {...field} {...(fieldState.error && { "aria-invalid": true })} />
                                <Button variant="ghost" size="icon" type="button" onClick={togglePasswordVisibility} className="absolute right-0 p-0 m-0 rounded-l-none">
                                  {showPassword ? <Eye /> : <EyeClosed />}
                                </Button>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  {/** Step 2: Organisational Information */}
                  {page === 1 && (
                    <div className="space-y-10">
                      <FormField
                        control={form.control}
                        name="organizationName"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex flex-row items-center justify-between">
                              <FormLabel>Organization Name</FormLabel>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="organizationCategory"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex flex-row items-center justify-between">
                              <FormLabel>Organization Category</FormLabel>
                              <FormMessage />
                            </div>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger size="sm" className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {organizationCategories.map((category, index) => (
                                  <SelectItem key={`${category}-${index}`} value={category}>{category}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="organizationSize"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex flex-row items-center justify-between">
                              <FormLabel>Employee Count</FormLabel>
                              <FormMessage />
                            </div>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger size="sm" className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {organizationSizes.map((size, index) => (
                                  <SelectItem key={`${size}-${index}`} value={size}>{size}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  {/** Step 3: User Role and Team Members */}
                  {page === 2 && (
                    <div className="space-y-10">
                      <FormField
                        control={form.control}
                        name="userRole"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex flex-row items-center justify-between">
                              <FormLabel>Your Role</FormLabel>
                              <FormMessage />
                            </div>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger size="sm" className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {userRoles.map((role, index) => (
                                  <SelectItem key={`${role}-${index}`} value={role}>{role}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <div className="flex flex-row items-center justify-between">
                          <FormLabel>Invite Team Members</FormLabel>
                          <FormDescription>You can also skip this for now</FormDescription>
                        </div>
                        {invites.map((field, index) => (
                          <div key={field.id} className="flex items-end gap-3">
                            <FormField
                              control={form.control}
                              name={`teamMemberInvites.${index}.email`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <div className="flex flex-row items-center w-full justify-between">
                                    <FormLabel>Invite Email</FormLabel>
                                    <FormMessage />
                                  </div>
                                  <FormControl>
                                    <Input
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeInvite(index)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-dashed border"
                          onClick={() => addInvite({ email: "" })}
                        >
                          <Plus className="h-5 w-5" />
                          Add Team Member
                        </Button>
                      </div>
                    </div>
                  )}
                  {/** Step 4: Pricing PLan and Terms */}
                  {page === 3 && (
                    <FormField
                      control={form.control}
                      name="pricingPlan"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              className="grid grid-cols-2 w-full gap-0"
                            >
                              {pricingPlanOptions.map((plan, index) => (
                                <div key={`${plan}-${index}`} className="relative flex items-center h-full p-2">
                                  <RadioGroupItem id={plan} value={plan} className="peer absolute opacity-0" />
                                  <FormLabel htmlFor={plan} className="flex flex-col items-start gap-4 p-2 border w-full h-full rounded text-xs peer-data-[state=checked]:bg-accent data-[error=true]:text-foreground">
                                    <div className="text-start text-lg">{formatPlan(plan)}</div>
                                    <div className="text-muted-foreground">{pricingPlans[plan].description}</div>
                                    <div className="text-sm">{pricingPlans[plan].price}</div>
                                  </FormLabel>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {/** Step 5: Terms and Conditions */}
                  {page === 4 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="acceptMailingList"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div>
                              <FormLabel className="mb-2">
                                Mailing List
                              </FormLabel>
                              <FormDescription>
                                Do you wish to sign up for the mailing list?
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="acceptTermsAndConditions"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-4">
                              <FormLabel className="mb-2">
                                Terms and Conditions
                              </FormLabel>
                              <FormDescription>
                                Do you accept the terms and conditions?
                              </FormDescription>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                    </div>
                  )}
                  {/** Confirmation Page */}
                  {page === 5 && (
                    <div className="grid grid-cols-2 text-sm break-words gap-4">
                      <div className="space-y-6 max-w-[20ch]">
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground">
                            Name
                          </span>
                          <span className="text-foreground">
                            {form.getValues().name}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground">
                            Email
                          </span>
                          <span className="text-foreground">
                            {form.getValues().email}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground">
                            User Role
                          </span>
                          <span className="text-foreground">
                            {form.getValues().userRole}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground">
                            Pricing Plan
                          </span>
                          <span className="text-foreground">
                            {formatPlan(form.getValues().pricingPlan)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-6  max-w-[20ch]">
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground">
                            Organization Name
                          </span>
                          <span className="text-foreground">
                            {form.getValues().organizationName}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground">
                            Organization Size
                          </span>
                          <span className="text-foreground">
                            {form.getValues().organizationSize}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground">
                            Organization Category
                          </span>
                          <span className="text-foreground">
                            {form.getValues().organizationCategory}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground">
                            Joined the mailing list?
                          </span>
                          <span className="text-foreground">
                            {form.getValues().acceptMailingList ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
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


