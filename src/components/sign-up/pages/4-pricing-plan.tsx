import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { pricingPlanOptions } from "@/lib/schema";
import { formatPlan } from "@/lib/utils";

import pricingPlans from "@/lib/plans.json";

import { FormData } from "../sign-up-form";

export default function PricingPlan() {
  const form = useFormContext<FormData>();
  return (
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
                  <RadioGroupItem id={plan} value={plan} className="peer absolute opacity-0" data-state={field.value === plan ? "checked" : "unchecked"} />
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
  )
}
