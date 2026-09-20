import { useEffect, useState } from "react";
import { CalendarDays, Heart, Trophy } from "lucide-react";
import { toast } from "sonner";

type Score = {
  id: string;
  score: number;
  playedAt: string;
};

type Subscription = {
  plan: "MONTHLY" | "YEARLY";
  status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE";
  amount: string | number;
  charityPercentage: number;
  endDate?: string | null;
};

type Draw = {
  month: number;
  year: number;
  status: string;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [draw, setDraw] = useState<Draw | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const [scoresResponse, subscriptionResponse, drawResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/scores`, {
            credentials: "include"
          }),
          fetch(`${API_URL}/api/subscriptions`, {
            credentials: "include"
          }),
          fetch(`${API_URL}/api/draws/current`)
        ]);

      if (scoresResponse.ok) {
        setScores(await scoresResponse.json());
      }

      if (subscriptionResponse.ok) {
        const subscriptionData = await subscriptionResponse.json();
        setSubscription(subscriptionData);
      }

      if (drawResponse.ok) {
        setDraw(await drawResponse.json());
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const getMonthName = (month: number) =>
    new Date(2026, month - 1).toLocaleString("en-IN", {
      month: "long"
    });

  const formatDate = (date?: string | null) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center text-[#718078]">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] px-4 py-8 text-[#26352b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm font-semibold tracking-wider text-[#4f7c5a]">
            MEMBER DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Your Digital Heroes Journey
          </h1>

          <p className="mt-2 text-[#718078]">
            Play, give back and stay connected to your monthly draw.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(58,68,61,0.05)]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#718078]">Subscription</p>
              <CalendarDays size={20} className="text-[#4f7c5a]" />
            </div>

            <p className="mt-3 text-xl font-bold">
              {subscription?.status === "ACTIVE"
                ? subscription.plan === "MONTHLY"
                  ? "Monthly"
                  : "Yearly"
                : "Not Active"}
            </p>

            <p className="mt-1 text-sm text-[#718078]">
              {subscription?.endDate
                ? `Ends ${formatDate(subscription.endDate)}`
                : "Subscribe to participate"}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(58,68,61,0.05)]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#718078]">Golf Scores</p>
              <Trophy size={20} className="text-[#4f7c5a]" />
            </div>

            <p className="mt-3 text-xl font-bold">{scores.length}/5</p>

            <p className="mt-1 text-sm text-[#718078]">
              Latest scores recorded
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(58,68,61,0.05)]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#718078]">Charity</p>
              <Heart size={20} className="text-[#4f7c5a]" />
            </div>

            <p className="mt-3 text-xl font-bold">
              {subscription?.charityPercentage || 10}%
            </p>

            <p className="mt-1 text-sm text-[#718078]">
              Of your subscription
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(58,68,61,0.05)]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#718078]">Monthly Draw</p>
              <Trophy size={20} className="text-[#4f7c5a]" />
            </div>

            <p className="mt-3 text-xl font-bold">
              {draw
                ? `${getMonthName(draw.month)} ${draw.year}`
                : "Coming Soon"}
            </p>

            <p className="mt-1 text-sm capitalize text-[#718078]">
              {draw ? draw.status.toLowerCase() : "No draw created"}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(58,68,61,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recent Golf Scores</h2>
              <p className="mt-1 text-sm text-[#718078]">
                Your latest recorded rounds
              </p>
            </div>

            <a
              href="/scores"
              className="text-sm font-semibold text-[#4f7c5a] hover:text-[#365b40]"
            >
              Manage scores
            </a>
          </div>

          {scores.length === 0 ? (
            <div className="mt-6 rounded-xl bg-[#f7f5ef] p-6 text-center text-sm text-[#718078]">
              No scores recorded yet.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {scores.slice(0, 5).map((score) => (
                <div
                  key={score.id}
                  className="flex items-center justify-between rounded-xl bg-[#f7f5ef] px-4 py-3"
                >
                  <div>
                    <p className="font-semibold">Score {score.score}</p>
                    <p className="text-xs text-[#718078]">
                      {formatDate(score.playedAt)}
                    </p>
                  </div>

                  <Trophy size={18} className="text-[#4f7c5a]" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;