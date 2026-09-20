import { useEffect, useRef, useState } from "react";
import { Upload, Trophy, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type Winning = {
  id: string;
  matchType: "THREE" | "FOUR" | "FIVE";
  matchedNumbers: number;
  prizeAmount: string | number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  proofUrl: string | null;
  rejectionReason: string | null;
  draw: {
    month: number;
    year: number;
    winningNumbers: number[];
    status: string;
  };
  payment: {
    amount: string | number;
    status: string;
    paidAt: string | null;
  } | null;
};

const Winnings = () => {
  const [winnings, setWinnings] = useState<Winning[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fetchWinnings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/winners/mine`, {
        credentials: "include"
      });

      if (!response.ok) throw new Error("Failed to load winnings");

      const data = await response.json();
      setWinnings(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load winnings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinnings();
  }, []);

  const uploadProof = async (winnerId: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }

    try {
      setUploading(winnerId);

      const formData = new FormData();
      formData.append("proof", file);

      const response = await fetch(
        `${API_URL}/api/winners/${winnerId}/proof`,
        {
          method: "POST",
          credentials: "include",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Proof upload failed");
      }

      toast.success("Proof uploaded successfully");
      await fetchWinnings();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Proof upload failed");
    } finally {
      setUploading(null);
    }
  };

  const handleFileChange = (
    winnerId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      uploadProof(winnerId, file);
    }

    event.target.value = "";
  };

  const getStatusIcon = (status: Winning["status"]) => {
    if (status === "APPROVED" || status === "PAID") {
      return <CheckCircle size={18} />;
    }

    if (status === "REJECTED") {
      return <XCircle size={18} />;
    }

    return <Clock size={18} />;
  };

  const getStatusText = (status: Winning["status"]) => {
    if (status === "PAID") return "Paid";
    if (status === "APPROVED") return "Approved";
    if (status === "REJECTED") return "Rejected";
    return "Proof Pending";
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f7f5ef] text-[#718078]">
        Loading winnings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2f6f55]">
            Your rewards
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#173b2f]">
            Winnings
          </h1>
          <p className="mt-2 text-[#718078]">
            Track your prizes and submit proof when required.
          </p>
        </div>

        {winnings.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
            <Trophy className="mx-auto text-[#2f6f55]" size={40} />
            <h2 className="mt-4 text-xl font-semibold text-[#173b2f]">
              No winnings yet
            </h2>
            <p className="mt-2 text-[#718078]">
              Keep playing and check back after the monthly draw.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {winnings.map((winning) => (
              <div
                key={winning.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                  <div>
                    <p className="text-sm text-[#718078]">
                      Draw: {winning.draw.month}/{winning.draw.year}
                    </p>

                    <h2 className="mt-1 text-xl font-semibold text-[#173b2f]">
                      {winning.matchType}-Number Match
                    </h2>

                    <p className="mt-2 text-sm text-[#718078]">
                      Matched numbers: {winning.matchedNumbers}
                    </p>

                    <p className="mt-3 text-2xl font-bold text-[#2f6f55]">
                      ₹{Number(winning.prizeAmount).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-[#2f6f55]">
                    {getStatusIcon(winning.status)}
                    {getStatusText(winning.status)}
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-[#f7f5ef] p-4">
                  <p className="text-sm font-medium text-[#173b2f]">
                    Winning numbers
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {winning.draw.winningNumbers.map((number) => (
                      <span
                        key={number}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173b2f] text-sm font-semibold text-white"
                      >
                        {number}
                      </span>
                    ))}
                  </div>
                </div>

                {winning.proofUrl && (
                  <div className="mt-5">
                    <a
                      href={winning.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-[#2f6f55] hover:underline"
                    >
                      View uploaded proof
                    </a>
                  </div>
                )}

                {winning.rejectionReason && (
                  <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    <strong>Rejection reason:</strong>{" "}
                    {winning.rejectionReason}
                  </div>
                )}

                {(winning.status === "PENDING" ||
                  winning.status === "REJECTED") && (
                  <div className="mt-5">
                    <input
                      ref={(element) => {
                        fileRefs.current[winning.id] = element;
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) =>
                        handleFileChange(winning.id, event)
                      }
                    />

                    <button
                      type="button"
                      disabled={uploading === winning.id}
                      onClick={() =>
                        fileRefs.current[winning.id]?.click()
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-[#173b2f] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#245542] disabled:opacity-50"
                    >
                      <Upload size={17} />
                      {uploading === winning.id
                        ? "Uploading..."
                        : winning.status === "REJECTED"
                          ? "Upload New Proof"
                          : "Upload Proof"}
                    </button>

                    <p className="mt-2 text-xs text-[#718078]">
                      Upload a screenshot as an image. Maximum size: 5 MB.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Winnings;