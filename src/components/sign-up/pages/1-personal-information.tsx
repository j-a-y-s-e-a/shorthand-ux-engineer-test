import { useCallback, useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FormData } from "../sign-up-form";

export default function PersonalInformation() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Memoize to prevent re-renders
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const form = useFormContext<FormData>();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl tracking-tight leading-none">Personal Information</h2>
      </div>
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
                <FormLabel htmlFor={field.name}>Password</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <div className="relative flex flex-row items-center justify-between">
                  <Input id={field.name} type={showPassword ? "text" : "password"} {...field} {...(fieldState.error && { "aria-invalid": true })} />
                  <Button variant="ghost" size="icon" type="button" onClick={togglePasswordVisibility} className="absolute right-0 p-0 m-0 h-8 rounded-l-none">
                    <span className="sr-only">{showPassword ? "Show Password" : "Hide Password"}</span>
                    {showPassword ? <Eye /> : <EyeClosed />}
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
