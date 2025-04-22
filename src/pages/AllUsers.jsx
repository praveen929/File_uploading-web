import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get the logged-in user's ID from localStorage and convert it to a number
  const loggedInUserId = parseInt(localStorage.getItem("userId"), 10); // Ensure it's a number

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      
      // Exclude the logged-in user from the list
      const filteredUsers = data.filter((user) => user.id !== loggedInUserId);
      setUsers(filteredUsers);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center p-6">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full bg-white p-4">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
          All Users
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : users.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">S. No.</th>
                <th className="px-6 py-3 whitespace-nowrap">User Name</th>
                <th className="px-6 py-3 whitespace-nowrap">Email</th>
                <th className="px-6 py-3">Gender</th>
                <th className="px-6 py-3 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {index + 1}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">{user.firstName + " " + user.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td><td className="px-6 py-4 whitespace-nowrap">{user.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap"> <Link
                    to={`/users/${user.id}`}
                    className="font-medium text-blue-600  hover:underline"
                  >
                    View
                  </Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
