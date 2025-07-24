import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const getCookie = (name) => {
  const cookieString = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookieString ? decodeURIComponent(cookieString.split("=")[1]) : null;
};

const ProfileEditPage = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "", // Added password field
  });

  const [showPassword, setShowPassword] = useState(false); // Moved here
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getCookie("userId");

    if (!userId) {
      console.error("User ID not found in cookies");
      setLoading(false);
      return;
    }

    fetch(`https://file-uploading-web.onrender.com/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data); // Populate user data with response
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    // Ensure the password field updates correctly
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = getCookie("userId");

    try {
      const response = await fetch(
        `https://file-uploading-web.onrender.com/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }
      );

      if (response.ok) {
        alert("Profile updated successfully!");
        navigate("/profile");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Account Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Update your email and password
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                required
              />
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-gray-500 text-sm">
                Leave blank to keep the current password.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileEditPage;
