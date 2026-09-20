import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const SubscriptionSuccess = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e7f1e9]">
          <CheckCircle size={34} className="text-[#2f6f55]" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-[#173b2f]">
          Welcome, Digital Hero!
        </h1>

        <p className="mt-3 leading-7 text-[#718078]">
          Your subscription checkout was completed successfully. Your
          membership will appear in your dashboard once Stripe confirms it.
        </p>

        <Link
          to="/dashboard"
          className="mt-8 inline-flex rounded-xl bg-[#173b2f] px-6 py-3 font-medium text-white transition hover:bg-[#245542]"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;