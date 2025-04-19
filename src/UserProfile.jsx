import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser();
    fetchUserFiles();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/${id}`);
      if (!response.ok) throw new Error("Failed to fetch user details");
      const data = await response.json();
      setUser(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFiles = async () => {
    try {
      const response = await fetch(`http://localhost:8080/files/user/${id}`);
      if (!response.ok) throw new Error("Failed to fetch user's files");
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDownload = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:8080/files/download/${fileId}`);
      if (!response.ok) throw new Error("Failed to download file");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "downloaded-file.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      {loading ? (
        <p className="text-gray-500">Loading user details...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6 mb-8 text-center">
          <div className="w-24 h-24 bg-blue-100 text-blue-500 flex items-center justify-center rounded-full text-3xl font-bold mx-auto mb-4">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">{user.firstName} {user.lastName}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      )}

      <h3 className="text-xl font-semibold mb-4">Uploaded Files</h3>
      <div className="w-full max-w-2xl">
        {files.length > 0 ? (
          files.map((file) => (
            <div key={file.id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center">
              <div>
                <h4 className="font-medium">{file.title}</h4>
                <p className="text-gray-500 text-sm">{user.firstName} {user.lastName}</p>
              </div>
              <Link
                      to={`/file/${file.id}/${file.title}`}
                      className="font-medium text-blue-600 "
                    >
                      View
                    </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No files uploaded.</p>
        )}
      </div>
    </div>
  );
}