import { useEffect, useState } from "react";
import { Play, Send, Trophy } from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type Draw = {
  id: string;
  month: number;
  year: number;
  status: "DRAFT" | "SIMULATED" | "PUBLISHED" | "COMPLETED";
  winningNumbers: number[];
  prizePool: string | number;
  jackpot: string | number;
  prizes: {
    matchType: string;
    percentage: number;
    amount: string | number;
  }[];
  winners: {
    id: string;
    userId: string;
    matchType: string;
    matchedNumbers: number;
    prizeAmount: string | number;
    status: string;
  }[];
};

const DrawManagement = () => {
  const [draw, setDraw] = useState<Draw | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDraw = async () => {
    try {
      const response = await fetch(`${API_URL}/api/draws/current`, {
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load draw");
      }

      setDraw(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load draw"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraw();
  }, []);

  const simulate = async () => {
    try {
      setActionLoading(true);

      const response = await fetch(`${API_URL}/api/draws/simulate`, {
        method: "POST",
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Draw simulation failed");
      }

      setDraw(data);
      toast.success("Draw simulated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Draw simulation failed"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const publish = async () => {
    try {
      setActionLoading(true);

      const response = await fetch(`${API_URL}/api/draws/publish`, {
        method: "POST",
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Draw publishing failed");
      }

      setDraw(data);
      toast.success("Draw published successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Draw publishing failed"
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-[#718078]">
        Loading draw...
      </div>
    );
  }

  return (
    <div className="px-4 py-8 md:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2f6f55]">
        Administration
      </p>

      <h1 className="mt-2 text-3xl font-bold text-[#173b2f]">
        Draw Management
      </h1>

      <p className="mt-2 text-[#718078]">
        Simulate and publish the current monthly draw.
      </p>

      {!draw ? (
        <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-[#718078]">No current draw available.</p>
        </div>
      ) : (
        <>
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-sm text-[#718078]">Current Draw</p>

                <h2 className="mt-1 text-2xl font-semibold text-[#173b2f]">
                  {draw.month}/{draw.year}
                </h2>

                <p className="mt-2 text-sm font-medium text-[#2f6f55]">
                  Status: {draw.status}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={simulate}
                  disabled={
                    actionLoading ||
                    (draw.status !== "DRAFT" &&
                      draw.status !== "SIMULATED")
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-[#173b2f] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                >
                  <Play size={17} />
                  {actionLoading ? "Processing..." : "Simulate Draw"}
                </button>

                <button
                  type="button"
                  onClick={publish}
                  disabled={actionLoading || draw.status !== "SIMULATED"}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2f6f55] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                >
                  <Send size={17} />
                  Publish Draw
                </button>
              </div>
            </div>
          </div>

          {draw.status !== "DRAFT" && (
            <>
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm text-[#718078]">Prize Pool</p>
                  <p className="mt-2 text-2xl font-bold text-[#173b2f]">
                    ₹{Number(draw.prizePool).toFixed(2)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm text-[#718078]">Jackpot</p>
                  <p className="mt-2 text-2xl font-bold text-[#173b2f]">
                    ₹{Number(draw.jackpot).toFixed(2)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm text-[#718078]">Winners</p>
                  <p className="mt-2 text-2xl font-bold text-[#173b2f]">
                    {draw.winners.length}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <Trophy size={20} className="text-[#2f6f55]" />
                  <h2 className="text-xl font-semibold text-[#173b2f]">
                    Winning Numbers
                  </h2>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {draw.winningNumbers.map((number) => (
                    <span
                      key={number}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#173b2f] font-semibold text-white"
                    >
                      {number}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#173b2f]">
                  Prize Breakdown
                </h2>

                <div className="mt-4 space-y-3">
                  {draw.prizes.map((prize) => (
                    <div
                      key={prize.matchType}
                      className="flex items-center justify-between rounded-xl bg-[#f7f5ef] p-4"
                    >
                      <span className="font-medium text-[#173b2f]">
                        {prize.matchType} Match ({prize.percentage}%)
                      </span>

                      <span className="font-semibold text-[#2f6f55]">
                        ₹{Number(prize.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DrawManagement;