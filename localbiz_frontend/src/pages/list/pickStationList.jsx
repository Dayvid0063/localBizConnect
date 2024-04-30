import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import PickupStationDatatable from "../../components/datatable/PickupDatatable";
const PickupStationLists = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <PickupStationDatatable />
      </div>
    </div>
  );
};

export default PickupStationLists;
