"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createUser } from "@/server/actions";
import { formSchema, organizationSizes, pricingPlanOptions } from "@/lib/schema";
import { Eye, EyeClosed, Plus, Trash2 } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { useCallback, useState } from "react";

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Memoize to prevent re-renders
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teamMemberInvites",
  })

  return (
    <div className="grid grid-rows-[30px_1fr] gap-4 w-full h-full">
      <div>
        Progress bar
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(async (formData) => {
            const response = await createUser(formData);

            if (response === "USER_CREATED") {
              console.log("User created successfully");
            } else {
              console.error("Error creating user");
            }
          })} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative flex flex-row items-center justify-between">
                      <Input type={showPassword ? "text" : "password"} {...field} />
                      <Button variant="ghost" size="icon" type="button" onClick={togglePasswordVisibility} className="absolute right-0 p-0 m-0">
                        {showPassword ? <Eye /> : <EyeClosed />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizationSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee Count</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizationCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Category</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The category of the Organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Role</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Your Role
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-3">
                  <FormField
                    control={form.control}
                    name={`teamMemberInvites.${index}.email`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className={index !== 0 ? "sr-only" : "text-base"}>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-12 rounded-lg border-2 focus-visible:ring-2 focus-visible:ring-offset-1"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
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
                onClick={() => append({ email: "" })}
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Team Member
              </Button>
            </div>

            <FormField
              control={form.control}
              name="pricingPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Plan</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4">
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
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Terms and Conditions
                      </FormLabel>
                      <FormDescription>
                        Do you accept the terms and conditions?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
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
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Mailing List
                      </FormLabel>
                      <FormDescription>
                        Do you wish to sign up for the mailing list?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row gap-4">
              <Button type="submit">Submit</Button>
              <Button type="reset" onClick={() => form.reset()}>Reset</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}


