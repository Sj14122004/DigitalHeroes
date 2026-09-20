import { useEffect, useState } from "react";
import { Check, ExternalLink, X } from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type Winner = {
  id: string;
  matchType: string;
  matchedNumbers: number;
  prizeAmount: string | number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  proofUrl: string | null;
  rejectionReason: string | null;
  user: {
    name: string;
    email: string;
  };
  draw: {
    month: number;
    year: number;
    winningNumbers: number[];
    status: string;
  };
  payment: {
    id: string;
    amount: string | number;
    status: string;
    paidAt: string | null;
  } | null;
};

const Winners = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchWinners = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/winners`, {
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load winners");
      }

      setWinners(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load winners"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  const approve = async (id: string) => {
    try {
      setActionLoading(id);

      const response = await fetch(
        `${API_URL}/api/admin/winners/${id}/approve`,
        {
          method: "POST",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Approval failed");
      }

      toast.success("Winner approved");
      await fetchWinners();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Approval failed");
    } finally {
      setActionLoading(null);
    }
  };

  const reject = async (id: string) => {
    const reason = window.prompt("Enter rejection reason:");

    if (!reason?.trim()) return;

    try {
      setActionLoading(id);

      const response = await fetch(
        `${API_URL}/api/admin/winners/${id}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ reason })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Rejection failed");
      }

      toast.success("Winner rejected");
      await fetchWinners();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Rejection failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-[#718078]">
        Loading winners...
      </div>
    );
  }

  return (
    <div className="px-4 py-8 md:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2f6f55]">
          Verification
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#173b2f]">
          Winners
        </h1>
        <p className="mt-2 text-[#718078]">
          Review winner proof and manage verification.
        </p>
      </div>

      {winners.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-[#718078]">No winners yet.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {winners.map((winner) => (
            <div
              key={winner.id}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row">
                <div>
                  <h2 className="text-lg font-semibold text-[#173b2f]">
                    {winner.user.name}
                  </h2>

                  <p className="text-sm text-[#718078]">
                    {winner.user.email}
                  </p>

                  <div className="mt-4 space-y-1 text-sm text-[#718078]">
                    <p>
                      Draw: {winner.draw.month}/{winner.draw.year}
                    </p>
                    <p>Match: {winner.matchType}</p>
                    <p>
                      Prize: ₹{Number(winner.prizeAmount).toFixed(2)}
                    </p>
                    <p>
                      Status:{" "}
                      <span className="font-medium text-[#173b2f]">
                        {winner.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {winner.proofUrl && (
                    <a
                      href={winner.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#dfe5df] px-4 py-2 text-sm font-medium text-[#173b2f] hover:bg-[#f7f5ef]"
                    >
                      <ExternalLink size={16} />
                      View Proof
                    </a>
                  )}

                  {winner.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={actionLoading === winner.id}
                        onClick={() => approve(winner.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#2f6f55] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                      >
                        <Check size={16} />
                        Approve
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading === winner.id}
                        onClick={() => reject(winner.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {winner.rejectionReason && (
                <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  <strong>Rejection reason:</strong>{" "}
                  {winner.rejectionReason}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Winners;