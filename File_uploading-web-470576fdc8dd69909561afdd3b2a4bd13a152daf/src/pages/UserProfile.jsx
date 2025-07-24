import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const UserProfile = () => {
  const { id } = useParams(); // Get user ID from URL
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [profileImages, setProfileImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!id) {
      setError("User ID not found");
      setLoading(false);
      return;
    }

    // Fetch user data from API
    fetch(`https://file-uploading-web.onrender.com/users/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("User not found");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);

        // Fetch profile image for this user
        fetchProfileImage(data.id);

        // Fetch user's files
        return fetch(
          `https://file-uploading-web.onrender.com/files/user/${id}`
        );
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to fetch files");
      })
      .then((filesData) => {
        setFiles(filesData || []);
        setFilesLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        if (error.message.includes("User not found")) {
          setError("User not found");
        } else {
          setError("Failed to load user profile");
        }
        setLoading(false);
        setFilesLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-40 mx-auto"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-60 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            {error}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            User not found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>
          {user.firstName} {user.lastName} - FileHub
        </title>
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            ← Back to Users
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* GitHub-style Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - User Profile (GitHub style) */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Profile Header */}
              <div className="p-6 text-center">
                {/* Large Profile Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-600">
                    {profileImages[user.id] ? (
                      <img
                        src={profileImages[user.id]}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center text-4xl font-bold">
                        {user.firstName?.charAt(0)}
                        {user.lastName?.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* User Name */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {user.firstName} {user.lastName}
                </h1>

                {/* User Email */}
                <p className="text-gray-600 dark:text-white mb-4">
                  {user.email}
                </p>
              </div>

              {/* Stats */}
              <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {files.length}
                  </span>
                  <span className="ml-1">files uploaded</span>
                </div>
              </div>

              {/* User Details - GitHub Style */}
              <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="space-y-3">
                  {/* Personal Info */}
                  {user.gender && (
                    <div className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-gray-600 dark:text-white">
                        {user.gender}
                      </span>
                    </div>
                  )}

                  {user.phoneNumber && (
                    <div className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-gray-600 dark:text-white">
                        {user.phoneNumber}
                      </span>
                    </div>
                  )}

                  {user.dateOfBirth && (
                    <div className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-600 dark:text-white">
                        {new Date(user.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {/* Academic Info */}
                  {user.course && (
                    <div className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <span className="text-gray-600 dark:text-white font-medium">
                        {user.course}
                      </span>
                    </div>
                  )}

                  {user.rollNumber && (
                    <div className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      <span className="text-gray-600 dark:text-white font-mono">
                        {user.rollNumber}
                      </span>
                    </div>
                  )}

                  {user.semester && (
                    <div className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      <span className="text-gray-600 dark:text-white">
                        Semester {user.semester}
                      </span>
                    </div>
                  )}

                  {user.batch && (
                    <div className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="text-gray-600">Batch {user.batch}</span>
                    </div>
                  )}

                  {user.department && (
                    <div className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span className="text-gray-600">{user.department}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* User ID */}
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex items-center text-xs text-gray-500">
                  <svg
                    className="w-3 h-3 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span className="font-mono">ID: {user.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Files (GitHub style) */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Files Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-600"
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
                    Files
                  </h2>
                  <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {files.length}
                  </span>
                </div>
              </div>

              {/* Files Content */}
              <div className="p-6">
                {filesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                    </div>
                  </div>
                ) : files.length > 0 ? (
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="group flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          {/* File Icon */}
                          <svg
                            className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0"
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
                            <div className="flex items-center">
                              <Link
                                to={`/file/${file.id}/${encodeURIComponent(
                                  file.title || "file"
                                )}`}
                                className="text-blue-600 hover:text-blue-800 font-medium truncate"
                              >
                                {file.title}
                              </Link>
                            </div>

                            {file.description && (
                              <p className="text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-black text-sm mt-1 line-clamp-1">
                                {file.description
                                  .replace(/<[^>]*>/g, "")
                                  .substring(0, 100)}
                                {file.description.length > 100 ? "..." : ""}
                              </p>
                            )}

                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <span>ID: {file.id}</span>
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
                          to={`/file/${file.id}/${encodeURIComponent(
                            file.title || "file"
                          )}`}
                          className="ml-4 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors flex-shrink-0"
                        >
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <svg
                      className="w-12 h-12 mx-auto mb-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No files uploaded
                    </h3>
                    <p className="text-gray-500">
                      This user hasn't uploaded any files yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
