import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import MapView from "../../components/mapview/mapview";
import Footer from "../../components/footer/footer";

const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <MapView />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
