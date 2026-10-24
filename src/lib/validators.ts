import { z } from "zod";

/** Accepts local (0801 234 5678) and international (+234 801 234 5678) numbers */
const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s()-]/g, ""))
  .pipe(z.string().regex(/^\+?\d{10,15}$/, "Enter a valid phone number"));

const requiredText = (label: string) => z.string().trim().min(1, `${label} is required`);

/** Local yyyy-mm-dd (toISOString would use UTC and can be a day off) */
export function localISODate(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const tomorrow = () => localISODate(1);

// ── Auth (converted from the old yup rules) ────────────────────────────────

const email = z.string().trim().min(1, "Email is required").pipe(z.email("Enter a valid email address"));

export const loginSchema = z.object({
  email,
  // Length rules apply at sign-up; here we only need something to send
  password: z.string().min(1, "Password is required"),
  remember: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signUpSchema = z
  .object({
    fullName: requiredText("Full name").min(3, "Enter your full name"),
    phoneNumber: phone,
    email,
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    acceptTerms: z.boolean().refine((v) => v, "Please accept the terms to continue"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

export type SignUpFormValues = z.input<typeof signUpSchema>;
export type SignUpFormOutput = z.output<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({ email });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// ── Reservations and contact ────────────────────────────────────────────────

export const reservationSchema = z.object({
  fullName: requiredText("Full name").min(3, "Enter your full name"),
  email: z.email("Enter a valid email address"),
  phone,
  address: requiredText("Address"),
  city: requiredText("City"),
  inspectionDate: requiredText("Inspection date").refine((d) => d >= tomorrow(), "Choose a date from tomorrow onwards"),
  paymentMethod: z.enum(["bank_transfer", "pay_on_inspection"]),
  message: z.string().trim().max(500, "Keep it under 500 characters").optional(),
});

export type ReservationFormValues = z.input<typeof reservationSchema>;
export type ReservationFormOutput = z.output<typeof reservationSchema>;

export const contactSchema = z.object({
  fullName: requiredText("Full name"),
  email: z.email("Enter a valid email address"),
  phone: z.union([z.literal(""), phone]).optional(),
  subject: requiredText("Subject"),
  message: requiredText("Message").min(10, "Tell us a little more (at least 10 characters)"),
});

export type ContactFormValues = z.input<typeof contactSchema>;
