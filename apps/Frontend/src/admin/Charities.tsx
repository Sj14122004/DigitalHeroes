import { useEffect, useState } from "react";
import { Edit, Eye, EyeOff, Heart, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type Charity = {
  id: string;
  name: string;
  description: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
};

type FormData = {
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  isActive: boolean;
  isFeatured: boolean;
};

const emptyForm: FormData = {
  name: "",
  description: "",
  logoUrl: "",
  websiteUrl: "",
  isActive: true,
  isFeatured: false
};

const Charities = () => {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCharities = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/charities`, {
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load charities");
      }

      setCharities(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load charities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const url = editingId
        ? `${API_URL}/api/admin/charities/${editingId}`
        : `${API_URL}/api/admin/charities`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          logoUrl: form.logoUrl || undefined,
          websiteUrl: form.websiteUrl || undefined,
          isActive: form.isActive,
          isFeatured: form.isFeatured
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save charity");
      }

      toast.success(editingId ? "Charity updated" : "Charity created");
      setForm(emptyForm);
      setEditingId(null);
      await fetchCharities();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save charity");
    } finally {
      setSaving(false);
    }
  };

  const editCharity = (charity: Charity) => {
    setEditingId(charity.id);
    setForm({
      name: charity.name,
      description: charity.description,
      logoUrl: charity.logoUrl || "",
      websiteUrl: charity.websiteUrl || "",
      isActive: charity.isActive,
      isFeatured: charity.isFeatured
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const toggleStatus = async (charity: Charity) => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/charities/${charity.id}/status`,
        {
          method: "PATCH",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      toast.success("Charity status updated");
      await fetchCharities();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    }
  };

  const toggleFeatured = async (charity: Charity) => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/charities/${charity.id}/featured`,
        {
          method: "PATCH",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update featured status");
      }

      toast.success("Featured status updated");
      await fetchCharities();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update featured status");
    }
  };

  const deleteCharity = async (id: string, name: string) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/charities/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete charity");
      }

      toast.success("Charity deleted");
      await fetchCharities();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete charity");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-[#718078]">
        Loading charities...
      </div>
    );
  }

  return (
    <div className="px-4 py-8 md:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2f6f55]">
        Administration
      </p>

      <h1 className="mt-2 text-3xl font-bold text-[#173b2f]">Charities</h1>

      <p className="mt-2 text-[#718078]">
        Manage the charities available to Digital Heroes members.
      </p>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Plus size={20} className="text-[#2f6f55]" />
          <h2 className="text-xl font-semibold text-[#173b2f]">
            {editingId ? "Edit Charity" : "Add Charity"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Charity name"
              required
              className="rounded-lg border border-[#dfe5df] px-4 py-3 outline-none focus:border-[#2f6f55]"
            />

            <input
              value={form.websiteUrl}
              onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
              placeholder="Website URL"
              className="rounded-lg border border-[#dfe5df] px-4 py-3 outline-none focus:border-[#2f6f55]"
            />
          </div>

          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Charity description"
            rows={4}
            required
            className="w-full rounded-lg border border-[#dfe5df] px-4 py-3 outline-none focus:border-[#2f6f55]"
          />

          <input
            value={form.logoUrl}
            onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
            placeholder="Logo URL"
            className="w-full rounded-lg border border-[#dfe5df] px-4 py-3 outline-none focus:border-[#2f6f55]"
          />

          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm text-[#173b2f]">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Active
            </label>

            <label className="flex items-center gap-2 text-sm text-[#173b2f]">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              />
              Featured
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#173b2f] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update Charity" : "Create Charity"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-[#dfe5df] px-5 py-2.5 text-sm font-medium text-[#173b2f]"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {charities.map((charity) => (
          <div
            key={charity.id}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <div className="flex gap-4">
              {charity.logoUrl ? (
                <img
                  src={charity.logoUrl}
                  alt={charity.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#e6efe7] text-[#2f6f55]">
                  <Heart size={24} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-[#173b2f]">
                    {charity.name}
                  </h2>

                  {charity.isFeatured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                      <Star size={12} />
                      Featured
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm text-[#718078]">
                  {charity.description}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => editCharity(charity)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#dfe5df] px-3 py-2 text-sm text-[#173b2f]"
              >
                <Edit size={15} />
                Edit
              </button>

              <button
                type="button"
                onClick={() => toggleStatus(charity)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#dfe5df] px-3 py-2 text-sm text-[#173b2f]"
              >
                {charity.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                {charity.isActive ? "Deactivate" : "Activate"}
              </button>

              <button
                type="button"
                onClick={() => toggleFeatured(charity)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#dfe5df] px-3 py-2 text-sm text-[#173b2f]"
              >
                <Star size={15} />
                {charity.isFeatured ? "Unfeature" : "Feature"}
              </button>

              <button
                type="button"
                onClick={() => deleteCharity(charity.id, charity.name)}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Charities;