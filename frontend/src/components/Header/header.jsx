import React, { useEffect, useState } from "react";
import logo from "../../assets/commprepai.jpg";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../actions/auth.actions.js";
import { User, LogOut, Menu } from "lucide-react";
import NavIconItem from "../NavIconItem.jsx";
import LoadingBar from "react-top-loading-bar";
import { toast } from "react-toastify";
import useHideOnRoutes from "../Hooks/useHideOnRoutes.js";
import { Drawer, IconButton, Button } from "@mui/material";
import { Box } from "@mui/system";

const Header = () => {
  const [progress, setProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, isProcessing } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const shouldHideHeader = useHideOnRoutes();

  useEffect(() => {
    if (!isProcessing) {
      if (isAuthenticated && location.pathname === "/") {
        navigate("/practice");
      } else if (!isAuthenticated && location.pathname === "/") {
        navigate("/");
      }
    }
  }, [isAuthenticated, isProcessing, navigate]);

  const handleLogout = async () => {
    setProgress(10);
    dispatch(logoutUser())
      .unwrap()
      .then((result) => {
        setProgress(70);
        toast.success(result.message, {
          position: "top-center",
          autoClose: 1000,
          theme: "light",
        });
        navigate("/");
      })
      .catch((error) => {
        toast.error(error || "An error occurred during Logout.", {
          position: "top-center",
          autoClose: 1000,
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
        } 
         items-center py-2 px-3 rounded-md text-gray-600 font-semibold inline-flex transition-all duration-200`
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
      {!shouldHideHeader ? (
        <nav className="bg-white/80 backdrop-blur-md shadow-md">
          <div className="flex justify-between items-center h-16 mx-auto w-[80%]">
            <Link to="/" className="flex-shrink-0">
              <img
                src={logo}
                alt="Commprep.ai logo"
                width={180}
                height={60}
                className="h-10 w-auto"
              />
            </Link>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <IconButton
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </IconButton>
              <Drawer
                anchor="left"
                open={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                PaperProps={{
                  sx: { backgroundColor: "#e3f7f5" },
                }}
              >
                <Box
                  role="presentation"
                  onClick={() => setIsMobileMenuOpen(false)}
                  onKeyDown={() => setIsMobileMenuOpen(false)}
                >
                  <nav className="flex flex-col space-y-4 p-4 w-64">
                    {isProcessing ? (
                      <span className="text-center">Loading....</span>
                    ) : isAuthenticated ? (
                      <>
                        {renderNavLink("/practice", "Practice")}
                        {renderNavLink("/takeTest", "Test")}
                        {renderNavLink("/feedback", "Feedback")}
                        {renderNavLink("/contact", "Contact")}
                        <NavIconItem to="/profile" icon={User} text="Profile" />
                        <button
                          onClick={handleLogout}
                          className="p-2 rounded-md hover:text-gray-700 hover:bg-gray-200/60 transition-all duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                          </div>
                        </button>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </nav>
                </Box>
              </Drawer>
            </div>

            {/* Desktop Navigation */}
            {isProcessing ? (
              <span className="text-center hidden md:flex">Loading....</span>
            ) : (
              <div className="hidden md:flex items-center space-x-8">
                {isAuthenticated ? (
                  <>
                    {renderNavLink("/practice", "Practice")}
                    {renderNavLink("/takeTest", "Test")}
                    {renderNavLink("/feedback", "Feedback")}
                    {renderNavLink("/contact", "Contact")}
                    <NavIconItem to="/profile" icon={User} />
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-200/60 transition-all duration-200"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <div className="flex space-x-4">
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
                )}
              </div>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
};

export default Header;
