import { ArrowRight, Heart, Trophy, Target, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-[#f7f5ef] text-[#26352b]">
      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#edf4ed] px-4 py-2 text-sm font-semibold text-[#4f7c5a]">
              <Sparkles size={16} />
              Play with purpose
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Your game can create{" "}
              <span className="text-[#4f7c5a]">real impact.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#718078]">
              Digital Heroes brings golf, monthly rewards and charitable giving
              together in one simple membership.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4f7c5a] px-6 py-3.5 font-semibold text-white transition hover:bg-[#416b4b]"
              >
                Become a Digital Hero
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/charity"
                className="inline-flex items-center justify-center rounded-xl border border-[#d9d8d0] bg-white px-6 py-3.5 font-semibold text-[#536158] transition hover:bg-[#f2f0e9]"
              >
                Explore Charities
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#718078]">
              <span>✓ Monthly & yearly plans</span>
              <span>✓ Minimum 10% charity contribution</span>
              <span>✓ Monthly prize draw</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-lg">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#dfeadf]" />
              <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-[#e9e4d6]" />

              <div className="relative rounded-[2rem] border border-[#e3e1d8] bg-white p-7 shadow-[0_25px_70px_rgba(58,68,61,0.12)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#718078]">Your impact</p>
                    <p className="mt-1 text-2xl font-bold">Play. Give. Win.</p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf4ed] text-[#4f7c5a]">
                    <Heart size={23} />
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-[#f7f5ef] p-5">
                    <Target className="text-[#4f7c5a]" size={22} />
                    <p className="mt-4 text-2xl font-bold">5</p>
                    <p className="mt-1 text-sm text-[#718078]">
                      Latest scores
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#f7f5ef] p-5">
                    <Trophy className="text-[#4f7c5a]" size={22} />
                    <p className="mt-4 text-2xl font-bold">45</p>
                    <p className="mt-1 text-sm text-[#718078]">
                      Number range
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-[#edf4ed] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#536158]">
                      Charity contribution
                    </span>
                    <span className="font-bold text-[#4f7c5a]">10%+</span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                    <div className="h-full w-[45%] rounded-full bg-[#6f9978]" />
                  </div>

                  <p className="mt-3 text-xs text-[#718078]">
                    Choose a cause and decide how much you want to contribute.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e5e2d9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-wider text-[#4f7c5a]">
              HOW IT WORKS
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Three simple steps
            </h2>

            <p className="mt-4 text-[#718078]">
              A straightforward membership designed around participation,
              giving and monthly rewards.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: Target,
                title: "Track your game",
                text: "Keep your latest five golf scores in your Digital Heroes profile."
              },
              {
                number: "02",
                icon: Heart,
                title: "Choose your cause",
                text: "Select a charity and contribute at least 10% of your membership."
              },
              {
                number: "03",
                icon: Trophy,
                title: "Enter the draw",
                text: "Choose five numbers and participate in the monthly prize draw."
              }
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="rounded-2xl border border-[#e5e2d9] bg-[#f7f5ef] p-7"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#4f7c5a]">
                      <Icon size={21} />
                    </div>

                    <span className="text-sm font-bold text-[#b1b8b2]">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-[#718078]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-[#26352b] px-6 py-14 text-center text-white sm:px-12">
            <Heart className="mx-auto text-[#91b697]" size={32} />

            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold sm:text-4xl">
              Your membership can be about more than the game.
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-[#c3ccc5]">
              Support a cause you care about while taking part in a monthly
              opportunity to win.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#26352b] transition hover:bg-[#edf4ed]"
            >
              Join Digital Heroes
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;