import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-[#e8e5dc] bg-[#26352b] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6f9978] text-sm">
                DH
              </span>
              Digital Heroes
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#c3ccc5]">
              Play with purpose. Support meaningful causes. Every subscription
              helps create a positive impact.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Explore</h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-[#c3ccc5]">
              <Link to="/" className="hover:text-white">
                Home
              </Link>

              <Link to="/charity" className="hover:text-white">
                Charity
              </Link>

              <Link to="/draw" className="hover:text-white">
                Monthly Draw
              </Link>

              <Link to="/subscription" className="hover:text-white">
                Membership
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Our Mission</h3>

            <p className="mt-4 text-sm leading-6 text-[#c3ccc5]">
              Your participation helps support charitable causes while giving
              you the opportunity to win monthly prizes.
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm text-[#c3ccc5]">
              <Heart size={16} className="text-[#8eb395]" />
              Play. Give. Make an impact.
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-[#aeb8b1]">
          © {new Date().getFullYear()} Digital Heroes. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;