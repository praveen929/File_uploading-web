import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Cookies from "js-cookie"; // Import the js-cookie library

const Home = () => {
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userId, setUserId] = useState(null); // State for storing userId from cookies

  // Fetch files and users from API
  useEffect(() => {
    // Get userId from cookies
    const storedUserId = Cookies.get("userId"); // Assuming 'userId' is stored in a cookie
    setUserId(storedUserId);
    console.log("User ID from cookies: ", storedUserId); // For debugging purposes

    // Fetch files (latest 10)
    fetch("http://localhost:8080/files/all")
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

    // Fetch users (latest 10)
    fetch("http://localhost:8080/users")
      .then((response) => response.json())
      .then((data) => {
        // Filter last 10 users (most recent)
        setUsers(data.reverse().slice(0, 5)); // Reverse and slice for the latest 10
        setLoadingUsers(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoadingUsers(false);
      });
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen p-8">
      <Helmet>
        <title>Home - FileHub</title>
      </Helmet>

      <div className="max-w-7xl mx-auto text-center text-gray-600">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to FileHub</h1>
        <p className="text-xl mb-8">
          Check out the latest uploads and new users on our platform.
        </p>

        <div className="w-full md:max-w-6xl mx-auto">
          {/* Last 10 Users */}
          <div className="mb-10">
            <h2 className="text-3xl font-semibold mb-6">New Users</h2>
            {loadingUsers ? (
              <p className="text-gray-300">Loading users...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {users.map((user, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
                  >
                    <div className="flex flex-col items-center">
                      <Link to={`/users/${user.id}`}>
                        <div className="text-base text-nowrap font-semibold">
                          {user.firstName} {user.lastName}
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Last 10 Uploaded Files */}
          <div className="mb-10">
            <h2 className="text-3xl font-semibold mb-6">Latest Uploaded Files</h2>
            {loadingFiles ? (
              <p className="text-gray-300">Loading files...</p>
            ) : (
              <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-300">
                    <tr>
                      <th className="px-6 py-3 whitespace-nowrap">S. No.</th>
                      <th className="px-6 py-3">File Title</th>
                      <th className="px-6 py-3 whitespace-nowrap">
                        File Owner
                      </th>
                      <th className="px-6 py-3 whitespace-nowrap">
                        Created Date
                      </th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, index) => (
                      <tr
                        key={file.id}
                        className="bg-white border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">{file.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {file.user.firstName} {file.user.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {file.createdDate
                            ? new Date(file.createdDate).toLocaleDateString(
                                "en-GB"
                              )
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/file/${file.id}/${file.title}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
