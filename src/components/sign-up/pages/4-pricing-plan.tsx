import { useFormContext } from "react-hook-form";
import { Check } from "lucide-react";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { pricingPlanOptions } from "@/lib/schema";
import { formatPlan } from "@/lib/utils";

import pricingPlans from "@/lib/plans.json";

import { FormData } from "../sign-up-form";

export default function PricingPlan() {
  const form = useFormContext<FormData>();
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl tracking-tight leading-none">Pricing Plan</h2>
      </div>
      <FormField
        control={form.control}
        name="pricingPlan"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                className="grid grid-cols-3 w-full gap-0"
              >
                {pricingPlanOptions.map((plan, index) => (
                  <div key={`${plan}-${index}`} className="relative flex items-center h-full p-2">
                    <RadioGroupItem id={plan} value={plan} className="peer absolute opacity-0" data-state={field.value === plan ? "checked" : "unchecked"} />
                    <FormLabel htmlFor={plan} className="flex flex-col items-start gap-8 p-2 border w-full h-full rounded text-xs hover:ring peer-data-[state=checked]:bg-accent data-[error=true]:text-foreground">
                      <div className="space-y-4">
                        <div className="text-start text-base">{formatPlan(plan)}</div>
                        <div className="text-muted-foreground text-sm">{pricingPlans[plan].description}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-bold">{pricingPlans[plan].price}</div>
                          <div className="text-xs">{pricingPlans[plan].billingPeriod}</div>
                        </div>
                      </div>
                      <ol className="flex flex-col gap-2">
                        {pricingPlans[plan].features.map(feature => (
                          <li key={feature} className="text-xs flex gap-2 items-start">
                            <Check size={12} className="mt-[1px]" />
                            <span className="">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </FormLabel>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
        }
      />
    </div >
  )
}
