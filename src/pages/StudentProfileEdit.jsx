import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ProfileImageCropper from "../components/ProfileImageCropper";
import {
  validateImageFile,
  createImagePreview,
  cleanupImagePreview,
} from "../utils/imageUtils";

const getCookie = (name) => {
  const cookieString = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookieString ? decodeURIComponent(cookieString.split("=")[1]) : null;
};

const StudentProfileEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Image cropper states
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    course: "",
    batch: "",
    rollNumber: "",
    department: "",
    semester: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    admissionYear: "",
  });

  useEffect(() => {
    const userId = getCookie("userId");

    if (!userId) {
      console.error("User ID not found in cookies");
      navigate("/login");
      return;
    }
    fetchUserProfile(userId);
  }, [navigate]);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(
        `https://file-uploading-web.onrender.com/users/${userId}`
      );
      if (response.ok) {
        const userData = await response.json();
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          gender: userData.gender || "",
          course: userData.course || "",
          batch: userData.batch || "",
          rollNumber: userData.rollNumber || "",
          department: userData.department || "",
          semester: userData.semester || "",
          phoneNumber: userData.phoneNumber || "",
          address: userData.address || "",
          dateOfBirth: userData.dateOfBirth || "",
          admissionYear: userData.admissionYear || "",
        });

        // Try to load profile image
        try {
          const imageResponse = await fetch(
            `https://file-uploading-web.onrender.com/users/${userId}/profile-image`
          );
          if (imageResponse.ok) {
            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setImagePreview(imageUrl);
          }
        } catch (error) {
          console.log("No profile image found");
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image file selection - show cropper
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Validate image file
        validateImageFile(file);

        // Store selected file
        setSelectedFile(file);

        // Create preview for cropper
        const imageUrl = createImagePreview(file);
        setOriginalImage(imageUrl);

        // Show cropper modal
        setShowCropper(true);

        console.log("📁 Image selected for cropping:", {
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + " MB",
          type: file.type,
        });
      } catch (error) {
        alert(error.message);
        console.error("❌ Image validation failed:", error);
      }
    }
  };

  // Handle cropped image from cropper component
  const handleCropComplete = (croppedFile) => {
    console.log("✅ Image cropped and compressed:", {
      name: croppedFile.name,
      size: (croppedFile.size / 1024 / 1024).toFixed(2) + " MB",
      type: croppedFile.type,
    });

    // Set the cropped and compressed image
    setProfileImage(croppedFile);

    // Create preview for display
    const previewUrl = createImagePreview(croppedFile);
    setImagePreview(previewUrl);

    // Close cropper
    setShowCropper(false);

    // Cleanup original image URL
    if (originalImage) {
      cleanupImagePreview(originalImage);
      setOriginalImage(null);
    }
  };

  // Handle cropper close
  const handleCropperClose = () => {
    setShowCropper(false);

    // Cleanup image URLs
    if (originalImage) {
      cleanupImagePreview(originalImage);
      setOriginalImage(null);
    }

    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userId = getCookie("userId");
    if (!userId) {
      alert("User not logged in");
      navigate("/login");
      return;
    }

    try {
      // Upload profile image if selected
      if (profileImage) {
        const imageFormData = new FormData();
        imageFormData.append("image", profileImage);

        const imageResponse = await fetch(
          `https://file-uploading-web.onrender.com/users/${userId}/profile-image`,
          {
            method: "POST",
            body: imageFormData,
          }
        );

        if (!imageResponse.ok) {
          throw new Error("Failed to upload profile image");
        }
      }

      // Update profile data
      const response = await fetch(
        `https://file-uploading-web.onrender.com/users/${userId}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Profile updated successfully!");
        navigate("/profile");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const courses = [
    "Computer Science Engineering",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Chemical Engineering",
    "Biotechnology",
    "MBA",
    "MCA",
    "BCA",
    "B.Tech",
    "M.Tech",
  ];

  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const genders = ["Male", "Female", "Other"];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <Helmet>
        <title>Edit Student Profile - FileHub</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Edit Student Profile
            </h1>
            <button
              onClick={() => navigate("/profile")}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              ← Back to Profile
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Section */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mx-auto mb-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        className="w-16 h-16"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition-colors">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  {genders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Academic Information */}
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Academic Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course/Program
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Science"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 21CS001"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch/Year
                  </label>
                  <input
                    type="text"
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    placeholder="e.g., 2021-2025"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Semester
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Semester</option>
                    {semesters.map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admission Year
                  </label>
                  <input
                    type="text"
                    name="admissionYear"
                    value={formData.admissionYear}
                    onChange={handleInputChange}
                    placeholder="e.g., 2021"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Contact Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., +91 9876543210"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter your full address"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Profile Image Cropper Modal */}
      <ProfileImageCropper
        isOpen={showCropper}
        onClose={handleCropperClose}
        onCropComplete={handleCropComplete}
        initialImage={originalImage}
      />
    </div>
  );
};

export default StudentProfileEdit;
