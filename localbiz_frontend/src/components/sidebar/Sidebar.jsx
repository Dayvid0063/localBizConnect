// Sidebar.jsx

import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { useAuth } from "../context/AuthenticationContext";
import { DarkModeContext } from "../../context/darkModeContext";

const Sidebar = () => {
  const { isLoggedIn, logout } = useAuth();
  const { dispatch } = useContext(DarkModeContext);

  const handleLogout = () => {
    logout();
    // Clear any other data you might have stored
  };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">LocalBiz Connect</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li>
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </li>
          <Link to="/businesses" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Businesses</span>
            </li>
          </Link>
          <p className="title">USER</p>
          {isLoggedIn ? (
            <>
              <li>
                <PersonOutlineIcon className="icon" />
                <span>Profile</span>
              </li>
              <li onClick={() => handleLogout()}>
                <ExitToAppIcon className="icon" />
                <span>Logout</span>
              </li>
              <Link to="/reviews" style={{ textDecoration: "none" }}>
                <p className="title">REVIEWS</p>
                <li>
                  <RateReviewIcon className="icon" />
                  <span>Reviews</span>
                </li>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <li>
                  <ExitToAppIcon className="icon" />
                  <span>Login</span>
                </li>
              </Link>
              <Link to="/sign-up" style={{ textDecoration: "none" }}>
                <li>
                  <ExitToAppIcon className="icon" />
                  <span>Sign Up</span>
                </li>
              </Link>
            </>
          )}
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
