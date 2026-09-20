import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const SubscriptionCancel = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f1eee7]">
          <ArrowLeft size={30} className="text-[#718078]" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-[#173b2f]">
          Checkout Cancelled
        </h1>

        <p className="mt-3 leading-7 text-[#718078]">
          No subscription was created. You can return to membership whenever
          you're ready.
        </p>

        <Link
          to="/subscription"
          className="mt-8 inline-flex rounded-xl bg-[#173b2f] px-6 py-3 font-medium text-white transition hover:bg-[#245542]"
        >
          Back to Membership
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionCancel;