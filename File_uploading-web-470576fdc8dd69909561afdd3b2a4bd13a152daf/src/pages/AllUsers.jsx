import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const getCookie = (name) => {
  const cookieString = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookieString ? decodeURIComponent(cookieString.split("=")[1]) : null;
};

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImages, setProfileImages] = useState({});
  const navigate = useNavigate();

  // Get the logged-in user's ID from cookies and convert it to a number
  const loggedInUserId = parseInt(getCookie("userId"), 10); // Ensure it's a number

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch profile image for a user
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
      console.log(`Error setting profile image for user ${userId}:`, error);
    }
  };

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://file-uploading-web.onrender.com/users"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();

      // Exclude the logged-in user from the list
      const filteredUsers = data.filter((user) => user.id !== loggedInUserId);
      setUsers(filteredUsers);

      // Fetch profile images for all users
      filteredUsers.forEach((user) => {
        fetchProfileImage(user.id);
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 flex flex-col items-center p-6">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-white dark:text-blue-600 text-center mb-8">
          All Students
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading users...
          </p>
        ) : error ? (
          <p className="text-center text-red-500 dark:text-red-400">{error}</p>
        ) : users.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {users.map((user, index) => (
              <div
                key={user.id}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 dark:border-gray-600"
                onClick={() => navigate(`/users/${user.id}`)}
              >
                <div className="p-6">
                  {/* Profile Image */}
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500">
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
                      ) : (
                        <div className="w-full h-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl font-bold">
                          {user.firstName?.charAt(0)}
                          {user.lastName?.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : "Unknown User"}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3">{user.email}</p>

                    {/* Student Details */}
                    <div className="space-y-2 mb-4">
                      {user.course && (
                        <div className="bg-blue-50 px-3 py-1 rounded-full">
                          <span className="text-xs font-medium text-blue-700">
                            {user.course}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-center space-x-2">
                        {user.rollNumber && (
                          <div className="bg-gray-100 px-2 py-1 rounded">
                            <span className="text-xs text-gray-600">
                              Roll: {user.rollNumber}
                            </span>
                          </div>
                        )}
                        {user.semester && (
                          <div className="bg-gray-100 px-2 py-1 rounded">
                            <span className="text-xs text-gray-600">
                              Sem: {user.semester}
                            </span>
                          </div>
                        )}
                      </div>

                      {user.batch && (
                        <div className="bg-green-50 px-3 py-1 rounded-full">
                          <span className="text-xs font-medium text-green-700">
                            Batch: {user.batch}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/users/${user.id}`}
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
