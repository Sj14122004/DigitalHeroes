import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Heart, Trophy, CreditCard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/logout`, {
      method: "POST",
      credentials: "include"
    });
    navigate("/login", { replace: true });
  };

  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/charities", label: "Charities", icon: Heart },
    { to: "/admin/draw", label: "Draw", icon: Trophy },
    { to: "/admin/winners", label: "Winners", icon: Trophy },
    { to: "/admin/payments", label: "Payments", icon: CreditCard }
  ];

  return (
    <div className="flex min-h-screen bg-[#f7f5ef]">
      <aside className="hidden w-64 shrink-0 border-r border-[#dfe5df] bg-[#173b2f] text-white md:block">
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <Link to="/admin" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5c8f68] font-bold">
              DH
            </span>
            <div>
              <p className="font-bold">Digital Heroes</p>
              <p className="text-xs text-white/60">Administration</p>
            </div>
          </Link>
        </div>

        <nav className="space-y-1 p-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-white/15 font-medium text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-20 items-center justify-between border-b border-[#dfe5df] bg-white px-4 md:px-8">
          <Link to="/admin" className="flex items-center gap-3 md:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5c8f68] text-sm font-bold text-white">
              DH
            </span>
            <span className="font-bold text-[#173b2f]">Digital Heroes</span>
          </Link>

          <p className="hidden font-semibold text-[#173b2f] md:block">
            Administration
          </p>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-[#173b2f] md:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        {open && (
          <div className="border-b border-[#dfe5df] bg-[#173b2f] p-4 md:hidden">
            <nav className="space-y-1">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/admin"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${
                      isActive ? "bg-white/15 text-white" : "text-white/70"
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/70"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </div>
        )}

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;