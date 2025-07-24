import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import the js-cookie library

const Home = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userId, setUserId] = useState(null); // State for storing userId from cookies
  const [profileImages, setProfileImages] = useState({}); // State for storing profile images

  // Check authentication on component mount
  useEffect(() => {
    const userIdFromCookie = Cookies.get("userId");
    if (userIdFromCookie) {
      setUserId(userIdFromCookie);
      console.log("✅ User authenticated, loading personalized content");
    } else {
      console.log("👤 Guest user, showing public content");
      setUserId(null);
    }
  }, []);

  // Function to fetch profile image for a user from Render backend
  const fetchProfileImage = async (userId) => {
    try {
      // Use direct URL - let the img tag handle the loading
      const imageUrl = `https://file-uploading-web.onrender.com/users/${userId}/profile-image`;
      console.log(`Setting profile image URL for user ${userId}:`, imageUrl);

      setProfileImages((prev) => ({
        ...prev,
        [userId]: imageUrl,
      }));
    } catch (error) {
      console.error(`Error setting profile image for user ${userId}:`, error);
    }
  };

  // Fetch files and users from API
  useEffect(() => {
    console.log("📊 Fetching public data for home page");

    // Fetch files (latest 10) from Render backend
    fetch("https://file-uploading-web.onrender.com/files/all")
      .then((response) => response.json())
      .then((data) => {
        // Filter last 10 files (most recent)
        setFiles(data.reverse().slice(0, 5)); // Reverse and slice for the latest 10
        setLoadingFiles(false);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
        setLoadingFiles(false);
      });

    // Fetch users (latest 10) from Render backend
    fetch("https://file-uploading-web.onrender.com/users")
      .then((response) => response.json())
      .then((data) => {
        // Filter last 10 users (most recent)
        const recentUsers = data.reverse().slice(0, 5);
        setUsers(recentUsers);
        setLoadingUsers(false);

        // Fetch profile images for all users
        recentUsers.forEach((user) => {
          fetchProfileImage(user.id);
        });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoadingUsers(false);
      });
  }, []); // Runs once on mount - public data fetch

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Dashboard - FileHub</title>
      </Helmet>

      {/* GitHub-style Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-8 h-8 mr-3 text-gray-900 dark:text-gray-100"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Welcome back to FileHub
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/upload-file"
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Upload File
              </Link>
              <Link
                to="/allusers"
                className="border border-gray-300    px-4 py-2 rounded-md text-sm font-medium "
              >
                View All Users
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Files
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {files.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {users.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Recent Activity
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  Recent Users
                </h2>
                <Link
                  to="/allusers"
                  className="text-blue-600  hover:text-blue-800 text-sm font-medium"
                >
                  View all →
                </Link>
              </div>
            </div>

            <div className="p-6">
              {loadingUsers ? (
                <div className="text-center py-8">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium text-blue-600 dark:text-gray-300 overflow-hidden">
                          {profileImages[user.id] ? (
                            <img
                              src={profileImages[user.id]}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-full h-full object-cover"
                              onLoad={() =>
                                console.log(
                                  `Profile image loaded for user ${user.id}`
                                )
                              }
                              onError={(e) => {
                                console.log(
                                  `Profile image failed to load for user ${user.id}:`,
                                  profileImages[user.id]
                                );
                                // If image fails to load, hide it and show initials
                                e.target.style.display = "none";
                                setProfileImages((prev) => ({
                                  ...prev,
                                  [user.id]: null,
                                }));
                              }}
                            />
                          ) : user && user.firstName && user.lastName ? (
                            `${user.firstName.charAt(0)}${user.lastName.charAt(
                              0
                            )}`
                          ) : user && user.firstName ? (
                            user.firstName.charAt(0)
                          ) : (
                            "?"
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {user && user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user && user.firstName
                              ? user.firstName
                              : "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/users/${user.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Files */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Recent Files
                </h2>
                <Link
                  to="/all-files"
                  className="text-blue-600  hover:text-blue-800 text-sm font-medium"
                >
                  View all →
                </Link>
              </div>
            </div>

            <div className="p-6">
              {loadingFiles ? (
                <div className="text-center py-8">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <svg
                          className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
                            {file.title}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>
                              {file.user
                                ? `${file.user.firstName} ${file.user.lastName}`
                                : "Unknown User"}
                            </span>
                            <span className="mx-2">•</span>
                            <span>
                              {file.createdDate
                                ? new Date(
                                    file.createdDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/file/${file.id}/${file.title}`}
                        className="ml-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex-shrink-0"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
