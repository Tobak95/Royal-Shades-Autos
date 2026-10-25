import { z } from "zod";

const NG_EXAMPLE = "like 0801 234 5678";

/** What's wrong with a phone number, in plain words (null when it's fine) */
export function phoneIssue(raw: string): string | null {
  const value = raw.replace(/[\s().-]/g, "");
  if (!value) return "We need a phone number so we can reach you about the car.";
  if (!/^\+?\d+$/.test(value)) return `Use numbers only, ${NG_EXAMPLE} or +234 801 234 5678.`;
  const lengthIssue = (count: number, expected: number, example: string) =>
    count < expected
      ? `That looks a little short. Nigerian numbers have ${expected} digits, ${example}.`
      : count > expected
        ? `That looks a little long. Nigerian numbers have ${expected} digits, ${example}.`
        : null;
  // +234 / 234 then 10 digits (a 0 after the country code is a common slip, so allow it)
  const intl = value.match(/^\+?234(0?)(\d*)$/);
  if (intl) return intl[2].length === 10 ? null : lengthIssue(intl[2].length, 10, "after +234, like +234 801 234 5678");
  if (value.startsWith("+")) {
    const digits = value.length - 1;
    return digits >= 8 && digits <= 15 ? null : "Check the number. International numbers have 8 to 15 digits after the +.";
  }
  if (value.startsWith("0")) return lengthIssue(value.length, 11, NG_EXAMPLE);
  if (value.length === 10 && /^[789]/.test(value)) return `Add the 0 at the start, ${NG_EXAMPLE}.`;
  return lengthIssue(value.length, 11, NG_EXAMPLE) ?? `Start with 0 or +234, ${NG_EXAMPLE}.`;
}

/** Accepts local (0801 234 5678) and international (+234 801 234 5678) numbers; spaces etc. are stripped */
const phone = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    const issue = phoneIssue(value);
    if (issue) ctx.addIssue({ code: "custom", message: issue });
  })
  .transform((v) => v.replace(/[\s().-]/g, ""));

const requiredText = (message: string) => z.string().trim().min(1, message);

/** Local yyyy-mm-dd (toISOString would use UTC and can be a day off) */
export function localISODate(offsetDays = 0, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + offsetDays);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const tomorrow = () => localISODate(1);

// ── Auth (converted from the old yup rules) ────────────────────────────────

export const EMAIL_INVALID ="That email doesn't look right. Check for a missing @ or a typo, like name@gmail.com.";
const email = z.string().trim().min(1, "We need your email address.").pipe(z.email(EMAIL_INVALID));
const fullName = requiredText("Please tell us your name.").min(3, "Please enter your full name, like Ayo Bello.");
const newPassword = z.string().min(8, "Make it at least 8 characters. A short phrase is easy to remember and hard to guess.");
const passwordsMatch = {
  path: ["confirmPassword"],
  message: "These passwords don't match yet. Check for a typo.",
};

export const loginSchema = z.object({
  email,
  // Length rules apply at sign-up; here we only need something to send
  password: z.string().min(1, "Enter your password."),
  remember: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signUpSchema = z
  .object({
    fullName,
    phoneNumber: phone,
    email,
    password: newPassword,
    confirmPassword: z.string().min(1, "Type your password again to confirm it."),
    acceptTerms: z.boolean().refine((v) => v, "Please tick the box to agree to our Terms and Privacy Policy."),
  })
  .refine((v) => v.password === v.confirmPassword, passwordsMatch);

export type SignUpFormValues = z.input<typeof signUpSchema>;
export type SignUpFormOutput = z.output<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({ email });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email,
    password: newPassword,
    confirmPassword: z.string().min(1, "Type your new password again to confirm it."),
  })
  .refine((v) => v.password === v.confirmPassword, passwordsMatch);

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// ── Reservations and contact ────────────────────────────────────────────────

export const reservationSchema = z.object({
  fullName,
  email,
  phone,
  address: requiredText("Add your address, so we know where to deliver the car."),
  city: requiredText("Which city are you in?"),
  inspectionDate: requiredText("Pick a day to come and inspect the car.").refine(
    (d) => d >= tomorrow(),
    "Choose a day from tomorrow onwards, so we can get the car ready for you.",
  ),
  paymentMethod: z.enum(["bank_transfer", "pay_on_inspection"]),
  message: z.string().trim().max(500, "That's a long note. Please keep it under 500 characters.").optional(),
});

export type ReservationFormValues = z.input<typeof reservationSchema>;
export type ReservationFormOutput = z.output<typeof reservationSchema>;

export const contactSchema = z.object({
  fullName: requiredText("Please tell us your name."),
  email,
  phone: z.union([z.literal(""), phone]).optional(),
  subject: requiredText("Add a short subject, like “Sourcing a Lexus GX”."),
  message: requiredText("What would you like to ask?").min(10, "Tell us a little more, so we can give you a proper answer."),
});

export type ContactFormValues = z.input<typeof contactSchema>;
