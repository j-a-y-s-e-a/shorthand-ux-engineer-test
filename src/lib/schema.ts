import { z } from "zod";

// TODO: Refine and standardize the error messages
export const formSchema = z.object({
  /* Step 1: Personal Information */
  name: z.string({ required_error: "Name is required." }).min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string({ required_error: "Email is required." }).email({ message: "Please enter a valid email address." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." }),

  /* Step 2: Organization Information */
  organizationName: z.string({ required_error: "Organization name is required." }).min(2, { message: "Organization name must be at least 2 characters long." }),
  organizationSize: z.enum(["1-50", "51-200", "201-500", "501-1000", "1000+"], { errorMap: () => ({ message: "Please select the organization size." }) }),
  organizationCategory: z.string({ required_error: "Organization category is required." }).min(2, { message: "Organization category must be at least 2 characters long." }),

  /* Step 3: User Role and Team Members */
  userRole: z.string({ required_error: "User role is required." }).min(2, { message: "User role must be at least 2 characters long." }),
  teamMemberInvites: z.array(z.string().email()).optional(),

  /* Step 4: Pricing Plan and Terms */
  pricingPlan: z.enum(["hobby", "professional", "enterprise"], { errorMap: () => ({ message: "Please select a pricing plan." }) }),

  /* Step 5: Terms and Conditions */
  acceptTermsAndConditions: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
  acceptMailingList: z.boolean().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;
