"use client";

import { useCallback, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeClosed, Plus, Trash2 } from "lucide-react";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components//ui/checkbox";
import { createUser } from "@/server/actions";
import { formSchema, organizationSizes, pricingPlanOptions } from "@/lib/schema";
import { MAX_PAGE_COUNT } from "@/lib/constants";

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
      organizationCategory: "",
      userRole: "",
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

    const previousPage = page - 1;
    setPage(previousPage);
  }

  async function handleNext(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const isValid = await form.trigger(formSteps[page].fields as any, { shouldFocus: true });

    if (isValid) {
      const nextPage = page + 1;
      setPage(nextPage);
    }
  }

  return (
    <div className="grid grid-rows-[auto_1fr] gap-4 overflow-y-auto p-4 rounded-md border shadow-md w-[80vw] sm:w-[500px] min-h-[500px]">
      <div className="flex flex-row gap-4 justify-between text-muted-foreground text-sm font-mono tracking-tighter">
        <div className="flex flex-row gap-4">
          <div>
            Progress
          </div>
          <div>
            {calculateProgress}%
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <h1>
            Step
          </h1>
          <div>
            {page + 1} {'/'} {MAX_PAGE_COUNT + 1}
          </div>
        </div>
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
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl tracking-tight leading-none">{formSteps[page].title}</h2>
              </div>

              {/** Step 1: Personal Information */}
              {page === 0 && (
                <>
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
                </>
              )}
              {/** Step 2: Organisational Information */}
              {page === 1 && (
                <>
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
                    name="organizationSize"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center justify-between">
                          <FormLabel>Employee Count</FormLabel>
                          <FormMessage />
                        </div>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {organizationSizes.map((size, index) => (
                              <SelectItem key={`${size}-${index}`} value={size}>{size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The number of employees at your organization
                        </FormDescription>
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
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The category of the Organization
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </>
              )}
              {/** Step 3: User Role and Team Members */}
              {page === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="userRole"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center justify-between">
                          <FormLabel>User Role</FormLabel>
                          <FormMessage />
                        </div>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    {invites.map((field, index) => (
                      <div key={field.id} className="flex items-end gap-3">
                        <FormField
                          control={form.control}
                          name={`teamMemberInvites.${index}.email`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <div className="flex flex-row items-center justify-between">
                                <FormLabel className={index !== 0 ? "sr-only" : "text-sm"}>Email</FormLabel>
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
                          variant="ghost"
                          size="icon"
                          onClick={() => removeInvite(index)}
                          className="h-12 w-12 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="mt-4 w-full border-dashed border-2"
                      onClick={() => addInvite({ email: "" })}
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Add Team Member
                    </Button>
                  </div>
                </>
              )}
              {/** Step 4: Pricing PLan and Terms */}
              {page === 3 && (
                <>
                  <FormField
                    control={form.control}
                    name="pricingPlan"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center justify-between">
                          <FormLabel>Pricing Plan</FormLabel>
                          <FormMessage />
                        </div>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a pricing plan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {pricingPlanOptions.map((plan, index) => (
                              <SelectItem key={`${plan}-${index}`} value={plan}>{plan}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The Pricing Plan Option
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </>
              )}
              {/** Step 5: Terms and Conditions */}
              {page === 4 && (
                <div className="flex flex-col gap-4">
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
                <div className="grid grid-cols-2 text-sm">
                  <div className="space-y-6">
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
                        {form.getValues().pricingPlan}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground">
                        Organizational Name
                      </span>
                      <span className="text-foreground">
                        {form.getValues().organizationName}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground">
                        Organizational Size
                      </span>
                      <span className="text-foreground">
                        {form.getValues().organizationSize}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground">
                        Organizational Category
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
            {/** Button Row */}
            <div className="flex flex-row justify-end gap-4">
              {page > 0 && (
                <Button type="button" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
              {page < 5 && (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              )}
              {page === 5 && (
                <Button type="submit">
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


