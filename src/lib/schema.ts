import { z } from "zod";

// z.enum only takes tuples so need to explicity type these as a tuple
export const organizationSizes = ["1-50", "51-200", "201-500", "501-1000", "1000+"] as const;
export const organizationCategories = ["Retail", "Marketing", "Software", "Finance", "Commercial", "Entertainment", "Transportation"] as const;
export const userRoles = ["Manager", "Engineer", "Designer"] as const;
export const pricingPlanOptions = ["hobby", "pro", "enterprise"] as const;

export const formSchema = z.object({
  /* Step 1: Personal Information */
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),

  /* Step 2: Organization Information */
  organizationName: z.string().min(2, { message: "Organization name must be at least 2 characters long" }),
  organizationSize: z.enum(organizationSizes, { errorMap: () => ({ message: "Please select the organization size" }) }),
  organizationCategory: z.enum(organizationCategories, { errorMap: () => ({ message: "Please select the organization category" }) }),
  
  /* Step 3: User Role and Team Members */
  userRole: z.enum(userRoles, { errorMap: () => ({ message: "Please select your role" }) }),
  teamMemberInvites: z.array(z.object({ email: z.string().email({ message: "Please enter a valid email." }), })).optional(),

  /* Step 4: Pricing Plan and Terms */
  pricingPlan: z.enum(pricingPlanOptions, { errorMap: () => ({ message: "Please select a pricing plan." }) }),

  /* Step 5: Terms and Conditions */
  acceptTermsAndConditions: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
  acceptMailingList: z.boolean().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;
