import React from "react";
import { BASE_URL } from "../../../config";

function Wishlist() {
  const tableItems = [
    {
      avatar: "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ",
      name: "Liam James",
      email: "liamjames@example.com",
      phone_nimber: "+1 (555) 000-000",
      position: "Software engineer",
      salary: "$100K",
    },
    {
      avatar: "https://randomuser.me/api/portraits/men/86.jpg",
      name: "Olivia Emma",
      email: "oliviaemma@example.com",
      phone_nimber: "+1 (555) 000-000",
      position: "Product designer",
      salary: "$90K",
    },
    {
      avatar: "https://randomuser.me/api/portraits/women/79.jpg",
      name: "William Benjamin",
      email: "william.benjamin@example.com",
      phone_nimber: "+1 (555) 000-000",
      position: "Front-end developer",
      salary: "$80K",
    },
    {
      avatar: "https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg",
      name: "Henry Theodore",
      email: "henrytheodore@example.com",
      phone_nimber: "+1 (555) 000-000",
      position: "Laravel engineer",
      salary: "$120K",
    },
    {
      avatar: "https://images.unsplash.com/photo-1439911767590-c724b615299d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ",
      name: "Amelia Elijah",
      email: "amelia.elijah@example.com",
      phone_nimber: "+1 (555) 000-000",
      position: "Open source manager",
      salary: "$75K",
    },
  ];

  return (
    <div>
      <table className="w-full  table-auto border text-sm text-left shadow-lg">
        <thead className="bg-[#F2F4F5] text-gray-600 font-medium border-b">
          <tr className="uppercase">
            <th className="py-3 px-6">Products</th>
            <th className="py-3 px-6">Price</th>
            <th className="py-3 px-6">Quantity</th>
            <th className="py-3 px-6">Sub total</th>
            <th className="py-3 px-6">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 divide-y">
          {tableItems.map((item, idx) => (
            <tr key={item?.name}>
              <td className="flex items-center gap-x-3 py-3 px-6 whitespace-nowrap">
                {/* <p>{item._id}</p> */}
                <img src={""} className="w-10 h-10 " />
                <div>
                  <span className="block text-gray-700 text-sm font-medium">{item.name}</span>
                  <span className="block text-gray-700 text-xs">{item.email}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{item.phone_nimber}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.salary}</td>

              <td className="px-6 py-4 whitespace-nowrap">{item.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Wishlist;
