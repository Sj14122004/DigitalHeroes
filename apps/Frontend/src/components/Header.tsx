import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isProtectedRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/scores") ||
    location.pathname.startsWith("/subscription") ||
    location.pathname.startsWith("/winnings") ||
    location.pathname.startsWith("/admin");

  useEffect(() => {
    if (!isProtectedRoute) {
      setUser(null);
      return;
    }

    const getUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include"
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch {
        setUser(null);
      }
    };

    getUser();
  }, [isProtectedRoute, location.pathname]);

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
    } finally {
      setUser(null);
      setMenuOpen(false);
      navigate("/login");
    }
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-[#4f7c5a]"
      : "text-[#536158] hover:text-[#4f7c5a]";

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e5dc] bg-[#f7f5ef]/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#26352b]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4f7c5a] text-sm text-white">
            DH
          </span>
          Digital Heroes
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {!user ? (
            <>
              <Link to="/" className={isActive("/")}>
                Home
              </Link>

              <Link to="/charity" className={isActive("/charity")}>
                Charity
              </Link>

              <Link to="/draw" className={isActive("/draw")}>
                Monthly Draw
              </Link>

              <Link
                to="/login"
                className="font-medium text-[#536158] hover:text-[#4f7c5a]"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-[#4f7c5a] px-5 py-2.5 font-semibold text-white transition hover:bg-[#416b4b]"
              >
                Join Now
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={isActive("/dashboard")}>
                Dashboard
              </Link>

              <Link to="/scores" className={isActive("/scores")}>
                Scores
              </Link>

              <Link to="/charity" className={isActive("/charity")}>
                Charity
              </Link>

              <Link to="/draw" className={isActive("/draw")}>
                Draw
              </Link>

              <Link to="/winnings" className={isActive("/winnings")}>
                Winnings
              </Link>

              <Link
                to="/subscription/status"
                className={isActive("/subscription/status")}
              >
                Subscription
              </Link>

              <button
                type="button"
                onClick={logout}
                className="font-medium text-[#536158] hover:text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="rounded-lg p-2 text-[#536158] md:hidden"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[#e8e5dc] bg-[#f7f5ef] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {!user ? (
              <>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-[#536158]"
                >
                  Home
                </Link>

                <Link
                  to="/charity"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-[#536158]"
                >
                  Charity
                </Link>

                <Link
                  to="/draw"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-[#536158]"
                >
                  Monthly Draw
                </Link>

                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-[#536158]"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 rounded-xl bg-[#4f7c5a] px-4 py-3 text-center font-semibold text-white"
                >
                  Join Now
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-[#536158]"
                >
                  Dashboard
                </Link>

                <Link
                  to="/scores"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-[#536158]"
                >
                  Scores
                </Link>

                <Link
                  to="/charity"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-[#536158]"
                >
                  Charity
                </Link>

                <Link
                  to="/draw"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-[#536158]"
                >
                  Draw
                </Link>

                <Link
                  to="/winnings"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-[#536158]"
                >
                  Winnings
                </Link>

                <Link
                  to="/subscription/status"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-[#536158]"
                >
                  Subscription
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg px-3 py-3 text-left text-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;