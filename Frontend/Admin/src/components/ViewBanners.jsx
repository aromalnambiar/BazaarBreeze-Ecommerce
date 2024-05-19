import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { BASE_URL } from "../../config";
import axios from "axios";

function ViewBanners() {
  const [banners, setBanners] = useState([]);
  const [toggle] = useState(false);
  const [pageNumber, setPageNumber] = useState(1); // Default to the first page
  const [totalPages, setTotalPages] = useState(1); // Default to 1 page
  const bannersPerPage = 10; // Adjust as needed

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await axios.get(`${BASE_URL}/admin/banner`, {
          headers: {
            Authorization: `${localStorage.getItem("adminToken")}`,
          },
          params: {
            page: pageNumber, // Send the current page number
            limit: bannersPerPage,
          },
        });

        setBanners(result.data.banners);
        setTotalPages(Math.ceil(result.data.totalBanners / bannersPerPage));
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    fetchDetails();
  }, [pageNumber, toggle]);

  const handlePageClick = (selectedPage) => {
    setPageNumber(selectedPage.selected + 1); // Page is 0-indexed
  };

  return (
    <>
      <section className="flex flex-col justify-center antialiased bg-gray-100 text-gray-600  p-4">
        <div className="h-full">
          {/* <!-- Table --> */}
          <div className="w-full max-w-6xl pb-8 mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
            <header className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Banners</h2>
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
                        <div className="font-semibold text-left">Image</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Title</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Link</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">
                          description
                        </div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">
                          startDate
                        </div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">endDate</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">
                          isActive
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-sm divide-y divide-gray-100">
                    {banners.map((item, idx) => (
                      <tr key={item._id}>
                        <td className="p-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="font-medium text-gray-800">
                              {idx + 1}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">
                            <img src={`${item.publicId}`} alt="" srcSet="" />
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left font-medium text-green-500">
                            {item.title}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-xs text-center">{item.link}</div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-sm text-center">
                            {item.description}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-sm text-center">
                            {item.startDate.slice(0, 10)}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-sm text-center">
                            {item.endDate.slice(0, 10)}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div
                            onClick={() => handleActiveStatus(item._id)}
                            className="text-sm text-center"
                          >
                            <button
                              className={`px-3 py-1 rounded-full ${
                                item.isActive
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {item.isActive ? "Active" : "Inactive"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {totalPages > 1 && (
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName="pagination"
                activeClassName="active"
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default ViewBanners;
