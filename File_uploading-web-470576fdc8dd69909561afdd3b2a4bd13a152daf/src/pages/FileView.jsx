import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import ImagePopup from "../components/ImagePopup";

const FileView = () => {
  const { fileId } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const descriptionRef = useRef(null);
  const navigate = useNavigate();

  // This is a public page - no authentication required
  console.log("📁 FileView: Public access enabled for file:", fileId);

  useEffect(() => {
    axios
      .get(`https://file-uploading-web.onrender.com/files/${fileId}`)
      .then((response) => {
        setFile(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching file:", error);
        setError("Error fetching file details. Please try again.");
        setLoading(false);
      });
  }, [fileId]);

  useEffect(() => {
    if (descriptionRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setTimeout(() => setShowFullDescription(true), 500);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(descriptionRef.current);
    }
  }, [file]);

  const handleDownload = () => {
    if (!file) return;

    // Check if file is an image
    const originalFilePath = file.filePath || "";
    const originalExtension = originalFilePath.includes(".")
      ? originalFilePath.split(".").pop().toLowerCase()
      : "";

    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    const isImageFile = imageExtensions.includes(originalExtension);

    // For now, use the same endpoint for all files until backend is updated
    const downloadUrl = `https://file-uploading-web.onrender.com/files/download/${fileId}`;

    axios({
      url: downloadUrl,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        let fileName = file.title?.replace(/\s+/g, "_") || `file_${fileId}`;

        // Use original extension for all files
        if (originalExtension) {
          fileName =
            fileName.replace(/\.[^/.]+$/, "") + "." + originalExtension;
        } else {
          // Fallback: determine extension from content-type
          const contentType = response.headers["content-type"];
          if (contentType) {
            if (
              contentType.includes("image/jpeg") ||
              contentType.includes("image/jpg")
            )
              fileName += ".jpg";
            else if (contentType.includes("image/png")) fileName += ".png";
            else if (contentType.includes("image/gif")) fileName += ".gif";
            else if (contentType.includes("image/webp")) fileName += ".webp";
            else if (contentType.includes("image/bmp")) fileName += ".bmp";
            else if (contentType.includes("image/svg")) fileName += ".svg";
            else if (contentType.includes("application/pdf"))
              fileName += ".pdf";
            else if (contentType.includes("text/plain")) fileName += ".txt";
            else if (contentType.includes("application/zip"))
              fileName += ".zip";
            else if (contentType.includes("application/msword"))
              fileName += ".doc";
            else if (
              contentType.includes(
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              )
            )
              fileName += ".docx";
            else if (contentType.includes("application/vnd.ms-excel"))
              fileName += ".xls";
            else if (
              contentType.includes(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              )
            )
              fileName += ".xlsx";
          }
        }

        // Create blob with correct MIME type
        const blob = new Blob([response.data], {
          type: response.headers["content-type"] || "application/octet-stream",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log(
          `Downloaded file: ${fileName} with type: ${response.headers["content-type"]}`
        );
      })
      .catch((error) => {
        console.error("Download error:", error);
        setError("Error downloading file. Please try again.");
      });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const isImage = (fileName) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const fileExtension = fileName?.split(".").pop().toLowerCase();
    return imageExtensions.includes(fileExtension);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    console.error(
      "Failed to load image:",
      `https://file-uploading-web.onrender.com/files/download/${fileId}`
    );
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowImagePopup(true);
  };

  const handleClosePopup = () => {
    setShowImagePopup(false);
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: file.title,
        text: `Check out this file: ${file.title}`,
        url: shareUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Link copied to clipboard!");
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-6 bg-gray-300 rounded w-40 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-60 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!file) {
    return (
      <div className="text-center mt-10 text-red-500">File not found.</div>
    );
  }

  const { filePath, title, user, createdDate, description } = file;
  const fileName = filePath?.split("/").pop() || "N/A";
  const fileType = fileName.includes(".")
    ? fileName.split(".").pop().toLowerCase()
    : "folder";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* GitHub-style Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          {/* Mobile-first responsive layout */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <button
                onClick={handleBackClick}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium mb-3 sm:mb-0 sm:mr-4 flex items-center self-start"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Files
              </button>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 break-words leading-tight">
                  {title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  File details and preview
                </p>
              </div>
            </div>

            {/* Mobile-responsive action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={handleDownload}
                className="bg-green-600 text-white px-4 py-3 sm:py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center sm:justify-start"
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
                    d="M12 10v6m0 0l-4-4m4 4l4-4m-6 8h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="hidden sm:inline">Download File</span>
                <span className="sm:hidden">Download</span>
              </button>

              <button
                onClick={handleShare}
                className="bg-blue-600 text-white px-4 py-3 sm:py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center sm:justify-start"
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
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span className="hidden sm:inline">Share</span>
                <span className="sm:hidden">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - File Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  File Preview
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                {isImage(fileName) ? (
                  <div className="text-center">
                    <div className="relative inline-block">
                      {imageLoading && (
                        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg h-64 sm:h-80 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                      {imageError ? (
                        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg h-64 sm:h-80 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 mx-auto">
                          <div className="text-center text-gray-500">
                            <svg
                              className="w-16 h-16 mx-auto mb-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p className="text-lg font-medium">
                              Image unavailable
                            </p>
                            <p className="text-sm text-gray-400">
                              File may be missing or corrupted
                            </p>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={`https://file-uploading-web.onrender.com/files/download/${fileId}`}
                          alt={fileName}
                          className={`max-w-full h-auto rounded-lg shadow-lg cursor-pointer transition-transform duration-200 hover:scale-105 ${
                            imageLoading ? "hidden" : "block"
                          }`}
                          onClick={handleImageClick}
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                          style={{ maxHeight: "400px" }}
                        />
                      )}
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                      Click image to view full size
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-gray-400"
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
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 break-words word-wrap max-w-full">
                      {fileName}
                    </h3>
                    <p className="text-gray-500">
                      File type: {fileType.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Preview not available for this file type
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - File Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  File Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {/* File Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-4 rounded-md break-words word-wrap">
                    {fileName}
                  </p>
                </div>

                {/* File Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Type
                  </label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {fileType.toUpperCase()}
                  </span>
                </div>

                {/* Owner */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Owner
                  </label>
                  <Link
                    to={`/users/${user?.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {user?.firstName} {user?.lastName}
                  </Link>
                </div>

                {/* Created Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {createdDate
                      ? new Date(createdDate).toLocaleDateString("en-GB")
                      : "N/A"}
                  </p>
                </div>

                {/* File ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File ID
                  </label>
                  <p className="text-sm text-gray-500 font-mono">#{fileId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Description
            </h2>
          </div>

          <div className="p-6">
            <div ref={descriptionRef}>
              {description ? (
                showFullDescription ? (
                  <motion.div
                    className="prose prose-sm max-w-none text-gray-900 dark:text-gray-100 description-content overflow-x-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                ) : (
                  <div className="text-gray-900 dark:text-gray-100">
                    <div
                      className="description-content overflow-x-hidden"
                      dangerouslySetInnerHTML={{
                        __html:
                          description.length > 200
                            ? description.slice(0, 200) + "..."
                            : description,
                      }}
                    />
                    {description.length > 200 && (
                      <button
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium mt-2"
                        onClick={() => setShowFullDescription(true)}
                      >
                        Show more
                      </button>
                    )}
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-gray-400"
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
                  <p className="text-gray-500">No description available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Popup */}
      {isImage(fileName) && (
        <ImagePopup
          isOpen={showImagePopup}
          onClose={handleClosePopup}
          imageUrl={`https://file-uploading-web.onrender.com/files/download/${fileId}`}
          fileName={fileName}
        />
      )}
    </div>
  );
};

export default FileView;
