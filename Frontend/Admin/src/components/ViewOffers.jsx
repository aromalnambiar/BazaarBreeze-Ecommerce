import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import ReactPaginate from "react-paginate";

function ViewOffers() {
  const [offers, setOffers] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const offersPerPage = 10;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await axios.get(`${BASE_URL}/admin/offer`, {
          headers: {
            Authorization: `${localStorage.getItem("adminToken")}`,
          },
          params: {
            page: pageNumber,
            limit: offersPerPage,
          },
        });

        setOffers(result.data.offers);
        setTotalPages(Math.ceil(result.data.totalOffers / offersPerPage));
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    fetchDetails();
  }, [pageNumber, toggle]);

  const handleActiveStatus = async (id) => {
    try {
      const result = await axios.put(`${BASE_URL}/admin/offer/${id}/status`, {
        headers: {
          Authorization: `${localStorage.getItem("adminToken")}`,
        },
      });
      console.log("result : ", result);
      setToggle((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageClick = (selectedPage) => {
    setPageNumber(selectedPage.selected + 1);
  };

  return (
    <section className="flex flex-col justify-center antialiased bg-gray-100 text-gray-600  p-4">
      <div className="h-full">
        {/* <!-- Table --> */}
        <div className="w-full max-w-6xl pb-8 mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
          <header className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Customers</h2>
          </header>
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Name</div>
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
                        <div className="text-sm text-center">{item.validFrom.slice(0, 10)}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-sm text-center">{item.validUntil.slice(0, 10)}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div onClick={() => handleActiveStatus(item._id)} className="text-sm text-center">
                          <button className={`px-3 py-1 rounded-full ${item.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{item.isActive ? "Active" : "Inactive"}</button>
                        </div>
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

export default ViewOffers;
