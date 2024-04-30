import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import BannerDatatable from "../../components/datatable/BannerDatatable";
const BannerLists = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <BannerDatatable />
      </div>
    </div>
  );
};

export default BannerLists;
