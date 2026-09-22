import { useEffect, useState } from "react";
import { CalendarDays, Heart, ShieldCheck, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
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
          fetch(`${API_URL}/api/scores`, { credentials: "include" }),
          fetch(`${API_URL}/api/subscriptions`, { credentials: "include" }),
          fetch(`${API_URL}/api/draws/current`)
        ]);

      if (scoresResponse.ok) {
        setScores(await scoresResponse.json());
      }

      if (subscriptionResponse.ok) {
        setSubscription(await subscriptionResponse.json());
      }

      if (drawResponse.ok) {
        setDraw(await drawResponse.json());
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const isSubscribed = subscription?.status === "ACTIVE";

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
      <div className="min-h-screen bg-[#f7f5ef] px-4 py-16 text-center text-[#64756a]">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] px-4 py-10 text-[#26352b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.14em] text-[#4f8060]">
            Member Dashboard
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Your Digital Heroes Journey
          </h1>

          <p className="mt-3 text-base text-[#6d7c72]">
            {isSubscribed
              ? "Play, give back and stay connected to your monthly draw."
              : "Start your journey with golf, giving and the chance to win."}
          </p>
        </div>

        {!isSubscribed ? (
          <div className="mb-8 overflow-hidden rounded-3xl bg-[#315b40] p-7 text-white shadow-sm sm:p-9">
            <div className="max-w-3xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Trophy size={24} />
              </div>

              <p className="mb-2 text-sm font-medium uppercase tracking-[0.14em] text-white/70">
                Your journey starts here
              </p>

              <h2 className="text-2xl font-semibold sm:text-3xl">
                Turn your golf scores into something meaningful.
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-white/75">
                Subscribe to record your golf scores, participate in monthly
                prize draws and support a charity of your choice.
              </p>

              <Link
                to="/subscription"
                className="mt-6 inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#315b40] transition hover:bg-[#f2f0e9]"
              >
                Subscribe Now
              </Link>
            </div>
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-[#718077]">Subscription</span>
              <CalendarDays size={22} className="text-[#4f8060]" />
            </div>

            {isSubscribed ? (
              <>
                <p className="text-2xl font-semibold">
                  {subscription.plan === "MONTHLY" ? "Monthly" : "Yearly"}
                </p>
                <p className="mt-1 text-sm text-[#718077]">
                  {subscription.endDate
                    ? `Renews ${formatDate(subscription.endDate)}`
                    : "Active subscription"}
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-semibold">Not Active</p>
                <p className="mt-1 text-sm text-[#718077]">
                  Subscribe to participate
                </p>
                <Link
                  to="/subscription"
                  className="mt-4 inline-block text-sm font-medium text-[#4f8060] hover:underline"
                >
                  View plans →
                </Link>
              </>
            )}
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-[#718077]">Golf Scores</span>
              <Trophy size={22} className="text-[#4f8060]" />
            </div>

            {isSubscribed ? (
              <>
                <p className="text-2xl font-semibold">{scores.length}/5</p>
                <p className="mt-1 text-sm text-[#718077]">
                  Latest scores recorded
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-semibold">Start 0/5</p>
                <p className="mt-1 text-sm text-[#718077]">
                  Subscribe to record scores
                </p>
              </>
            )}
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-[#718077]">Charity</span>
              <Heart size={22} className="text-[#4f8060]" />
            </div>

            {isSubscribed ? (
              <>
                <p className="text-2xl font-semibold">
                  {subscription.charityPercentage}%
                </p>
                <p className="mt-1 text-sm text-[#718077]">
                  Of your subscription
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-semibold">Make an impact</p>
                <p className="mt-1 text-sm text-[#718077]">
                  Choose your charity contribution
                </p>
              </>
            )}
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-[#718077]">Monthly Draw</span>
              <Trophy size={22} className="text-[#4f8060]" />
            </div>

            {isSubscribed ? (
              <>
                <p className="text-2xl font-semibold">
                  {draw
                    ? `${getMonthName(draw.month)} ${draw.year}`
                    : "Upcoming"}
                </p>
                <p className="mt-1 text-sm text-[#718077]">
                  {draw?.status === "PUBLISHED"
                    ? "Published"
                    : "Participation active"}
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-semibold">Subscription required</p>
                <p className="mt-1 text-sm text-[#718077]">
                  Join to enter monthly draws
                </p>
              </>
            )}
          </div>
        </div>

        {isSubscribed ? (
          <div className="mt-8 rounded-3xl bg-white p-7 shadow-sm sm:p-8">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Recent Golf Scores</h2>
                <p className="mt-1 text-sm text-[#718077]">
                  Your latest recorded rounds
                </p>
              </div>

              <Link
                to="/scores"
                className="text-sm font-medium text-[#4f8060] hover:underline"
              >
                Manage scores
              </Link>
            </div>

            {scores.length > 0 ? (
              <div className="space-y-3">
                {scores.map((score) => (
                  <div
                    key={score.id}
                    className="flex items-center justify-between rounded-2xl bg-[#f7f5ef] px-5 py-4"
                  >
                    <div>
                      <p className="font-medium">Score {score.score}</p>
                      <p className="mt-1 text-sm text-[#718077]">
                        {formatDate(score.playedAt)}
                      </p>
                    </div>

                    <Trophy size={20} className="text-[#4f8060]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-[#f7f5ef] px-5 py-10 text-center">
                <p className="font-medium">No scores recorded yet.</p>
                <Link
                  to="/scores"
                  className="mt-2 inline-block text-sm font-medium text-[#4f8060] hover:underline"
                >
                  Add your first score →
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-7 shadow-sm">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf4ee]">
                <Trophy size={21} className="text-[#4f8060]" />
              </div>
              <h2 className="text-lg font-semibold">Track your game</h2>
              <p className="mt-2 text-sm leading-6 text-[#718077]">
                Keep your latest five golf scores in one place and follow your
                progress.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf4ee]">
                <Heart size={21} className="text-[#4f8060]" />
              </div>
              <h2 className="text-lg font-semibold">Give back</h2>
              <p className="mt-2 text-sm leading-6 text-[#718077]">
                Choose a charity and turn part of your subscription into
                meaningful support.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf4ee]">
                <ShieldCheck size={21} className="text-[#4f8060]" />
              </div>
              <h2 className="text-lg font-semibold">Join the draw</h2>
              <p className="mt-2 text-sm leading-6 text-[#718077]">
                Active subscribers can participate in the monthly Digital
                Heroes prize draw.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;