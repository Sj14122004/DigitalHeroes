import { useEffect, useState } from "react";
import { Heart, Search, Check } from "lucide-react";
import { toast } from "sonner";

type Charity = {
  id: string;
  name: string;
  description: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  isFeatured: boolean;
};

type Selection = {
  charityId: string;
  contributionPercent: number;
  charity: Charity;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Charity = () => {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selected, setSelected] = useState<Selection | null>(null);
  const [search, setSearch] = useState("");
  const [percentage, setPercentage] = useState(10);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [charitiesResponse, selectedResponse] = await Promise.all([
        fetch(
          `${API_URL}/api/charities${search ? `?search=${encodeURIComponent(search)}` : ""}`
        ),
        fetch(`${API_URL}/api/charities/user/selected`, {
          credentials: "include"
        })
      ]);

      if (!charitiesResponse.ok) {
        throw new Error("Unable to load charities");
      }

      const charityData = await charitiesResponse.json();
      setCharities(charityData);

      if (selectedResponse.ok) {
        const selectedData = await selectedResponse.json();

        if (selectedData) {
          setSelected(selectedData);
          setSelectedId(selectedData.charityId);
          setPercentage(selectedData.contributionPercent);
        }
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load charities"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleSelect = async () => {
    if (!selectedId) {
      toast.error("Please select a charity");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/api/charities/user/select`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          charityId: selectedId,
          contributionPercent: percentage
        })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message || "Unable to save charity selection"
        );
      }

      setSelected(data);
      toast.success("Charity contribution updated");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save charity selection"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5ef] px-4 py-10 text-[#26352b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf4ed] text-[#4f7c5a]">
            <Heart size={24} />
          </div>

          <p className="text-sm font-semibold tracking-wider text-[#4f7c5a]">
            MAKE AN IMPACT
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Choose Your Charity
          </h1>

          <p className="mt-4 text-[#718078]">
            Every Digital Heroes subscription supports charitable causes.
            Choose where your contribution makes an impact.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-xl">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa49d]"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search charities..."
              className="w-full rounded-xl border border-[#dddcd4] bg-white py-3 pl-11 pr-4 outline-none transition placeholder:text-[#a1aaa4] focus:border-[#6c9575] focus:ring-2 focus:ring-[#6c9575]/15"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full py-12 text-center text-sm text-[#8a948e]">
              Loading charities...
            </div>
          ) : charities.length === 0 ? (
            <div className="col-span-full rounded-2xl bg-white p-12 text-center">
              <Heart className="mx-auto mb-3 text-[#9aa49d]" size={32} />
              <p className="text-[#718078]">No charities found.</p>
            </div>
          ) : (
            charities.map((charity) => {
              const isSelected = selectedId === charity.id;

              return (
                <button
                  key={charity.id}
                  type="button"
                  onClick={() => setSelectedId(charity.id)}
                  className={`relative rounded-2xl border bg-white p-6 text-left transition hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(58,68,61,0.08)] ${
                    isSelected
                      ? "border-[#6c9575] ring-2 ring-[#6c9575]/15"
                      : "border-[#e4e1d8]"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-[#4f7c5a] text-white">
                      <Check size={15} />
                    </div>
                  )}

                  {charity.isFeatured && (
                    <span className="mb-4 inline-block rounded-full bg-[#edf4ed] px-3 py-1 text-xs font-semibold text-[#4f7c5a]">
                      Featured
                    </span>
                  )}

                  {charity.logoUrl ? (
                    <img
                      src={charity.logoUrl}
                      alt={charity.name}
                      className="mb-4 h-14 w-14 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#edf4ed] text-[#4f7c5a]">
                      <Heart size={24} />
                    </div>
                  )}

                  <h2 className="font-semibold text-[#26352b]">
                    {charity.name}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#718078]">
                    {charity.description}
                  </p>

                  {charity.websiteUrl && (
                    <a
                      href={charity.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="mt-4 inline-block text-sm font-medium text-[#4f7c5a] hover:text-[#365b40]"
                    >
                      Visit website
                    </a>
                  )}
                </button>
              );
            })
          )}
        </div>

        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[#e4e1d8] bg-white p-6 shadow-[0_4px_20px_rgba(58,68,61,0.05)]">
          <h2 className="text-lg font-semibold">Your Contribution</h2>

          <p className="mt-2 text-sm text-[#718078]">
            Choose how much of your subscription should go toward your selected
            charity. The minimum contribution is 10%.
          </p>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#445149]">
                Charity contribution
              </span>
              <span className="text-xl font-bold text-[#4f7c5a]">
                {percentage}%
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={percentage}
              onChange={(event) => setPercentage(Number(event.target.value))}
              className="mt-4 w-full accent-[#4f7c5a]"
            />

            <div className="mt-2 flex justify-between text-xs text-[#9aa49d]">
              <span>10%</span>
              <span>100%</span>
            </div>
          </div>

          {selected && (
            <div className="mt-5 rounded-xl bg-[#f7f5ef] p-4">
              <p className="text-sm text-[#718078]">Currently supporting</p>
              <p className="mt-1 font-semibold text-[#26352b]">
                {selected.charity.name}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSelect}
            disabled={saving || !selectedId}
            className="mt-6 w-full rounded-xl bg-[#4f7c5a] px-5 py-3.5 font-semibold text-white transition hover:bg-[#416b4b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Charity Contribution"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Charity;