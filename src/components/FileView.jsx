import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const FileView = () => {
  const { fileId } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const descriptionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/files/${fileId}`)
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

    axios({
      url: `http://localhost:8080/files/download/${fileId}`,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        const fileName = file.title?.replace(/\s+/g, "_") || `file_${fileId}`;
        link.href = url;
        link.setAttribute("download", `${fileName}.zip`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Download error:", error);
        setError("Error downloading file.");
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
    <div className="flex justify-center min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          File Details
        </h2>

        <div className="bg-gray-50 p-5 rounded-lg shadow-md">
          <div className="mt-5 flex gap-6 justify-center">
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Download ZIP
            </button>

            <button
              onClick={handleBackClick}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-300"
            >
              Back
            </button>
          </div>

          {/* Display Image and File Name on the Same Line */}
          <div className="flex flex-col lg:flex-row items-center mt-6 gap-5">
            {isImage(fileName) ? (
              <>
                <img
                  src={`http://localhost:8080/files/view/${fileName}`}
                  alt={fileName}
                  className="max-w-[120px] h-auto rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.onerror = null; // prevent infinite loop
                    e.target.src = "/path/to/fallback-image.png"; // fallback image URL
                  }}
                />
                {/* Remove extension from file name before displaying */}
                <strong className="text-base text-gray-700">
                  {fileName.split('.').slice(0, -1).join('.')}
                </strong>
              </>
            ) : (
              <strong className="text-base text-gray-700">
                {/* Remove extension from file name for non-image files */}
                {fileName.split('.').slice(0, -1).join('.')}
              </strong>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 mt-6">
            <span className="text-sm text-gray-500">
              Type: {fileType.toUpperCase()}
            </span>
          </div>
          <p className="mt-3 text-lg text-gray-700">
            <strong>Title:</strong> {title}
          </p>
          <p className="mt-2 text-lg text-blue-700 ">
           <strong className="text-gray-700 ">Owner:  </strong><Link className="hover:underline" to={`/users/${user?.id}`}>  {user?.firstName} {user?.lastName}</Link>
          </p>
          <p className="mt-2 text-lg text-gray-700">
            <strong>Created Date:</strong>{" "}
            {createdDate
              ? new Date(createdDate).toLocaleDateString("en-GB")
              : "N/A"}
          </p>
          <br />
          <hr className="mt-5" />

          {/* Lazy Load Description with Smooth Animation */}
          <div
            ref={descriptionRef}
            className="file-content mt-4 text-gray-700 leading-7"
          >
            {description ? (
              showFullDescription ? (
                <motion.div
                  className="prose max-w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : (
                <p>
                  {description.slice(0, 200)}...{" "}
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setShowFullDescription(true)}
                  >
                    Load more
                  </span>
                </p>
              )
            ) : (
              "No description available."
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileView;
