import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import ReactPaginate from "react-paginate";

function ViewCoupons() {
  const [offers, setOffers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const couponsPerPage = 10;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await axios.get(`${BASE_URL}/admin/coupon`, {
          headers: {
            Authorization: `${localStorage.getItem("adminToken")}`,
          },
          params: {
            page: pageNumber, // Send the current page number
            limit: couponsPerPage,
          },
        });
        console.log("resulst : ", result);
        setCoupons(result.data.coupons);
        setTotalPages(Math.ceil(result.data.totalCoupons / couponsPerPage));
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    fetchDetails();
  }, [pageNumber]);

  const handlePageClick = (selectedPage) => {
    setPageNumber(selectedPage.selected + 1);
  };

  return (
    <section className="flex flex-col justify-center antialiased bg-gray-100 text-gray-600  p-4">
      <div className="h-full">
        {/* <!-- Table --> */}
        <div className="w-full pb-8 max-w-6xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
          <header className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Coupons</h2>
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
                      <div className="font-semibold text-left">couponName</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">code</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">Description</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">discountType</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">Valid from</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">Valid to</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">Is active</div>
                    </th>
                  </tr>
                </thead>

                <tbody className="text-sm divide-y divide-gray-100">
                  {coupons.map((item, idx) => (
                    <tr key={item._id}>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="font-medium text-gray-800">{idx + 1}</div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">{item.couponName}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left font-medium text-green-500">{item.code}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-xs text-center">{item.description}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-sm text-center">{item.discountType}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-sm text-center">{item.validFrom.slice(0, 10)}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-sm text-center">{item.validUntil.slice(0, 10)}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-sm text-center">{item.isActive.toString()}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {totalPages > 1 && <ReactPaginate pageCount={totalPages} pageRangeDisplayed={5} marginPagesDisplayed={2} onPageChange={handlePageClick} containerClassName="pagination" activeClassName="active" />}
        </div>
      </div>
    </section>
  );
}

export default ViewCoupons;
