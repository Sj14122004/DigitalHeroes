import { useEffect, useState } from "react";
import { Calendar, CheckCircle, CreditCard, XCircle } from "lucide-react";
import { toast } from "sonner";

type Subscription = {
  id: string;
  plan: "MONTHLY" | "YEARLY";
  status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE";
  amount: string | number;
  charityPercentage: number;
  charityAmount: string | number;
  prizePoolAmount: string | number;
  startDate: string;
  endDate?: string | null;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SubscriptionStatus = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const loadSubscription = async () => {
    try {
      const response = await fetch(`${API_URL}/api/subscriptions`, {
        credentials: "include"
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message || "Unable to load subscription"
        );
      }

      setSubscription(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load subscription"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  const cancelSubscription = async () => {
    if (!window.confirm("Cancel your subscription at the end of this billing period?")) {
      return;
    }

    setCancelling(true);

    try {
      const response = await fetch(`${API_URL}/api/subscriptions/cancel`, {
        method: "POST",
        credentials: "include"
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message || "Unable to cancel subscription"
        );
      }

      toast.success(data?.message || "Subscription cancellation scheduled");
      await loadSubscription();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to cancel subscription"
      );
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const getStatusClass = () => {
    if (subscription?.status === "ACTIVE") {
      return "bg-[#edf4ed] text-[#4f7c5a]";
    }

    if (subscription?.status === "PAST_DUE") {
      return "bg-amber-50 text-amber-700";
    }

    return "bg-red-50 text-red-700";
  };

  return (
    <div className="min-h-screen bg-[#f7f5ef] px-4 py-10 text-[#26352b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf4ed] text-[#4f7c5a]">
            <CreditCard size={24} />
          </div>

          <p className="text-sm font-semibold tracking-wider text-[#4f7c5a]">
            MEMBERSHIP
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            My Subscription
          </h1>

          <p className="mt-4 text-[#718078]">
            Manage your Digital Heroes membership and billing.
          </p>
        </div>

        {loading ? (
          <div className="mt-10 text-center text-[#718078]">
            Loading subscription...
          </div>
        ) : !subscription ? (
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white p-10 text-center shadow-[0_4px_20px_rgba(58,68,61,0.05)]">
            <CreditCard
              className="mx-auto mb-4 text-[#9aa49d]"
              size={38}
            />

            <h2 className="text-xl font-semibold">
              No active subscription
            </h2>

            <p className="mt-2 text-sm text-[#718078]">
              Subscribe to participate in monthly draws and support charity.
            </p>
          </div>
        ) : (
          <div className="mt-10">
            <div className="rounded-2xl border border-[#e4e1d8] bg-white p-6 shadow-[0_4px_20px_rgba(58,68,61,0.05)] sm:p-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm text-[#718078]">Current Plan</p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {subscription.plan === "MONTHLY"
                      ? "Monthly"
                      : "Yearly"}
                  </h2>

                  <p className="mt-1 text-[#718078]">
                    ₹{Number(subscription.amount).toLocaleString("en-IN")}{" "}
                    {subscription.plan === "MONTHLY" ? "/ month" : "/ year"}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass()}`}
                >
                  {subscription.status === "ACTIVE" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}
                  {subscription.status}
                </span>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-[#f7f5ef] p-5">
                  <p className="text-sm text-[#718078]">Started</p>
                  <p className="mt-1 font-semibold">
                    {formatDate(subscription.startDate)}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f7f5ef] p-5">
                  <p className="text-sm text-[#718078]">Current Period Ends</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold">
                    <Calendar size={16} className="text-[#4f7c5a]" />
                    {formatDate(subscription.endDate)}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold">Where your subscription goes</h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#e4e1d8] p-5">
                    <p className="text-sm text-[#718078]">Charity</p>
                    <p className="mt-1 text-xl font-bold text-[#4f7c5a]">
                      {subscription.charityPercentage}%
                    </p>
                    <p className="mt-1 text-sm text-[#718078]">
                      ₹{Number(subscription.charityAmount).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#e4e1d8] p-5">
                    <p className="text-sm text-[#718078]">Prize Pool</p>
                    <p className="mt-1 text-xl font-bold text-[#4f7c5a]">
                      ₹{Number(subscription.prizePoolAmount).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#e4e1d8] p-5">
                    <p className="text-sm text-[#718078]">Subscription</p>
                    <p className="mt-1 text-xl font-bold">
                      ₹{Number(subscription.amount).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>

              {subscription.status === "ACTIVE" && (
                <button
                  type="button"
                  onClick={cancelSubscription}
                  disabled={cancelling}
                  className="mt-8 w-full rounded-xl border border-red-200 px-5 py-3.5 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cancelling
                    ? "Processing..."
                    : "Cancel Subscription at Period End"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionStatus;