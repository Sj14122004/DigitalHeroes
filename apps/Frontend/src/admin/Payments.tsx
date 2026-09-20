import { useEffect, useState } from "react";
import { CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type Payment = {
  id: string;
  amount: string | number;
  status: "PENDING" | "PAID" | "FAILED";
  paidAt: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  winner: {
    id: string;
    matchType: string;
    prizeAmount: string | number;
    status: string;
    draw: {
      month: number;
      year: number;
    };
  } | null;
  subscription: {
    plan: string;
    amount: string | number;
  } | null;
};

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/payments`, {
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load payments");
      }

      setPayments(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load payments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const markPaid = async (id: string) => {
    try {
      setActionLoading(id);

      const response = await fetch(
        `${API_URL}/api/admin/payments/${id}/paid`,
        {
          method: "POST",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update payment");
      }

      toast.success("Payment marked as paid");
      await fetchPayments();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update payment"
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-[#718078]">
        Loading payments...
      </div>
    );
  }

  return (
    <div className="px-4 py-8 md:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2f6f55]">
        Finance
      </p>

      <h1 className="mt-2 text-3xl font-bold text-[#173b2f]">
        Payments
      </h1>

      <p className="mt-2 text-[#718078]">
        Manage winner payouts and payment status.
      </p>

      {payments.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-[#718078]">No payments found.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div>
                  <h2 className="text-lg font-semibold text-[#173b2f]">
                    {payment.user.name}
                  </h2>

                  <p className="text-sm text-[#718078]">
                    {payment.user.email}
                  </p>

                  {payment.winner && (
                    <div className="mt-3 space-y-1 text-sm text-[#718078]">
                      <p>
                        Draw: {payment.winner.draw.month}/
                        {payment.winner.draw.year}
                      </p>
                      <p>Match: {payment.winner.matchType}</p>
                    </div>
                  )}
                </div>

                <div className="text-left lg:text-right">
                  <p className="text-2xl font-bold text-[#2f6f55]">
                    ₹{Number(payment.amount).toFixed(2)}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-sm">
                    {payment.status === "PAID" ? (
                      <>
                        <CheckCircle size={17} className="text-[#2f6f55]" />
                        <span className="font-medium text-[#2f6f55]">
                          Paid
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock size={17} className="text-[#718078]" />
                        <span className="font-medium text-[#718078]">
                          Pending
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {payment.status === "PENDING" && (
                <div className="mt-5 border-t border-[#edf0eb] pt-5">
                  <button
                    type="button"
                    disabled={actionLoading === payment.id}
                    onClick={() => markPaid(payment.id)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#173b2f] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#245542] disabled:opacity-50"
                  >
                    <CheckCircle size={17} />
                    {actionLoading === payment.id
                      ? "Updating..."
                      : "Mark as Paid"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;