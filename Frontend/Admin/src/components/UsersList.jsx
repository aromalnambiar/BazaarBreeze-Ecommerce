import React, { useEffect, useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";
import Swal from "sweetalert2";

function UsersList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isToggle, setIsToggle] = useState(false);

  useEffect(() => {
    const result = axios
      .get(`${BASE_URL}/admin/users`, {
        headers: {
          Authorization: `${localStorage.getItem("adminToken")}`,
        },
      })
      .then((res) => {
        console.log(res.data.users);
        setUsers(res.data.users);
      })
      .catch((res) => {
        console.log(res);
      });
  }, [isToggle]);

  const handleBlock = async (item) => {
    // console.log(`${localStorage.getItem("adminToken")}`);
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${item.isBlocked ? "Unblock" : "Block"} the user`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${item.isBlocked ? "Unblock" : "Block"} it!`,
    });

    if (confirmed.isConfirmed) {
      try {
        const result = await axios.put(
          `${BASE_URL}/admin/users/${item._id}`,
          {},
          {
            headers: {
              Authorization: `${localStorage.getItem("adminToken")}`,
            },
          }
        );

        console.log(result);
        Swal.fire({
          title: "Success!",
          text: `${result.data.message}`,
          icon: "success",
        });
        setIsToggle((prev) => !prev);
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "Not Success!",
          text: "operation not successful",
          icon: "error",
        });
      }
    }
  };
  return (
    <section className="flex flex-col justify-center antialiased bg-gray-100 text-gray-600  p-4">
      <div className="h-full">
        <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
          <div className="bg-white p-6 flex items-center justify-between py-8">
            <input type="text" className="px-4 py-2 rounded-md border-2" placeholder="search products..." />
            <h2 className="font-semibold text-gray-800 text-center mr-8">Users</h2>
          </div>

          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">USER NAME</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">GENDER</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">AGE</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">STATUS</div>
                    </th>
                  </tr>
                </thead>

                <tbody className="text-sm divide-y divide-gray-100">
                  {users.map((item, idx) => (
                    <tr key={item?._id}>
                      <td className="py-2 px-4 border-b flex items-center  gap-4 ">
                        <div onClick={() => navigate("/adminpanel/users/view", { state: { userId: item?._id } })} className="w-[2.375rem] cursor-pointer h-[2.375rem] rounded-full ms-4 overflow-hidden border">
                          {item?.image ? <img src={`${BASE_URL}/uploads/${item.image}`} /> : <FaCircleUser className="w-full h-full" />}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-[#696cff]">{item.username}</p>
                          <small className="text-[#a1acb8]">{item.email}</small>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left font-medium">{item.gender || "not specified"}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left font-medium ">{item.age || "not specified"}</div>
                      </td>
                      <td onClick={() => handleBlock(item)} className="p-2 whitespace-nowrap">
                        {item.isBlocked ? <button className="bg-[#d4f7fe] py-2 px-6 mr-4 text-blue-800 rounded-md ">Blocked</button> : <button className="bg-[#d4f7fe] py-2 px-6 mr-4 text-blue-800 rounded-md ">active</button>}
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

export default UsersList;
