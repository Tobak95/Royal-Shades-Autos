import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { POLICY } from "@/lib/site";
import { contactSchema, type ContactFormValues } from "@/lib/validators";
import { wait } from "@/lib/utils";

/** No contact endpoint exists yet, so a successful submit is simulated */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  // ?subject=&message= prefill, e.g. "Request this car" from an empty showroom search
  const [params] = useSearchParams();
  const { register, handleSubmit, reset, formState } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: params.get("subject")?.slice(0, 120) ?? "",
      message: params.get("message")?.slice(0, 1000) ?? "",
    },
  });
  const { errors, isSubmitting } = formState;

  async function onSubmit() {
    await wait(600);
    reset();
    setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-panel border border-line bg-surface p-8">
        <CircleCheck aria-hidden="true" className="size-10 text-gold-text" strokeWidth={1.6} />
        <h2 className="text-2xl font-bold">Message sent</h2>
        <p className="text-sm leading-relaxed text-muted">
          Thanks for reaching out. Someone from our Lagos team will reply within {POLICY.responseTime}.
        </p>
        <Button variant="outline" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="rounded-panel border border-line bg-surface p-6 sm:p-8">
      <h2 className="text-xl font-bold">Send us a message</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input label="Full name" autoComplete="name" {...register("fullName")} error={errors.fullName?.message} />
        <Input label="Email" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
        <Input
          label="Phone number (optional)"
          type="tel"
          autoComplete="tel"
          placeholder="+234 801 234 5678"
          {...register("phone")}
          error={errors.phone?.message}
        />
        <Input label="Subject" placeholder="e.g. Sourcing a Lexus GX" {...register("subject")} error={errors.subject?.message} />
        <Textarea
          label="Message"
          rows={6}
          {...register("message")}
          error={errors.message?.message}
          containerClassName="sm:col-span-2"
        />
      </div>
      <Button type="submit" size="lg" loading={isSubmitting} className="mt-6 w-full sm:w-auto">
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
