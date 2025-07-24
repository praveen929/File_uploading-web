import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

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
  const { actualTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [profileImage, setProfileImage] = useState(null);

  // Dynamic text color based on theme
  const getTextColor = () => {
    return actualTheme === "dark" ? "#ffffff" : "#000000";
  };

  const getLabelColor = () => {
    return actualTheme === "dark" ? "#d1d5db" : "#000000";
  };

  useEffect(() => {
    const userId = getCookie("userId");

    if (!userId) {
      console.error("User ID not found in cookies");
      return;
    }

    // Fetch user details
    fetch(`https://file-uploading-web.onrender.com/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));

    // Fetch user files
    fetch(`https://file-uploading-web.onrender.com/files/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setFiles(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching files:", err));

    // Fetch profile image
    fetch(
      `https://file-uploading-web.onrender.com/users/${userId}/profile-image`
    )
      .then((res) => {
        if (res.ok) {
          return res.blob();
        }
        throw new Error("No profile image");
      })
      .then(() => {
        // Use direct URL instead of blob conversion
        const imageUrl = `https://file-uploading-web.onrender.com/users/${userId}/profile-image`;
        setProfileImage(imageUrl);
      })
      .catch((err) => console.log("No profile image found"));
  }, []);

  const handleDelete = async (fileId) => {
    const userId = getCookie("userId");
    if (!userId) return;

    if (confirm("Are you sure you want to delete this file?")) {
      try {
        await fetch(
          `https://file-uploading-web.onrender.com/files/delete/${fileId}/${userId}`,
          {
            method: "DELETE",
          }
        );

        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl bg-gray-50 dark:bg-gray-900 min-h-screen">
      {user ? (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 border-4 border-gray-300 dark:border-gray-500">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-4xl font-bold">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* User Information */}
            <div className="flex-1 text-center lg:text-left">
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: getTextColor() }}
              >
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-lg mb-4" style={{ color: getTextColor() }}>
                {user.email}
              </p>

              {/* Student Details Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {user.course && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span
                      className="text-sm font-medium"
                      style={{ color: getLabelColor() }}
                    >
                      Course
                    </span>
                    <p style={{ color: getTextColor() }}>{user.course}</p>
                  </div>
                )}
                {user.rollNumber && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span
                      className="text-sm font-medium"
                      style={{ color: getLabelColor() }}
                    >
                      Roll Number
                    </span>
                    <p style={{ color: getTextColor() }}>{user.rollNumber}</p>
                  </div>
                )}
                {user.batch && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span
                      className="text-sm font-medium"
                      style={{ color: getLabelColor() }}
                    >
                      Batch
                    </span>
                    <p style={{ color: getTextColor() }}>{user.batch}</p>
                  </div>
                )}
                {user.department && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span
                      className="text-sm font-medium"
                      style={{ color: getLabelColor() }}
                    >
                      Department
                    </span>
                    <p style={{ color: getTextColor() }}>{user.department}</p>
                  </div>
                )}
                {user.semester && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span
                      className="text-sm font-medium"
                      style={{ color: getLabelColor() }}
                    >
                      Semester
                    </span>
                    <p style={{ color: getTextColor() }}>
                      Semester {user.semester}
                    </p>
                  </div>
                )}
                {user.phoneNumber && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span
                      className="text-sm font-medium"
                      style={{ color: getLabelColor() }}
                    >
                      Phone
                    </span>
                    <p style={{ color: getTextColor() }}>{user.phoneNumber}</p>
                  </div>
                )}
                {user.gender && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span
                      className="text-sm font-medium"
                      style={{ color: getLabelColor() }}
                    >
                      Gender
                    </span>
                    <p className="capitalize" style={{ color: getTextColor() }}>
                      {user.gender}
                    </p>
                  </div>
                )}
                {user.admissionYear && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span
                      className="text-sm font-medium"
                      style={{ color: getLabelColor() }}
                    >
                      Admission Year
                    </span>
                    <p style={{ color: getTextColor() }}>
                      {user.admissionYear}
                    </p>
                  </div>
                )}
              </div>

              {user.address && (
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-6">
                  <span
                    className="text-sm font-medium"
                    style={{ color: getLabelColor() }}
                  >
                    Address
                  </span>
                  <p style={{ color: getTextColor() }}>{user.address}</p>
                </div>
              )}

              {/* Edit Profile Button */}
              <Link
                to="/student-profile-edit"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition duration-300"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32 mx-auto"></div>
          </div>
        </div>
      )}

      <h3
        className="text-xl font-semibold mb-4"
        style={{ color: getTextColor() }}
      >
        Uploaded Files
      </h3>
      <div className="space-y-4">
        {files.length > 0 ? (
          files.map((file) => (
            <div
              key={file.id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 w-full   flex justify-between items-center border border-gray-200 dark:border-gray-700"
            >
              <div className="h-20 w-[80%] ">
                <h4 className="font-bold" style={{ color: getTextColor() }}>
                  {file.title}
                </h4>
                <p className="text-blue-600 dark:text-blue-400 text-nowrap truncate  w-full   mt-3">
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
          <p style={{ color: getLabelColor() }}>No files found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
