import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

// Function to highlight the matched text
const highlightText = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="bg-yellow-200">
        {part}
      </span>
    ) : (
      part
    )
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
      const firstDayOfWeek = new Date(
        now.setDate(now.getDate() - now.getDay())
      );
      startDate = firstDayOfWeek.toISOString().split("T")[0];
      endDate = new Date(firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 6))
        .toISOString()
        .split("T")[0];
      break;
    case "Last Week":
      const lastWeekStart = new Date(
        now.setDate(now.getDate() - now.getDay() - 7)
      );
      startDate = lastWeekStart.toISOString().split("T")[0];
      endDate = new Date(lastWeekStart.setDate(lastWeekStart.getDate() + 6))
        .toISOString()
        .split("T")[0];
      break;
    case "This Month":
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate = startOfMonth.toISOString().split("T")[0];
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];
      break;
    case "Last Month":
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      startDate = lastMonthStart.toISOString().split("T")[0];
      endDate = new Date(now.getFullYear(), now.getMonth(), 0)
        .toISOString()
        .split("T")[0];
      break;
    case "This Year":
      startDate = new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0];
      endDate = new Date(now.getFullYear(), 11, 31).toISOString().split("T")[0];
      break;
    case "Last Year":
      startDate = new Date(now.getFullYear() - 1, 0, 1)
        .toISOString()
        .split("T")[0];
      endDate = new Date(now.getFullYear() - 1, 11, 31)
        .toISOString()
        .split("T")[0];
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
      .get("https://file-uploading-web.onrender.com/files/all")
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
      const filtered = filteredFiles.filter(
        (file) =>
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
    if (page < 1 || page > totalPages) return; // Prevent going out of bounds
    setCurrentPage(page);
  };

  // Calculate the index for the first and last file on the current page
  const indexOfLastFile = currentPage * pageSize;
  const indexOfFirstFile = indexOfLastFile - pageSize;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);

  // Calculate total pages based on filtered files length
  const totalPages = Math.ceil(filteredFiles.length / pageSize);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* GitHub-style Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-8 h-8 mr-3 text-gray-900 dark:text-gray-100"
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
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  All Files
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Browse and manage uploaded files
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/upload-file"
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Upload File
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Search & Filter
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Files
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder={`Search by "${animationText}"`}
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Filter Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Date
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="All">All Time</option>
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
            </div>
          </div>
        </div>

        {/* Files List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Files
              </h2>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {filteredFiles.length}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : currentFiles.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentFiles.map((file, index) => (
                <div
                  key={file.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => navigate(`/file/${file.id}/${file.title}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1 min-w-0">
                      {/* File Icon */}
                      <svg
                        className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0"
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
                            to={`/file/${file.id}/${file.title}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium truncate"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {highlightText(file.title, searchQuery)}
                          </Link>
                        </div>

                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <span>
                            {file.user
                              ? highlightText(
                                  file.user.firstName +
                                    " " +
                                    file.user.lastName,
                                  searchQuery
                                )
                              : "Unknown User"}
                          </span>
                          <span className="mx-2">•</span>
                          <span>
                            {file.createdDate
                              ? new Date(file.createdDate).toLocaleDateString(
                                  "en-GB"
                                )
                              : "N/A"}
                          </span>
                          <span className="mx-2">•</span>
                          <span>#{index + 1 + indexOfFirstFile}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/file/${file.id}/${file.title}`}
                      className="ml-4 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center">
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
                No files found
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? `No files match "${searchQuery}"`
                  : "No files have been uploaded yet."}
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstFile + 1} to{" "}
              {Math.min(indexOfLastFile, filteredFiles.length)} of{" "}
              {filteredFiles.length} files
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileList;
