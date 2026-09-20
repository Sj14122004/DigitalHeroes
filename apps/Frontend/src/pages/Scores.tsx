import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Pencil, Plus, Target, Trash2, X } from "lucide-react";
import { toast } from "sonner";

type GolfScore = {
  id: string;
  score: number;
  playedAt: string;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Scores = () => {
  const [scores, setScores] = useState<GolfScore[]>([]);
  const [score, setScore] = useState("");
  const [playedAt, setPlayedAt] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadScores = async () => {
    try {
      const response = await fetch(`${API_URL}/api/scores`, {
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(typeof data === "string" ? data : "Failed to load scores");
      }

      setScores(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load scores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScores();
  }, []);

  const resetForm = () => {
    setScore("");
    setPlayedAt("");
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const numericScore = Number(score);

    if (!numericScore || numericScore < 1 || numericScore > 45) {
      toast.error("Score must be between 1 and 45");
      return;
    }

    if (!playedAt) {
      toast.error("Please select the date");
      return;
    }

    setSaving(true);

    try {
      const endpoint = editingId
        ? `${API_URL}/api/scores/${editingId}`
        : `${API_URL}/api/scores`;

      const response = await fetch(endpoint, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          score: numericScore,
          playedAt: new Date(`${playedAt}T00:00:00.000Z`).toISOString()
        })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message || "Unable to save score"
        );
      }

      toast.success(editingId ? "Score updated successfully" : "Score added successfully");
      resetForm();
      await loadScores();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save score");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: GolfScore) => {
    setEditingId(item.id);
    setScore(String(item.score));
    setPlayedAt(item.playedAt.slice(0, 10));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this score?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/scores/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "Unable to delete score");
      }

      toast.success("Score deleted successfully");
      await loadScores();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete score");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5ef] px-4 py-8 text-[#1f2933] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-wider text-[#4f7c5a]">
            GOLF SCORES
          </p>
          <h1 className="text-3xl font-bold text-[#26352b] sm:text-4xl">
            Manage Your Scores
          </h1>
          <p className="mt-3 max-w-2xl text-[#718078]">
            Keep your latest five golf scores up to date for your Digital Heroes
            journey.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="h-fit rounded-2xl border border-[#e4e1d8] bg-white p-6 shadow-[0_4px_20px_rgba(58,68,61,0.05)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#26352b]">
                  {editingId ? "Edit Score" : "Add Score"}
                </h2>
                <p className="mt-1 text-sm text-[#8a948e]">
                  {editingId
                    ? "Update your golf score."
                    : "Add a score from your latest round."}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf4ed] text-[#4f7c5a]">
                <Target size={21} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#445149]">
                  Score
                </label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  value={score}
                  onChange={(event) => setScore(event.target.value)}
                  placeholder="Enter score (1–45)"
                  className="w-full rounded-xl border border-[#dddcd4] bg-[#fbfaf7] px-4 py-3 text-[#26352b] outline-none transition placeholder:text-[#a1aaa4] focus:border-[#6c9575] focus:ring-2 focus:ring-[#6c9575]/15"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#445149]">
                  Played Date
                </label>
                <input
                  type="date"
                  value={playedAt}
                  onChange={(event) => setPlayedAt(event.target.value)}
                  className="w-full rounded-xl border border-[#dddcd4] bg-[#fbfaf7] px-4 py-3 text-[#26352b] outline-none transition focus:border-[#6c9575] focus:ring-2 focus:ring-[#6c9575]/15"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4f7c5a] px-4 py-3 font-semibold text-white transition hover:bg-[#416b4b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingId ? <Pencil size={18} /> : <Plus size={18} />}
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Score"
                    : "Add Score"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#dddcd4] px-4 py-3 text-sm font-semibold text-[#5d6962] transition hover:bg-[#f7f5ef]"
                >
                  <X size={17} />
                  Cancel Edit
                </button>
              )}
            </form>

            <div className="mt-6 rounded-xl bg-[#f7f5ef] p-4">
              <p className="text-sm font-medium text-[#445149]">
                Latest 5 scores
              </p>
              <p className="mt-1 text-xs leading-5 text-[#8a948e]">
                When you add a sixth score, your oldest score is automatically
                removed.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e4e1d8] bg-white p-6 shadow-[0_4px_20px_rgba(58,68,61,0.05)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#26352b]">
                  Your Latest Scores
                </h2>
                <p className="mt-1 text-sm text-[#8a948e]">
                  {scores.length} of 5 scores recorded
                </p>
              </div>

              <div className="rounded-full bg-[#edf4ed] px-3 py-1.5 text-sm font-semibold text-[#4f7c5a]">
                {scores.length}/5
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-[#8a948e]">
                Loading scores...
              </div>
            ) : scores.length === 0 ? (
              <div className="rounded-xl bg-[#f7f5ef] px-6 py-12 text-center">
                <Target className="mx-auto mb-3 text-[#9aa49d]" size={32} />
                <h3 className="font-semibold text-[#445149]">
                  No scores yet
                </h3>
                <p className="mt-1 text-sm text-[#8a948e]">
                  Add your first golf score to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {scores.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-[#eceae3] bg-[#fbfaf7] p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf4ed] font-bold text-[#4f7c5a]">
                        {item.score}
                      </div>

                      <div>
                        <p className="font-medium text-[#26352b]">
                          Score {index + 1}
                        </p>
                        <p className="mt-1 text-sm text-[#8a948e]">
                          {new Date(item.playedAt).toLocaleDateString(
                            undefined,
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#718078] transition hover:bg-[#edf4ed] hover:text-[#4f7c5a]"
                        title="Edit score"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#9a7777] transition hover:bg-red-50 hover:text-red-500"
                        title="Delete score"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scores;