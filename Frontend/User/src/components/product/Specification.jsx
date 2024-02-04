function Specification({ specifications }) {
  console.log("specifications : ", specifications);
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50  dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Feature
            </th>
            <th scope="col" className="px-6 py-3">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {specifications.map((item,index) => {
            return (
              <tr key={index} className="bg-white border-b  ">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                  {item.name}
                </th>
                <td className="px-6 py-4">{item.value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Specification;
