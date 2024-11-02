import React, { useEffect, useState } from "react";
import logo from "../../assets/commprepai.jpg";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../actions/auth.actions.js";
import { User, LogOut } from "lucide-react";
import NavIconItem from "../NavIconItem.jsx";
import LoadingBar from "react-top-loading-bar";
import { toast } from "react-toastify";

const Header = () => {
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
 
  const navigate = useNavigate();
  const location = useLocation(); // Access the current location

  useEffect(() => {
    if (!isLoading) {
      // Redirect logic on initial load
      if (isAuthenticated && location.pathname === "/") {
        navigate("/practice");
      } else if (!isAuthenticated && location.pathname === "/") {
        navigate("/home");
      }
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  const handleLogout = async () => {
    setProgress(10);
    dispatch(logoutUser())
      .unwrap()
      .then((result) => {
        setProgress(70);
        toast.success(result.message, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/home");
      })
      .catch((error) => {
        toast.error(error || "An error occurred during Logout.", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.error("Error during Logout:", error);
      })
      .finally(() => {
        setProgress(100);
      });
  };

  const renderNavLink = (to, label) => (
    <NavLink
      to={to}
      key={label}
      className={({ isActive }) =>
        `${
          isActive
            ? "text-secondary"
            : "hover:text-gray-700 hover:bg-gray-200/60"
        } items-center py-2 px-3 rounded-md text-gray-600 font-semibold inline-flex transition-all duration-200 hover:scale-110`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <header className="shadow sticky z-50 top-0">
      <LoadingBar
        color="#02cbc3"
        progress={progress}
        height={4}
        onLoaderFinished={() => setProgress(0)}
      />
      <nav className="bg-white/80 backdrop-blur-md shadow-md">
        <div className="flex justify-between items-center h-16 mx-auto w-[80%]">
          <Link to="/home" className="flex-shrink-0">
            <img
              src={logo}
              alt="Commprep.ai logo"
              width={180}
              height={60}
              className="h-10 w-auto"
            />
          </Link>

          {/* Loading State */}
          {isLoading ? (
            <span className="text-center">Loading....</span>
          ) : !isAuthenticated ? (
            <div className="flex items-baseline space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium border border-gray-500"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-white bg-black hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="flex justify-between items-center w-full">
              {/* Middle Navigation Links */}
              <ul className="flex flex-grow justify-center space-x-8">
                {renderNavLink("/practice", "Practice")}
                {renderNavLink("/takeTest", "Test")}
                {renderNavLink("/feedback", "Feedback")}
                {renderNavLink("/contact", "Contact")}
              </ul>
              {/* Right Side Profile and Notification Icons */}
              <div className="flex items-center space-x-4">
                <NavIconItem to="/profile" icon={User} />
                <button
                  onClick={handleLogout}
                  className="items-center p-2 rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-200/60 transition-all duration-200 hover:scale-110"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
