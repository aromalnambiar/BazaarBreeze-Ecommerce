import React, { useEffect, useState } from "react";
import photo from "../../assets/images/Customer.png";
import { FaCircleUser } from "react-icons/fa6";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import {BASE_URL} from "../../../config";

function UsersList() {
  const navigate=useNavigate();
  const [users,setUsers]=useState([]);
  // Sample data for the row
  const rowData = {
    name: "John Doe",
    email: "john@gmail.com",
    status: "Inactive",
    order: 8,
    id: "kpkl3224dsfa",
    totalSpent: "$300",
  };

  useEffect(()=>{
    const result=axios.get(`${BASE_URL}/admin/users`).then(res=>{
      console.log(res.data.users);
      setUsers(res.data.users);
      // setUsers(()=>);
    }).catch(res=>{
      console.log(res);
    })
  },[]);

  // Create an array of 5 elements for 5 rows
  const rows = Array.from({ length: 12 }, (_, index) => index);
  return (
    <div className=" border border-gray-300 overflow-hidden shadow-md rounded-2xl mb-20">
      <div className="bg-white p-6 flex justify-between py-8">
        <input type="text" className="px-4 py-2 rounded-md border-2" placeholder="search user..." />
        <div>
          <button  className="bg-[#696cff] text-white px-8 py-2 rounded-md shadow-lg">Add Customer</button>
        </div>
      </div>
      <table className="min-w-full bg-white ">
        <thead>
          <tr className="text-[#566a7f] border-t ">
            <th className="py-2 text-start pl-8 font-medium border-b">USER NAME</th>
            <th className="py-2 text-start pl-8 font-medium border-b">USER ID</th>
            <th className="py-2 text-start pl-4 font-medium border-b">STATE</th>
            <th className="py-2 text-start pl-4 font-medium border-b">ORDER</th>
            <th className="py-2 text-start pl-4 font-medium border-b">TOTAL SPENT</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item) => (
            <tr key={item._id} className="text-[#697a8d]">
              <td onClick={()=>navigate("/admin/user-details")}  className="py-2 px-4 border-b flex items-center cursor-pointer gap-4 ">
                <div className="w-[2.375rem] h-[2.375rem] rounded-full ms-4 overflow-hidden border">{photo ? <FaCircleUser className="w-full h-full" /> : <img src={photo} alt="" />}</div>
                <div  className="flex flex-col">
                  <p className="text-[#696cff]">{item.username}</p>
                  <small className="text-[#a1acb8]">{item.email}</small>
                </div>
              </td>
              <td className="py-2 px-4 border-b">{item._id}</td>
              <td className="py-2 px-4 border-b">{item.state||"Kerala"}</td>
              <td className="py-2 px-4 border-b">{item.order||"0"}</td>
              <td className="py-2 px-4 border-b">{item.totalSpent||"0"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersList;
