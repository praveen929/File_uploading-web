import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

// Function to highlight the matched text
const highlightText = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="bg-yellow-200">{part}</span>
    ) : part
  );
};

// Function to generate the start and end dates for the selected filter
const getDateRange = (filter) => {
  const now = new Date();
  let startDate, endDate;

  switch (filter) {
    case "Today":
      startDate = endDate = now.toISOString().split("T")[0];
      break;
    case "Yesterday":
      now.setDate(now.getDate() - 1);
      startDate = endDate = now.toISOString().split("T")[0];
      break;
    case "This Week":
      const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      startDate = firstDayOfWeek.toISOString().split("T")[0];
      endDate = new Date(firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 6)).toISOString().split("T")[0];
      break;
    case "Last Week":
      const lastWeekStart = new Date(now.setDate(now.getDate() - now.getDay() - 7));
      startDate = lastWeekStart.toISOString().split("T")[0];
      endDate = new Date(lastWeekStart.setDate(lastWeekStart.getDate() + 6)).toISOString().split("T")[0];
      break;
    case "This Month":
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate = startOfMonth.toISOString().split("T")[0];
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
      break;
    case "Last Month":
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      startDate = lastMonthStart.toISOString().split("T")[0];
      endDate = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split("T")[0];
      break;
    case "This Year":
      startDate = new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0];
      endDate = new Date(now.getFullYear(), 11, 31).toISOString().split("T")[0];
      break;
    case "Last Year":
      startDate = new Date(now.getFullYear() - 1, 0, 1).toISOString().split("T")[0];
      endDate = new Date(now.getFullYear() - 1, 11, 31).toISOString().split("T")[0];
      break;
    case "All":
    default:
      startDate = endDate = "";
      break;
  }

  return { startDate, endDate };
};

const FileList = () => {
  const navigate = useNavigate(); // Ensure useNavigate is called at the top
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [animationText, setAnimationText] = useState("");
  const [animationIndex, setAnimationIndex] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:8080/files/all")
      .then((response) => {
        setFiles(response.data);
        setFilteredFiles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const textArray = ["File Title", "First Name", "Last Name"];
    let charIndex = 0;
    let wordIndex = animationIndex;
    let isErasing = false;
  
    const type = () => {
      const currentWord = textArray[wordIndex];
      if (!isErasing) {
        // Typing logic
        const nextText = currentWord.slice(0, charIndex + 1);
        setAnimationText(nextText);
        charIndex++;
  
        if (nextText === currentWord) {
          isErasing = true;
          setTimeout(type, 1000); // pause before erasing
          return;
        }
      } else {
        // Erasing logic
        const nextText = currentWord.slice(0, charIndex - 1);
        setAnimationText(nextText);
        charIndex--;
  
        if (charIndex === 0) {
          isErasing = false;
          wordIndex = (wordIndex + 1) % textArray.length;
          setAnimationIndex(wordIndex);
        }
      }
  
      setTimeout(type, 150); // typing speed
    };
  
    const typingTimeout = setTimeout(type, 150);
  
    return () => clearTimeout(typingTimeout);
  }, [animationIndex]);
  
  const filterFilesByDate = (startDate, endDate) => {
    if (filter === "All") {
      setFilteredFiles(files);
    } else {
      const { startDate: rangeStart, endDate: rangeEnd } = getDateRange(filter);
      const filtered = files.filter((file) => {
        const fileDate = new Date(file.createdDate).toISOString().split("T")[0];
        return (
          (rangeStart ? fileDate >= rangeStart : true) &&
          (rangeEnd ? fileDate <= rangeEnd : true)
        );
      });
      setFilteredFiles(filtered);
    }
  };

  useEffect(() => {
    filterFilesByDate(startDate, endDate);
  }, [filter, startDate, endDate, files]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value) {
      const filtered = filteredFiles.filter((file) =>
        file.title.toLowerCase().includes(event.target.value.toLowerCase()) ||
        (file.user.firstName + " " + file.user.lastName)
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      );
      setFilteredFiles(filtered);
    } else {
      setFilteredFiles(files);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;  // Prevent going out of bounds
    setCurrentPage(page);
  };
  
  // Calculate the index for the first and last file on the current page
  const indexOfLastFile = currentPage * pageSize;
  const indexOfFirstFile = indexOfLastFile - pageSize;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);
  
  // Calculate total pages based on filtered files length
  const totalPages = Math.ceil(filteredFiles.length / pageSize);
  
  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center p-6">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full bg-white p-4">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
          Uploaded Files
        </h2>
  
        {/* Search Input Field */}
        <div className="mb-4">
          <input
            type="text"
            placeholder={`Search by "${animationText}"`}
            value={searchQuery}
            onChange={handleSearch}
            className="p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
  
        {/* Filter Dropdown */}
        <div className="mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 w-full border border-gray-300 rounded-md"
          >
            <option value="All">All</option>
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="This Week">This Week</option>
            <option value="Last Week">Last Week</option>
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="This Year">This Year</option>
            <option value="Last Year">Last Year</option>
          </select>
        </div>
  
        {loading ? (
          <p className="text-center text-gray-500">Loading files...</p>
        ) : currentFiles.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">S. No.</th>
                <th className="px-6 py-3">File Title</th>
                <th className="px-6 py-3 whitespace-nowrap">File Owner</th>
                <th className="px-6 py-3 whitespace-nowrap">Created Date</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {currentFiles.map((file, index) => (
                <tr
                  key={file.id}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50"
                  onClick={() => navigate(`/file/${file.id}/${file.title}`)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {index + 1 + indexOfFirstFile}
                  </td>
                  <td className="px-6 py-4 text-nowrap truncate w-1/3 max-w-xs">
                    {highlightText(file.title, searchQuery)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {highlightText(file.user.firstName + " " + file.user.lastName, searchQuery)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {file.createdDate
                      ? new Date(file.createdDate).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/file/${file.id}/${file.title}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View File
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No files found.</p>
        )}
  
        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-l-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2">{currentPage}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-r-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
   
};

export default FileList;
