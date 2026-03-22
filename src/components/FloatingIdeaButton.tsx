import { useState } from "react";
import { Lightbulb, X, Send, Loader2, Handshake, MessageCircle } from "lucide-react";
import { z } from "zod";
import { submitVisitorInterest, type VisitorInterestType } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/* ── Shared base schema ─────────────────────────────── */

const baseSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().max(255).optional()
    .refine((v) => !v || z.string().email().safeParse(v).success, "Invalid email"),
  phone: z.string().trim().max(20).optional(),
  message: z.string().trim().min(1, "Message is required").max(1000),
}).refine((d) => (d.email && d.email.length > 0) || (d.phone && d.phone.length > 0), {
  message: "Email or phone is required",
  path: ["email"],
});

const partnershipSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().max(255).optional()
    .refine((v) => !v || z.string().email().safeParse(v).success, "Invalid email"),
  phone: z.string().trim().max(20).optional(),
  company: z.string().trim().max(100).optional(),
  role: z.string().trim().max(100).optional(),
  location: z.string().trim().max(100).optional(),
  partnership_area: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, "Message is required").max(1000),
}).refine((d) => (d.email && d.email.length > 0) || (d.phone && d.phone.length > 0), {
  message: "Email or phone is required",
  path: ["email"],
});

/* ── Types ──────────────────────────────────────────── */

type FormMode = "menu" | "customer_idea" | "partnership";

const inputCls =
  "w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-colors";

/* ── Component ──────────────────────────────────────── */

const FloatingIdeaButton = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("menu");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const reset = () => {
    setForm({});
    setErrors({});
    setMode("menu");
  };

  const close = () => {
    setOpen(false);
    reset();
  };

  const toggle = () => {
    if (open) close();
    else setOpen(true);
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const schema = mode === "partnership" ? partnershipSchema : baseSchema;
    const result = schema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const interestType: VisitorInterestType = mode === "partnership" ? "partnership" : "customer_idea";
      const payload = { ...result.data, interest_type: interestType } as Parameters<typeof submitVisitorInterest>[0];
      // Clean empty optional strings
      Object.keys(payload).forEach((k) => {
        const key = k as keyof typeof payload;
        if (payload[key] === "") delete payload[key];
      });

      await submitVisitorInterest(payload);
      toast({
        title: "Thank you! 🎉",
        description: mode === "partnership"
          ? "We've received your partnership inquiry."
          : "We've received your idea.",
      });
      close();
    } catch {
      toast({ title: "Oops!", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const ErrorMsg = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-xs text-destructive mt-1">{errors[field]}</p> : null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggle}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
          "bg-secondary text-secondary-foreground border-[3px] border-foreground shadow-[var(--comic-shadow)]",
          "hover:shadow-[var(--comic-shadow-hover)] hover:translate-x-[2px] hover:translate-y-[2px]",
          open && "rotate-45"
        )}
        aria-label={open ? "Close" : "Share feedback"}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Popup */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden" onClick={close} />
          <div className="fixed bottom-24 right-4 left-4 md:left-auto md:right-6 md:w-96 z-50 comic-card p-5 animate-in slide-in-from-bottom-4 fade-in duration-300 max-h-[75vh] overflow-y-auto scrollbar-hide">

            {/* ── Menu ───────────────────────── */}
            {mode === "menu" && (
              <>
                <h3 className="font-heading text-xl text-foreground mb-1">👋 How can we help?</h3>
                <p className="text-sm text-muted-foreground mb-4">Choose an option below</p>
                <div className="space-y-2">
                  <button
                    onClick={() => setMode("customer_idea")}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-border hover:border-secondary bg-background text-left transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 group-hover:bg-secondary/30 transition-colors">
                      <Lightbulb className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-heading text-base text-foreground">Share an Idea</p>
                      <p className="text-xs text-muted-foreground">Tell us what you'd love to see</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setMode("partnership")}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-border hover:border-secondary bg-background text-left transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 group-hover:bg-secondary/30 transition-colors">
                      <Handshake className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-heading text-base text-foreground">Partnership</p>
                      <p className="text-xs text-muted-foreground">Explore collaboration opportunities</p>
                    </div>
                  </button>
                </div>
              </>
            )}

            {/* ── Idea form ──────────────────── */}
            {mode === "customer_idea" && (
              <>
                <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground mb-2 flex items-center gap-1">
                  ← Back
                </button>
                <h3 className="font-heading text-xl text-foreground mb-1">💡 Got an idea?</h3>
                <p className="text-sm text-muted-foreground mb-4">Tell us what you'd love to see — we're all ears!</p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <input type="text" placeholder="Your name *" value={form.name ?? ""} onChange={(e) => update("name", e.target.value)} className={inputCls} maxLength={100} />
                    <ErrorMsg field="name" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="email" placeholder="Email" value={form.email ?? ""} onChange={(e) => update("email", e.target.value)} className={inputCls} maxLength={255} />
                    <input type="tel" placeholder="Phone" value={form.phone ?? ""} onChange={(e) => update("phone", e.target.value)} className={inputCls} maxLength={20} />
                  </div>
                  <ErrorMsg field="email" />
                  <div>
                    <textarea placeholder="Share your idea… *" value={form.message ?? ""} onChange={(e) => update("message", e.target.value)} rows={3} className={cn(inputCls, "resize-none")} maxLength={1000} />
                    <ErrorMsg field="message" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full comic-btn-secondary py-2.5 text-sm font-heading flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send Idea</>}
                  </button>
                </form>
              </>
            )}

            {/* ── Partnership form ───────────── */}
            {mode === "partnership" && (
              <>
                <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground mb-2 flex items-center gap-1">
                  ← Back
                </button>
                <h3 className="font-heading text-xl text-foreground mb-1">🤝 Partnership</h3>
                <p className="text-sm text-muted-foreground mb-4">Let's explore how we can work together!</p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <input type="text" placeholder="Your name *" value={form.name ?? ""} onChange={(e) => update("name", e.target.value)} className={inputCls} maxLength={100} />
                    <ErrorMsg field="name" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="email" placeholder="Email" value={form.email ?? ""} onChange={(e) => update("email", e.target.value)} className={inputCls} maxLength={255} />
                    <input type="tel" placeholder="Phone" value={form.phone ?? ""} onChange={(e) => update("phone", e.target.value)} className={inputCls} maxLength={20} />
                  </div>
                  <ErrorMsg field="email" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Company" value={form.company ?? ""} onChange={(e) => update("company", e.target.value)} className={inputCls} maxLength={100} />
                    <input type="text" placeholder="Your role" value={form.role ?? ""} onChange={(e) => update("role", e.target.value)} className={inputCls} maxLength={100} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Location" value={form.location ?? ""} onChange={(e) => update("location", e.target.value)} className={inputCls} maxLength={100} />
                    <input type="text" placeholder="Partnership area" value={form.partnership_area ?? ""} onChange={(e) => update("partnership_area", e.target.value)} className={inputCls} maxLength={200} />
                  </div>
                  <div>
                    <textarea placeholder="Tell us more… *" value={form.message ?? ""} onChange={(e) => update("message", e.target.value)} rows={3} className={cn(inputCls, "resize-none")} maxLength={1000} />
                    <ErrorMsg field="message" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full comic-btn-secondary py-2.5 text-sm font-heading flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send Inquiry</>}
                  </button>
                </form>
              </>
            )}

          </div>
        </>
      )}
    </>
  );
};

export default FloatingIdeaButton;
