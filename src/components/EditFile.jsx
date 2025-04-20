import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import JoditEditor from "jodit-react";
import Cookies from "js-cookie";

const EditFile = () => {
  const { fileId } = useParams(); // Get fileId from URL
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editorValue, setEditorValue] = useState(""); // Local state for editor value
  const editor = useRef(null);

  // Retrieve userId from cookies
  const userId = Cookies.get("userId");

  useEffect(() => {
    if (!userId) {
      setError("User not authenticated.");
      return;
    }

    axios
      .get(`http://localhost:8080/files/${fileId}`)
      .then((response) => {
        setValue("title", response.data.title); // Set form title
        setEditorValue(response.data.description || ""); // Set editor value
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load file details.");
        setLoading(false);
      });
  }, [fileId, setValue, userId]);

  // JoditEditor configuration to match UploadFile
  const editorConfig = useMemo(
    () => ({
      readonly: false,
      toolbar: true,
      uploader: {
        insertImageAsBase64URI: true,
        url: (file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imgDataUrl = e.target.result;
            editor.current.selection.insertImage(imgDataUrl);
          };
          reader.readAsDataURL(file);
        },
      },
    }),
    []
  );

  const handleEditorChange = (newContent) => {
    setEditorValue(newContent);
  };

  const onSubmit = async (data) => {
    try {
      data.description = editorValue; // Set the editor's content to the form data
      await axios.put(
        `http://localhost:8080/files/update/${fileId}/${userId}`,
        data
      );
      alert("File updated successfully!");
      navigate("/");
    } catch (err) {
      setError("Failed to update file.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit File</h2>

      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Update File
          </button>
          <div>
            <label className="block font-medium">Title</label>
            <input
              {...register("title")}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <JoditEditor
              ref={editor}
              value={editorValue}
              onChange={handleEditorChange}
              config={editorConfig}
              className="w-full mb-6 border-2 border-gray-300 rounded-lg"
              style={{ height: "600px", overflowY: "auto" }}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default EditFile;
