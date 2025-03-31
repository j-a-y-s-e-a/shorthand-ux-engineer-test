import { useFormContext } from "react-hook-form";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

import { FormData } from "../sign-up-form";

export default function TermsAndConditions() {
  const form = useFormContext<FormData>();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl tracking-tight leading-none">Terms and Conditions</h2>
      </div>
      <div className="space-y-2 grid grid-row-2 items-start gap-2">
        <FormField
          control={form.control}
          name="acceptMailingList"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-2 space-y-0 rounded-md border p-4 shadow h-full">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-4">
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
        <FormField
          control={form.control}
          name="acceptTermsAndConditions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-2 space-y-0 rounded-md border p-4 shadow h-full">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-4">
                <FormLabel>
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
    </div>
  )
}
