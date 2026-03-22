import { useState } from "react";
import { Lightbulb, X, Send, Loader2 } from "lucide-react";
import { z } from "zod";
import { submitVisitorInterest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ideaSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be under 100 characters"),
  email: z
    .string()
    .trim()
    .max(255)
    .optional()
    .refine((v) => !v || z.string().email().safeParse(v).success, "Invalid email"),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional(),
  message: z
    .string()
    .trim()
    .min(1, "Your idea is required")
    .max(1000, "Must be under 1000 characters"),
}).refine((d) => (d.email && d.email.length > 0) || (d.phone && d.phone.length > 0), {
  message: "Email or phone is required",
  path: ["email"],
});

type IdeaForm = z.infer<typeof ideaSchema>;

const FloatingIdeaButton = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof IdeaForm, string>>>({});
  const [form, setForm] = useState<IdeaForm>({ name: "", email: "", phone: "", message: "" });
  const { toast } = useToast();

  const update = (field: keyof IdeaForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = ideaSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof IdeaForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof IdeaForm;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await submitVisitorInterest({
        interest_type: "customer_idea",
        name: result.data.name,
        email: result.data.email || undefined,
        phone: result.data.phone || undefined,
        message: result.data.message,
      });
      toast({ title: "Thank you! 🎉", description: "We've received your idea." });
      setForm({ name: "", email: "", phone: "", message: "" });
      setOpen(false);
    } catch {
      toast({ title: "Oops!", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
          "bg-secondary text-secondary-foreground border-[3px] border-foreground shadow-[var(--comic-shadow)]",
          "hover:shadow-[var(--comic-shadow-hover)] hover:translate-x-[2px] hover:translate-y-[2px]",
          open && "rotate-45"
        )}
        aria-label={open ? "Close idea form" : "Share your idea"}
      >
        {open ? <X className="w-6 h-6" /> : <Lightbulb className="w-6 h-6" />}
      </button>

      {/* Popup form */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />
          <div className="fixed bottom-24 right-4 left-4 md:left-auto md:right-6 md:w-96 z-50 comic-card p-5 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <h3 className="font-heading text-xl text-foreground mb-1">💡 Got an idea?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tell us what you'd love to see — we're all ears!
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Your name *"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-colors"
                  maxLength={100}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-colors"
                    maxLength={255}
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-colors"
                    maxLength={20}
                  />
                </div>
              </div>
              {errors.email && <p className="text-xs text-destructive -mt-1">{errors.email}</p>}

              <div>
                <textarea
                  placeholder="Share your idea... *"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-colors resize-none"
                  maxLength={1000}
                />
                {errors.message && <p className="text-xs text-destructive -mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full comic-btn-secondary py-2.5 text-sm font-heading flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Idea
                  </>
                )}
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default FloatingIdeaButton;
