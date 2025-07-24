import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null); // To store user data
  const [profileImage, setProfileImage] = useState(null); // To store profile image
  const [isScrolled, setIsScrolled] = useState(false); // Track scroll state
  const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position
  const [isNavVisible, setIsNavVisible] = useState(true); // Track nav visibility
  const navigate = useNavigate(); // useNavigate hook for navigation

  const toggleMenu = () => {
    const newMenuState = !isMenuOpen;
    setIsMenuOpen(newMenuState);

    // Prevent background scroll when menu is open with multiple methods
    if (newMenuState) {
      // Method 1: CSS overflow
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      // Method 2: CSS classes
      document.body.classList.add("no-scroll");
      document.documentElement.classList.add("no-scroll");

      // Method 3: Position fixed
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Restore all scroll settings
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";

      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
  };

  // Get the userId from cookies
  const userId = Cookies.get("userId");

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Add background when scrolled
      setIsScrolled(currentScrollY > 10);

      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past 100px
        setIsNavVisible(false);
      } else {
        // Scrolling up or at top
        setIsNavVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Cleanup scroll prevention on component unmount
  useEffect(() => {
    return () => {
      // Restore all scroll settings when component unmounts
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, []);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        toggleMenu(); // Use toggleMenu to properly restore scroll
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  // Prevent touch scroll when menu is open
  useEffect(() => {
    const preventTouchMove = (e) => {
      if (isMenuOpen) {
        e.preventDefault();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("touchmove", preventTouchMove, {
        passive: false,
      });
    }

    return () => {
      document.removeEventListener("touchmove", preventTouchMove);
    };
  }, [isMenuOpen]);

  // Fetch user data from API based on userId
  useEffect(() => {
    if (userId) {
      // Fetch user data from the server
      fetch(`https://file-uploading-web.onrender.com/users/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data); // Store user data in state
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });

      // Fetch profile image
      fetch(
        `https://file-uploading-web.onrender.com/users/${userId}/profile-image`
      )
        .then((response) => {
          if (response.ok) {
            return response.blob();
          }
          throw new Error("No profile image");
        })
        .then(() => {
          // Use direct URL instead of blob conversion
          const imageUrl = `https://file-uploading-web.onrender.com/users/${userId}/profile-image`;
          setProfileImage(imageUrl);
        })
        .catch((error) => {
          console.log("No profile image found");
          setProfileImage(null);
        });
    }

    // Define public routes that don't require authentication
    const publicRoutes = ["/", "/login", "/register", "/all-files"];

    // Dashboard requires authentication
    const isDashboardRoute = window.location.pathname === "/dashboard";

    // Check if current path is a file view route (public) or user profile route
    const isFileViewRoute = window.location.pathname.startsWith("/file/");
    const isUserProfileRoute = window.location.pathname.startsWith("/users/");

    // Only redirect to login if user is not on a public route
    if (
      !userId &&
      !publicRoutes.includes(window.location.pathname) &&
      !isFileViewRoute &&
      !isUserProfileRoute
    ) {
      navigate("/login"); // Redirect to login page if userId doesn't exist
    }
  }, [userId, navigate]);

  // Extract initials from the user's name
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  // Logout function to remove userId from cookies and redirect to login page
  const handleLogout = () => {
    Cookies.remove("userId"); // Remove the userId cookie
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${
        isNavVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link className="flex items-center space-x-2" to="/">
              <svg
                className="w-8 h-8 text-gray-900 dark:text-gray-100 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                FileHub
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:text-gray-900 dark:focus:text-gray-100 p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {userId && (
              <Link
                to="/dashboard"
                className="text-gray-900 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
            )}
            {userId ? (
              <>
                <Link
                  to="/upload-file"
                  className="text-gray-900 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Upload
                </Link>
                <Link
                  to="/allusers"
                  className="text-gray-900 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Users
                </Link>
                <Link
                  to="/all-files"
                  className="text-gray-900 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Files
                </Link>
                <Link
                  to="/profile-edit"
                  className="text-gray-900 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Settings
                </Link>

                {/* Theme Toggle & User Profile & Logout */}
                <div className="flex items-center ml-4 pl-4 border-l border-gray-200 dark:border-gray-700 space-x-3 cursor-pointer">
                  {/* Theme Toggle */}
                  <ThemeToggle className="" />

                  {/* Profile Avatar */}
                  {userData && userData.firstName && userData.lastName && (
                    <Link
                      to="/profile"
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm overflow-hidden hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      title={`${userData.firstName} ${userData.lastName}`}
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(userData.firstName, userData.lastName)
                      )}
                    </Link>
                  )}

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="text-gray-900 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Theme Toggle for non-logged in users */}
                <ThemeToggle />

                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`mobile-menu fixed top-0 right-0 w-80 h-screen bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-300 z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
        style={{
          backgroundColor: "rgb(var(--bg-secondary, 255 255 255))",
          boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.15)",
          minHeight: "100vh",
          height: "100vh",
        }}
      >
        <div
          className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          style={{ backgroundColor: "var(--bg-tertiary, rgb(243 244 246))" }}
        >
          <div className="flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-gray-900 dark:text-gray-100"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              FileHub
            </span>
          </div>
          <button
            onClick={toggleMenu}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          className="flex-1 p-4 overflow-y-auto"
          style={{
            backgroundColor: "var(--bg-secondary, rgb(255 255 255))",
            minHeight: "calc(100vh - 80px)",
            height: "calc(100vh - 80px)",
          }}
        >
          {/* Profile Section for Mobile */}
          {userId && userData && userData.firstName && userData.lastName && (
            <div
              className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6 border border-gray-200 dark:border-gray-700"
              style={{
                backgroundColor: "var(--bg-tertiary, rgb(243 244 246))",
              }}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-lg overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(userData.firstName, userData.lastName)
                )}
              </div>
              <div>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {userData.firstName} {userData.lastName}
                </p>
                {userData.email && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {userData.email}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Theme Toggle for Mobile */}
          <div className="mb-6">
            <ThemeToggle className="w-full" />
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {userId && (
              <Link
                to="/dashboard"
                className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
            )}
            {userId ? (
              <>
                <Link
                  to="/upload-file"
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  Upload File
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <Link
                  to="/allusers"
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  All Users
                </Link>
                <Link
                  to="/all-files"
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  All Files
                </Link>
                <Link
                  to="/profile-edit"
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  Account Settings
                </Link>

                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 bg-gray-900 text-white hover:bg-gray-800 rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
