import { useNavigate } from "react-router-dom";

function CheckoutSuccess() {
  const navigate = useNavigate("");
  return (
    <div className="flex justify-center items-center  min-h-[54.4vh]">
      <div className="flex flex-col items-center py-10">
        <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.2" d="M44 77C62.2254 77 77 62.2254 77 44C77 25.7746 62.2254 11 44 11C25.7746 11 11 25.7746 11 44C11 62.2254 25.7746 77 44 77Z" fill="#2DB324" />
          <path d="M59.125 35.75L38.9469 55L28.875 45.375" stroke="#2DB324" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M44 77C62.2254 77 77 62.2254 77 44C77 25.7746 62.2254 11 44 11C25.7746 11 11 25.7746 11 44C11 62.2254 25.7746 77 44 77Z" stroke="#2DB324" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <h3 className="text-lg font-bold">Your order is successfully placed</h3>
        <p className="max-w-md text-sm text-center my-8 text-gray-600">Pellentesque sed lectus nec tortor tristique accumsan quis dictum risus. Donec volutpat mollis nulla non facilisis.</p>
        <div className="flex gap-6 text-sm font-bold">
          <button onClick={() => navigate("/dashboard")} className="border border-[#ffab6f] text-[#FA8232]  py-3 px-4">
            Go to Dashboard
          </button>
          <button onClick={() => navigate("/dashboard/orders")} className="bg-[#FA8232] text-white py-3 px-4">
            VIEW ORDER
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;
