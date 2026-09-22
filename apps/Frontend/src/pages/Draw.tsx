import { useEffect, useState } from "react";
import { Check, Trophy, Sparkles } from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type DrawData = {
  id: string;
  month: number;
  year: number;
  status: "DRAFT" | "SIMULATED" | "PUBLISHED" | "COMPLETED";
  winningNumbers: number[];
  prizePool: string | number;
  jackpot: string | number;
  prizes: {
    id: string;
    matchType: "THREE" | "FOUR" | "FIVE";
    percentage: number;
    amount: string | number;
  }[];
};

type Entry = {
  id: string;
  numbers: number[];
};

const Draw = () => {
  const [draw, setDraw] = useState<DrawData | null>(null);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadDraw = async () => {
    try {
      const [drawResponse, entryResponse] = await Promise.all([
        fetch(`${API_URL}/api/draws/current`, {
          credentials: "include"
        }),
        fetch(`${API_URL}/api/draws/my-entry`, {
          credentials: "include"
        })
      ]);

      if (!drawResponse.ok) {
        throw new Error("Unable to load draw");
      }

      const drawData = await drawResponse.json();
      setDraw(drawData);

      if (entryResponse.ok) {
        const entryData = await entryResponse.json();

        if (entryData) {
          setEntry(entryData);
          setSelectedNumbers(entryData.numbers);
        }
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load draw"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDraw();
  }, []);

  const toggleNumber = (number: number) => {
  if (entry || draw?.status !== "DRAFT") return;

  setSelectedNumbers((current) => {
    if (current.includes(number)) {
      return current.filter((item) => item !== number);
    }

    if (current.length >= 5) {
      toast.error("You can select exactly 5 numbers");
      return current;
    }

    return [...current, number].sort((a, b) => a - b);
  });
};

  const submitEntry = async () => {
  if (draw?.status !== "DRAFT") {
    toast.error("Draw entry is closed");
    return;
  }

  if (entry) {
    toast.error("You have already entered this draw");
    return;
  }

  if (selectedNumbers.length !== 5) {
    toast.error("Select exactly 5 numbers");
    return;
  }

  setSubmitting(true);

  try {
    const response = await fetch(`${API_URL}/api/draws/entry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        numbers: selectedNumbers
      })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        typeof data === "string"
          ? data
          : data?.message || "Unable to enter draw"
      );
    }

    setEntry(data);
    setSelectedNumbers(data.numbers);
    toast.success("Your draw entry has been saved");
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "Unable to enter draw"
    );
  } finally {
    setSubmitting(false);
  }
 };

  const getMonthName = () => {
    if (!draw) return new Date().toLocaleString("en-IN", { month: "long" });

    return new Date(draw.year, draw.month - 1).toLocaleString("en-IN", {
      month: "long"
    });
  };

  const getMatchCount = () => {
    if (!draw?.winningNumbers?.length || !entry) return 0;

    return entry.numbers.filter((number) =>
      draw.winningNumbers.includes(number)
    ).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center text-[#718078]">
        Loading draw...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] px-4 py-10 text-[#26352b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf4ed] text-[#4f7c5a]">
            <Trophy size={24} />
          </div>

          <p className="text-sm font-semibold tracking-wider text-[#4f7c5a]">
            MONTHLY DRAW
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            {getMonthName()} {draw?.year || new Date().getFullYear()}
          </h1>

          <p className="mt-4 text-[#718078]">
            Pick 5 numbers from 1–45 and give yourself a chance to win while
            supporting charity.
          </p>
        </div>

        {!draw ? (
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white p-10 text-center shadow-[0_4px_20px_rgba(58,68,61,0.05)]">
            <Sparkles className="mx-auto mb-4 text-[#4f7c5a]" size={34} />
            <h2 className="text-xl font-semibold">Draw is opening soon</h2>
            <p className="mt-2 text-sm text-[#718078]">
              The current monthly draw has not been created yet.
            </p>
          </div>
        ) : (
          <>
            <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 text-center">
                <p className="text-sm text-[#718078]">Prize Pool</p>
                <p className="mt-1 text-2xl font-bold text-[#4f7c5a]">
                  ₹{Number(draw.prizePool).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 text-center">
                <p className="text-sm text-[#718078]">5-Match Jackpot</p>
                <p className="mt-1 text-2xl font-bold text-[#4f7c5a]">
                  ₹{Number(draw.jackpot).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 text-center">
                <p className="text-sm text-[#718078]">Status</p>
                <p className="mt-1 text-2xl font-bold capitalize text-[#26352b]">
                  {draw.status.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-[#e4e1d8] bg-white p-6 shadow-[0_4px_20px_rgba(58,68,61,0.05)] sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Choose Your Numbers</h2>
                  <p className="mt-1 text-sm text-[#718078]">
                    Select 5 unique numbers between 1 and 45.
                  </p>
                </div>

                <div className="rounded-full bg-[#edf4ed] px-4 py-2 text-sm font-semibold text-[#4f7c5a]">
                  {selectedNumbers.length}/5
                </div>
              </div>

              <div className="mt-7 grid grid-cols-5 gap-2 sm:grid-cols-9 md:grid-cols-10">
                {Array.from({ length: 45 }, (_, index) => index + 1).map(
                  (number) => {
                    const selected = selectedNumbers.includes(number);
                    const winning =
                      draw.status === "PUBLISHED" &&
                      draw.winningNumbers.includes(number);

                    return (
                      <button
                        key={number}
                        type="button"
                        disabled={!!entry || draw.status !== "DRAFT"}
                        onClick={() => toggleNumber(number)}
                        className={`relative flex aspect-square items-center justify-center rounded-xl text-sm font-semibold transition ${
                          winning
                            ? "bg-[#4f7c5a] text-white"
                            : selected
                              ? "bg-[#dcebdd] text-[#365b40] ring-2 ring-[#6c9575]"
                              : "bg-[#f7f5ef] text-[#536158] hover:bg-[#edf4ed]"
                        } ${entry || draw.status !== "DRAFT" ? "cursor-default" : ""}`}
                      >
                        {number}

                        {selected && (
                          <Check
                            size={11}
                            className="absolute right-1 top-1"
                          />
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              {!entry && draw.status === "DRAFT" && (
                <button
                  type="button"
                  onClick={submitEntry}
                  disabled={submitting || selectedNumbers.length !== 5}
                  className="mt-7 w-full rounded-xl bg-[#4f7c5a] px-5 py-3.5 font-semibold text-white transition hover:bg-[#416b4b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Enter Monthly Draw"}
                </button>
              )}

              {entry && (
                <div className="mt-7 rounded-xl bg-[#edf4ed] p-4 text-center">
                  <p className="text-sm font-medium text-[#4f7c5a]">
                    Your numbers have been submitted for this draw.
                  </p>
                </div>
              )}
            </div>

            {draw.status === "PUBLISHED" && entry && (
              <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-[#e4e1d8] bg-white p-6 shadow-[0_4px_20px_rgba(58,68,61,0.05)] sm:p-8">
                <h2 className="text-xl font-semibold text-center">
                  Draw Results
                </h2>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {draw.winningNumbers.map((number) => (
                    <div
                      key={number}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4f7c5a] font-bold text-white"
                    >
                      {number}
                    </div>
                  ))}
                </div>

                <div className="mt-7 rounded-xl bg-[#f7f5ef] p-5 text-center">
                  <p className="text-sm text-[#718078]">Your matching numbers</p>
                  <p className="mt-1 text-3xl font-bold text-[#4f7c5a]">
                    {getMatchCount()}
                  </p>

                  {getMatchCount() >= 3 && (
                    <p className="mt-2 font-medium text-[#365b40]">
                      Congratulations! You matched {getMatchCount()} numbers.
                    </p>
                  )}
                </div>
              </div>
            )}

            {draw.prizes.length > 0 && (
              <div className="mx-auto mt-8 max-w-4xl">
                <h2 className="mb-4 text-center text-xl font-semibold">
                  Prize Breakdown
                </h2>

                <div className="grid gap-4 sm:grid-cols-3">
                  {draw.prizes.map((prize) => (
                    <div
                      key={prize.id}
                      className="rounded-2xl bg-white p-5 text-center"
                    >
                      <p className="font-semibold">
                        {prize.matchType === "THREE"
                          ? "3 Numbers"
                          : prize.matchType === "FOUR"
                            ? "4 Numbers"
                            : "5 Numbers"}
                      </p>

                      <p className="mt-2 text-2xl font-bold text-[#4f7c5a]">
                        ₹{Number(prize.amount).toLocaleString("en-IN")}
                      </p>

                      <p className="mt-1 text-sm text-[#718078]">
                        {prize.percentage}% of prize pool
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Draw;