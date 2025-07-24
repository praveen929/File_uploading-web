import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import JoditEditor from "jodit-react";
import Cookies from "js-cookie";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export default function UploadFile() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const editor = useRef(null);

  // Retrieve userId from cookies
  const userId = Cookies.get("userId");
  const navigate = useNavigate(); // Used for navigation

  useEffect(() => {
    if (!userId) {
      alert("User is not logged in. Please login first.");
      window.location.href = "/login";
    }
  }, [userId]);

  // Handle file selection via drag and drop
  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);

    // Create preview for images
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/*": [".txt"],
      "application/zip": [".zip"],
      "application/x-rar-compressed": [".rar"],
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024, // 50MB limit
  });

  const handleUpload = async (e) => {
    e.preventDefault();

    // Validate if file, title, and description are filled
    if (!file || !title || !description) {
      alert("Please fill in all fields.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);

      const response = await axios.post(
        `https://file-uploading-web.onrender.com/files/upload/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      setShowModal(true);
      console.log(response.data);

      // Reset form
      setTimeout(() => {
        setFile(null);
        setImagePreview(null);
        setTitle("");
        setDescription("");
        setIsUploading(false);
        setUploadProgress(0);
        navigate("/all-files");
      }, 2000);
    } catch (error) {
      console.error("Upload error:", error);
      alert("File upload failed!");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Optimized onChange handler to prevent reload
  const handleDescriptionChange = useCallback((newContent) => {
    setDescription(newContent);
  }, []);

  // JoditEditor configuration to add images from local storage
  const editorConfig = useMemo(
    () => ({
      readonly: false,
      toolbar: true,
      height: 400,
      theme: "default",
      style: {
        color: "#000000",
        backgroundColor: "#ffffff",
      },
      iframe: true,
      iframeStyle: `
        .jodit-wysiwyg iframe {
          max-width: 100% !important;
          width: 100% !important;
          height: auto !important;
          aspect-ratio: 16/9 !important;
        }
      `,
      events: {
        beforeSetMode: () => false, // Prevent mode changes that cause reload
        afterInit: (editor) => {
          // Prevent unnecessary re-renders
          editor.events.off("change.editor");

          // Add event listener for paste to handle YouTube embeds
          editor.events.on("paste", (event) => {
            const text = event?.clipboardData?.getData("text");
            if (
              text &&
              (text.includes("youtube.com/embed") ||
                text.includes("youtube.com/watch"))
            ) {
              event.preventDefault();

              // Extract video ID from YouTube URL
              let videoId = "";
              if (text.includes("youtube.com/embed/")) {
                videoId = text.split("youtube.com/embed/")[1].split("?")[0];
              } else if (text.includes("youtube.com/watch?v=")) {
                videoId = text.split("youtube.com/watch?v=")[1].split("&")[0];
              }

              if (videoId) {
                // Insert responsive YouTube embed
                const embedHtml = `<div class="youtube-embed-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
                editor.selection.insertHTML(embedHtml);
                return false;
              }
            }
          });
        },
      },
      uploader: {
        insertImageAsBase64URI: true,
        url: (file) => {
          // Logic for uploading image locally to Jodit
          const reader = new FileReader();
          reader.onload = (e) => {
            const imgDataUrl = e.target.result;
            if (editor.current && editor.current.selection) {
              editor.current.selection.insertImage(imgDataUrl); // Insert image into the editor
            }
          };
          reader.readAsDataURL(file);
        },
      },
    }),
    []
  ); // Memoize the configuration to avoid unnecessary updates

  // Handle closing the modal
  const closeModal = () => {
    setShowModal(false); // Close the modal
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Upload File
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Share your files with the community
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/all-files")}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                View All Files
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - File Upload */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              {/* File Upload Area */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select File
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : file
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-3">
                    {file ? (
                      <>
                        <svg
                          className="w-12 h-12 mx-auto text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-green-600 dark:text-green-400 font-medium">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </>
                    ) : isDragActive ? (
                      <>
                        <svg
                          className="w-12 h-12 mx-auto text-blue-500 dark:text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-blue-500 dark:text-blue-400 font-medium">
                          Drop the file here
                        </p>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <div>
                          <p className="text-gray-600 dark:text-gray-300 font-medium">
                            Drag & drop a file here, or click to browse
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Supports images, PDFs, documents up to 50MB
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Title Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter a descriptive title for your file"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description Editor */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                  <JoditEditor
                    ref={editor}
                    value={description}
                    onChange={handleDescriptionChange}
                    config={editorConfig}
                    className="w-full text-black"
                  />
                </div>
              </div>

              {/* Upload Button */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">* Required fields</div>
                <button
                  onClick={handleUpload}
                  disabled={!file || !title || !description || isUploading}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    !file || !title || !description || isUploading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isUploading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading... {uploadProgress}%
                    </div>
                  ) : (
                    "Upload File"
                  )}
                </button>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Preview
              </h3>

              {imagePreview ? (
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Image Preview</p>
                    <p>File: {file?.name}</p>
                    <p>
                      Size: {file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB
                    </p>
                  </div>
                </div>
              ) : file ? (
                <div className="text-center py-8">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
                  <p className="text-gray-600 font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Preview not available for this file type
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-500">No file selected</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Select a file to see preview
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Upload Successful!
                  </h3>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-gray-600">
                  Your file has been uploaded successfully. You can now view it
                  in your files or continue uploading more files.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
                >
                  Continue Uploading
                </button>
                <button
                  onClick={() => navigate("/all-files")}
                  className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md text-sm font-medium transition-colors"
                >
                  View Files
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
