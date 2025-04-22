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
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
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
    setFile(acceptedFiles[0]); // Set the first file from dropzone
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "*",
    multiple: false,
  });

  const handleUpload = async (e) => {
    e.preventDefault(); // Prevent page reload on button click

    // Validate if file, title, and description are filled
    if (!file || !title || !description) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);

      const response = await axios.post(
        `http://localhost:8080/files/upload/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setShowModal(true); // Show the success modal when upload is successful
      console.log(response.data);

      // Navigate to the 'all-files' page after upload is successful
      navigate("/all-files"); // Redirect to the all-files page
    } catch (error) {
      console.error("Upload error:", error);
      alert("File upload failed!");
    }
  };

  // JoditEditor configuration to add images from local storage
  const editorConfig = useMemo(
    () => ({
      readonly: false,
      toolbar: true,
      uploader: {
        insertImageAsBase64URI: true,
        url: (file) => {
          // Logic for uploading image locally to Jodit
          const reader = new FileReader();
          reader.onload = (e) => {
            const imgDataUrl = e.target.result;
            editor.current.selection.insertImage(imgDataUrl); // Insert image into the editor
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Upload File
        </h2>

        {/* Drag and Drop File Upload */}
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 p-8 mb-6 text-center cursor-pointer rounded-lg hover:border-blue-500 transition-all duration-300"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500 font-medium">Drop the file here...</p>
          ) : (
            <p className="text-gray-600 font-medium">
              Drag & drop a file here, or click to select one
            </p>
          )}
        </div>


        {file && (
          <p className="text-green-600 text-center mb-4 font-medium">
            Selected file: {file.name}
          </p>
        )}

<button
          className="w-full mb-5 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
          onClick={handleUpload} // Prevent form submission
        >
          Upload File
        </button>

        <label className="block text-gray-800 font-medium mb-2">Title</label>
        <input
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Enter file title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="block text-gray-800 font-medium mb-2">
          Description
        </label>
        <JoditEditor
          ref={editor}
          value={description}
          onChange={(newContent) => setDescription(newContent)}
          config={editorConfig} // Apply configuration for image upload
          className="w-full mb-6 border-2 border-gray-300 rounded-lg"
          style={{ height: "600px", overflowY: "auto" }} // Fixed height and scroll
        />

        

        {/* Dialog Box for Success */}
        {showModal && (
          <div
            data-dialog-backdrop="dialog"
            data-dialog-backdrop-close="true"
            className="pointer-events-none fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-100 backdrop-blur-sm transition-opacity duration-300"
          >
            <div
              data-dialog="dialog"
              className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm"
            >
              <div className="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
                File uploaded successfully!
              </div>
              <div className="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
                You can now view or manage your uploaded file.
              </div>
              <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
                <button
                  data-dialog-close="true"
                  className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  onClick={closeModal} // Close the modal
                >
                  Done
                </button>
                <button
                  data-dialog-close="true"
                  className="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                  type="button"
                  onClick={() => navigate("/all-files")} // Redirect after upload
                >
                  View File
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
