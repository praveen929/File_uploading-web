import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null); // To store user data
  const navigate = useNavigate(); // useNavigate hook for navigation

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Get the userId from cookies
  const userId = Cookies.get("userId");

  // Fetch user data from API based on userId
  useEffect(() => {
    if (userId) {
      // Fetch user data from the server
      fetch(`http://localhost:8080/users/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data); // Store user data in state
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }

    if (
      !userId &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/register"
    ) {
      navigate("/login"); // Redirect to login page if userId doesn't exist
    }
  }, [userId, navigate]);

  // Extract initials from the user's name
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  // Logout function to remove userId from cookies and redirect to login page
  const handleLogout = () => {
    Cookies.remove("userId"); // Remove the userId cookie
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="bg-white shadow-md w-full z-50 p-4 flex justify-between items-center">
      {/* Logo Image */}
      <div className="text-lg font-semibold text-blue-600">
        <Link className="flex items-center gap-2" to="/">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWqSYIwc_3qXfVxFBFTXxYXJafeixWrEyIfw&s"
            alt="FileHub Logo"
            className="w-10 h-auto" // Adjust width and height as needed
          />
          <p className="text-2xl font-semibold text-blue-600">FileHub</p>
        </Link>
      </div>

      {/* Menu Icon for Mobile */}
      <button
        onClick={toggleMenu}
        className="lg:hidden block text-blue-600 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Links Section for Desktop */}
      <div className="lg:flex lg:gap-6 items-center gap-4 hidden lg:flex-row">
        <Link to="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        {userId ? (
          <>
            <Link to="/upload-file" className="text-blue-600 hover:underline">
              Upload File
            </Link>
           
            <Link to="/allusers" className="text-blue-600 hover:underline">
              All Users
            </Link>
            <Link to="/all-files" className="text-blue-600 hover:underline">
              All Files
            </Link>
            {/* Logout Button */}
            <Link
              onClick={handleLogout}
              className="text-blue-600 hover:underline"
            >
              Logout
            </Link>

            {/* Display the user's initials in a circle */}
            {userData && userData.firstName && userData.lastName && (
              <Link to="/profile" className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white text-xl">
                {getInitials(userData.firstName, userData.lastName)}
              </Link>
            )}
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </>
        )}
      </div>

      {/* Sliding Menu for Mobile */}
      <div
        className={`fixed top-0 right-0 w-3/4 h-full bg-white shadow-md transform transition-transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleMenu}
            className="text-blue-600 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center space-y-6 mt-10">
          <Link
            to="/"
            className="text-blue-600 hover:underline"
            onClick={toggleMenu}
          >
            Home
          </Link>
          {userId ? (
            <>
              <Link
                to="/upload-file"
                className="text-blue-600 hover:underline"
                onClick={toggleMenu}
              >
                Upload File
              </Link>
              <Link
                to="/profile"
                className="text-blue-600 hover:underline"
                onClick={toggleMenu}
              >
                Profile
              </Link>
              <Link
                to="/allusers"
                className="text-blue-600 hover:underline"
                onClick={toggleMenu}
              >
                All Users
              </Link>
              <Link
                to="/all-files"
                className="text-blue-600 hover:underline"
                onClick={toggleMenu}
              >
                All Files
              </Link>
              {/* Logout Button for Mobile */}
              <button
                onClick={handleLogout}
                className="text-blue-600 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-blue-600 hover:underline"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-blue-600 hover:underline"
                onClick={toggleMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
