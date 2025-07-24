import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Login() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Test function for debugging
  const testBackendConnection = async () => {
    try {
      console.log("🔍 Testing backend connection...");
      const response = await fetch(
        "https://file-uploading-web.onrender.com/users/login",
        {
          method: "OPTIONS",
        }
      );
      console.log("✅ Backend connection test:", response.status);
    } catch (error) {
      console.error("❌ Backend connection failed:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submit default behavior

    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    console.log("🔐 Login attempt:", { email, password: "***" });

    try {
      const loginData = { email: email.trim(), password: password.trim() };
      console.log("📤 Sending login data:", {
        email: loginData.email,
        password: "***",
      });

      const response = await fetch(
        "https://file-uploading-web.onrender.com/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      console.log("📡 Response status:", response.status);
      console.log("📡 Response headers:", response.headers);

      if (response.status === 401) {
        const errorData = await response.text();
        console.error("❌ 401 Unauthorized:", errorData);
        throw new Error(
          "Invalid email or password. Please check your credentials."
        );
      }

      if (response.status === 404) {
        console.error("❌ 404 User not found");
        throw new Error("User not found. Please check your email address.");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response error:", errorText);
        throw new Error(
          `Login failed: ${response.status} - ${errorText || "Unknown error"}`
        );
      }

      const data = await response.json();
      console.log("✅ Login response data:", data);

      if (!data.userId) {
        console.error("❌ Missing userId in response:", data);
        throw new Error("User ID is missing in response.");
      }

      // Save userId in cookies
      Cookies.set("userId", data.userId, { expires: 1 });

      alert("Login Successful");
      navigate("/dashboard"); // Navigate to dashboard after login
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Sign in
        </h2>

        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <form id="loginForm" onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          >
            Sign In
          </button>
        </form>

       

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
