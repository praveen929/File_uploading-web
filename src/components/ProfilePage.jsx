import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const getCookie = (name) => {
  const cookieString = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookieString ? decodeURIComponent(cookieString.split("=")[1]) : null;
};

// Function to strip HTML tags from description
const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const userId = getCookie("userId");

    if (!userId) {
      console.error("User ID not found in cookies");
      return;
    }

    // Fetch user details
    fetch(`http://localhost:8080/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));

    // Fetch user files
    fetch(`http://localhost:8080/files/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setFiles(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching files:", err));
  }, []);

  const handleDelete = async (fileId) => {
    const userId = getCookie("userId");
    if (!userId) return;

    if (confirm("Are you sure you want to delete this file?")) {
      try {
        await fetch(`http://localhost:8080/files/delete/${fileId}/${userId}`, {
          method: "DELETE",
        });

        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
     {user ? (
  <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 flex flex-col items-center text-center w-full max-w-md mx-auto">
    {/* Profile Icon */}
    <div className="w-24 h-24 bg-blue-100 text-blue-500 flex items-center justify-center rounded-full text-3xl font-bold mb-4">
      {user.firstName.charAt(0)}
      {user.lastName.charAt(0)}
    </div>

    {/* User Details */}
    <h2 className="text-2xl font-semibold text-gray-800">
      {user.firstName} {user.lastName}
    </h2>
    <p className="text-gray-500 text-sm capitalize">{user.gender}</p>
    <p className="text-gray-600 mt-1">{user.email}</p>

    {/* Edit Profile Button */}
    <Link
      to="/profile-edit"
      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition duration-300"
    >
      Edit Profile
    </Link>
  </div>
) : (
  <p className="text-gray-500 text-center">Loading user...</p>
)}


      <h3 className="text-xl font-semibold mb-4">Uploaded Files</h3>
      <div className="space-y-4">
        {files.length > 0 ? (
          files.map((file) => (
            <div
              key={file.id}
              className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full   flex justify-between items-center"
            >
              <div className="h-20 w-[80%] ">
                <h4 className="font-bold">{file.title}</h4>
                <p className="text-gray-700 text-nowrap truncate  w-full   mt-3">
                  <strong>Description:</strong>{" "}
                  {file.description
                    ? stripHtml(file.description)
                    : "No description available."}
                </p>
              </div>
              <div className="space-x-2">
                <Link
                  to={`/edit/${file.id}/${getCookie("userId")}/${file.title}`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </Link>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(file.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No files found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
