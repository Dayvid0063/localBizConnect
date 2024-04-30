import Home from "./pages/home/Home";
import "./App.css";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { userInputs } from "./formSource";
import "./style/dark.scss";
import SignupPage from "./pages/signup/signupPage";
import ActivationPage from "./pages/activation/ActivationPage";
import LoginPage from "./pages/login/LoginPage";
import { DarkModeContext } from "./context/darkModeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./components/context/AuthenticationContext";
import { useContext } from "react";
import MapView from "./components/mapview/mapview";
import Review from "./pages/reviews/reviews";

// Main App component
function App() {
  // Access darkMode state from DarkModeContext
  const { darkMode } = useContext(DarkModeContext);

  // Wrap the entire application with AuthProvider to handle authentication
  return (
    <AuthProvider>
      <div className={darkMode ? "app dark" : "app"}>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              {/* Home page */}
              <Route index element={<Home />} />

              {/* Sign-up page */}
              <Route path="sign-up">
                <Route index element={<SignupPage />} />
              </Route>

              {/* Login page */}
              <Route path="login">
                <Route index element={<LoginPage />} />
              </Route>

              {/* Map view page */}
              <Route path="/map-view">
                <Route index element={<MapView />} />
              </Route>

              {/* User activation page */}
              <Route path="activation/:activation_token">
                <Route index element={<ActivationPage />} />
              </Route>

              {/* Users page with list and single user views */}
              <Route path="users">
                <Route index element={<List />} />
                <Route path=":userId" element={<Single />} />

                {/* New user form */}
                <Route
                  path="add-user"
                  element={<New inputs={userInputs} title="Add New User" />}
                />
              </Route>
              {/* User Reviews */}
              <Route path="reviews">
                <Route index element={<Review />} />
              </Route>
            </Route>
          </Routes>

          {/* Toast container for notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
