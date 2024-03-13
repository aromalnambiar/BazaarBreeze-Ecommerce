import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";

function Offers() {
  const [offers, setOffers] = useState([]);
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await axiosInstance.get(`/user/offers`);
        console.log("result : ", result.data.offers);
        setOffers(result.data.offers);
      } catch (error) {
        console.log("Error : ", error);
      }
    };
    fetchDetails();
  }, []);

  return (
    <section className="flex flex-col justify-center antialiased  text-gray-600 ">
      <div className="h-full">
        {/* <!-- Table --> */}
        <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
          <header className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Offers</h2>
          </header>
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">No</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Discount Type</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Discount Value</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">Description</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">OfferType</div>
                    </th>

                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">Valid to</div>
                    </th>
                  </tr>
                </thead>

                <tbody className="text-sm divide-y divide-gray-100">
                  {offers.map((item, idx) => (
                    <tr key={item._id}>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="font-medium text-gray-800">{idx + 1}</div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">{item.discountType}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left font-medium text-green-500">{item.discountValue}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-xs text-center">{item.description}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-sm text-center">{item.offerType}</div>
                      </td>

                      <td className="p-2 whitespace-nowrap">
                        <div className="text-sm text-center">{item.validUntil.slice(0, 10)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Offers;
