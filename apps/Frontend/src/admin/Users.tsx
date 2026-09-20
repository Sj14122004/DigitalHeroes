import { useEffect, useState } from "react";
import { Trash2, Shield, User } from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  _count: {
    subscriptions: number;
    scores: number;
    winners: number;
  };
};

const Users = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load users");
      }

      setUsers(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (
    id: string,
    role: "USER" | "ADMIN"
  ) => {
    try {
      setActionLoading(id);

      const response = await fetch(
        `${API_URL}/api/admin/users/${id}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ role })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update role");
      }

      toast.success("User role updated");
      await fetchUsers();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update role"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const removeUser = async (id: string, name: string) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(id);

      const response = await fetch(
        `${API_URL}/api/admin/users/${id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      toast.success("User deleted");
      await fetchUsers();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-[#718078]">
        Loading users...
      </div>
    );
  }

  return (
    <div className="px-4 py-8 md:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2f6f55]">
        Administration
      </p>

      <h1 className="mt-2 text-3xl font-bold text-[#173b2f]">
        Users
      </h1>

      <p className="mt-2 text-[#718078]">
        Manage registered Digital Heroes members.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b border-[#edf0eb] bg-[#f7f5ef]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#173b2f]">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#173b2f]">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#173b2f]">
                  Subscription
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#173b2f]">
                  Scores
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#173b2f]">
                  Winners
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[#173b2f]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[#edf0eb] last:border-0"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6efe7] text-[#2f6f55]">
                        {user.role === "ADMIN" ? (
                          <Shield size={18} />
                        ) : (
                          <User size={18} />
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-[#173b2f]">
                          {user.name}
                        </p>
                        <p className="text-sm text-[#718078]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <select
                      value={user.role}
                      disabled={actionLoading === user.id}
                      onChange={(e) =>
                        changeRole(
                          user.id,
                          e.target.value as "USER" | "ADMIN"
                        )
                      }
                      className="rounded-lg border border-[#dfe5df] bg-white px-3 py-2 text-sm text-[#173b2f] outline-none"
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>

                  <td className="px-6 py-5 text-sm text-[#718078]">
                    {user._count.subscriptions}
                  </td>

                  <td className="px-6 py-5 text-sm text-[#718078]">
                    {user._count.scores}
                  </td>

                  <td className="px-6 py-5 text-sm text-[#718078]">
                    {user._count.winners}
                  </td>

                  <td className="px-6 py-5 text-right">
                    <button
                      type="button"
                      disabled={actionLoading === user.id}
                      onClick={() => removeUser(user.id, user.name)}
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;