import { useState } from "react";
import { Check, Crown, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type Plan = "MONTHLY" | "YEARLY";

const plans = [
  {
    id: "MONTHLY" as Plan,
    name: "Monthly",
    price: "₹499",
    period: "/ month",
    description: "Flexible monthly participation",
    popular: false
  },
  {
    id: "YEARLY" as Plan,
    name: "Yearly",
    price: "₹4,999",
    period: "/ year",
    description: "Best value for a full year",
    popular: true
  }
];

const benefits = [
  "Participate in monthly prize draws",
  "Track your latest five golf scores",
  "Choose your charity contribution",
  "View your draw and winnings",
  "Support meaningful charitable causes"
];

const Subscription = () => {
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);

  const handleSubscribe = async (plan: Plan) => {
    setLoadingPlan(plan);

    try {
      const response = await fetch(`${API_URL}/api/subscriptions/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ plan })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message || "Unable to start checkout"
        );
      }

      if (!data?.url) {
        throw new Error("Stripe checkout URL was not returned");
      }

      window.location.href = data.url;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to start checkout"
      );
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5ef] px-4 py-10 text-[#26352b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf4ed] text-[#4f7c5a]">
            <Crown size={24} />
          </div>

          <p className="text-sm font-semibold tracking-wider text-[#4f7c5a]">
            JOIN DIGITAL HEROES
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Play. Give. Win.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-[#718078]">
            Join the community, take part in monthly prize draws and make a
            difference through your chosen charity.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl border bg-white p-7 shadow-[0_8px_30px_rgba(58,68,61,0.07)] ${
                plan.popular
                  ? "border-[#6c9575]"
                  : "border-[#e4e1d8]"
              }`}
            >
              {plan.popular && (
                <div className="absolute right-6 top-6 rounded-full bg-[#edf4ed] px-3 py-1 text-xs font-semibold text-[#4f7c5a]">
                  POPULAR
                </div>
              )}

              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf4ed] text-[#4f7c5a]">
                <Sparkles size={21} />
              </div>

              <h2 className="text-xl font-semibold">{plan.name}</h2>

              <p className="mt-2 text-sm text-[#8a948e]">
                {plan.description}
              </p>

              <div className="mt-6 flex items-end gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="mb-1 text-sm text-[#8a948e]">
                  {plan.period}
                </span>
              </div>

              <div className="my-7 h-px bg-[#eceae3]" />

              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#edf4ed] text-[#4f7c5a]">
                      <Check size={13} strokeWidth={3} />
                    </div>

                    <span className="text-sm text-[#5d6962]">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleSubscribe(plan.id)}
                disabled={loadingPlan !== null}
                className="mt-8 w-full rounded-xl bg-[#4f7c5a] px-5 py-3.5 font-semibold text-white transition hover:bg-[#416b4b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingPlan === plan.id
                  ? "Opening Stripe..."
                  : `Choose ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[#e4e1d8] bg-white p-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4ed] text-[#4f7c5a]">
              <Heart size={20} />
            </div>

            <div>
              <h3 className="font-semibold">Your subscription makes an impact</h3>
              <p className="mt-1 text-sm leading-6 text-[#718078]">
                At least 10% of your subscription contribution goes toward
                supporting charitable causes. You can choose where your
                contribution makes an impact.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-[#8a948e]">
          <ShieldCheck size={17} />
          Secure payments powered by Stripe
        </div>
      </div>
    </div>
  );
};

export default Subscription;