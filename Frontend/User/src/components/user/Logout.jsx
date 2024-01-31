// import

function Logout() {
  const handleLogout = () => {};
  return (
    <form onSubmit={handleLogout}>
      <div className="border text-sm shadow-2xl max-w-[424px] flex flex-col mx-auto p-8 gap-6 my-16">
        <div className="flex justify-between">
          <button className="w-full border-b-4 border-orange-400 pb-4">Logout</button>
        </div>
        <button type="submit" className="bg-[#FA8232] text-white py-3 rounded-sm text-sm mt-8 mb-10">
          LOGOUT
        </button>
      </div>
    </form>
  );
}

export default Logout;
