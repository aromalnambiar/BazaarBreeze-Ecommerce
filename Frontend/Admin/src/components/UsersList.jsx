import React, { useEffect, useState } from "react";
import photo from "../assets/images/Customer.png";
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
    <div className=" border border-gray-300 overflow-hidden shadow-md rounded-2xl mb-20">
      <div className="bg-white p-6 flex justify-between py-8">
        <input type="text" className="px-4 py-2 rounded-md border-2" placeholder="search user..." />
        {/* <div>
          <button className="bg-[#696cff] text-white px-8 py-2 rounded-md shadow-lg">Add Customer</button>
        </div> */}
      </div>
      <table className="min-w-full bg-white ">
        <thead>
          <tr className="text-[#566a7f] border-t ">
            <th className="py-2 text-start pl-8 font-medium border-b">USER NAME</th>
            <th className="py-2 text-start pl-8 font-medium border-b">USER ID</th>
            <th className="py-2 text-start pl-4 font-medium border-b">STATE</th>
            <th className="py-2 text-start pl-4 font-medium border-b">ORDER</th>
            <th className="py-2 text-start pl-4 font-medium border-b">STATUS</th>
            <th className="py-2 text-start pl-4 font-medium border-b">TOTAL SPENT</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item) => (
            <tr key={item._id} className="text-[#697a8d]">
              <td onClick={() => navigate("/users/view")} className="py-2 px-4 border-b flex items-center cursor-pointer gap-4 ">
                <div className="w-[2.375rem] h-[2.375rem] rounded-full ms-4 overflow-hidden border">{photo ? <FaCircleUser className="w-full h-full" /> : <img src={photo} alt="" />}</div>
                <div className="flex flex-col">
                  <p className="text-[#696cff]">{item.username}</p>
                  <small className="text-[#a1acb8]">{item.email}</small>
                </div>
              </td>
              <td className="py-2 px-4 border-b">{item._id}</td>
              <td className="py-2 px-4 border-b">{item.state || "Kerala"}</td>
              <td className="py-2 px-4 border-b">{item.order || "0"}</td>
              <td onClick={() => handleBlock(item)} className="py-2 px-4 border-b">
                {item.isBlocked ? <button className="bg-[#d4f7fe] py-2 px-6 mr-4 text-blue-800 rounded-md ">Blocked</button> : <button className="bg-[#d4f7fe] py-2 px-6 mr-4 text-blue-800 rounded-md ">active</button>}
              </td>
              <td className="py-2 px-4 border-b">{item.totalSpent || "0"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersList;
