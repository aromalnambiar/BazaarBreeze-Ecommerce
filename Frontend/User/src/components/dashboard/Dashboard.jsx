import UserDetails from "./UserDetails";
import OrderList from "./OrderList";
import SideNav from "./SideNav";
import EditProfile from "./EditProfile";

function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 my-10">
        <div className="col-span-3 border h-full">
          <SideNav />
        </div>
        <div className="col-span-9  min-h-[70vh]">
          {/* <UserDetails/> */}
          {/* <OrderList /> */}
          <EditProfile />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
