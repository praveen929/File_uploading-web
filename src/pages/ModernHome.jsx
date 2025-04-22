import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Cookies from "js-cookie";
import Card, { CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";

const ModernHome = () => {
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userId, setUserId] = useState(null);

  // Fetch files and users from API
  useEffect(() => {
    const storedUserId = Cookies.get("userId");
    setUserId(storedUserId);

    // Fetch files
    fetch("http://localhost:8080/files/all")
      .then((response) => response.json())
      .then((data) => {
        setFiles(data.reverse().slice(0, 6));
        setLoadingFiles(false);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
        setLoadingFiles(false);
      });

    // Fetch users
    fetch("http://localhost:8080/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.reverse().slice(0, 6));
        setLoadingUsers(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoadingUsers(false);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>FileHub - Modern File Sharing Platform</title>
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Share files securely and efficiently
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              FileHub makes it easy to upload, share, and manage your files in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              {userId ? (
                <Link to="/upload-file">
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    Upload a File
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    Get Started
                  </Button>
                </Link>
              )}
              <Link to="/all-files">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Browse Files
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage your files
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools you need to upload, organize, and share your files securely.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy File Upload</h3>
              <p className="text-gray-600">
                Drag and drop your files or use our simple upload interface to quickly add files to your account.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Storage</h3>
              <p className="text-gray-600">
                Your files are encrypted and stored securely, ensuring your data remains private and protected.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">File Organization</h3>
              <p className="text-gray-600">
                Organize your files with custom categories, tags, and folders to keep everything in order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Files Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Recent Files
            </h2>
            <Link to="/all-files" className="text-blue-600 hover:text-blue-800 font-medium">
              View all files →
            </Link>
          </div>
          
          {loadingFiles ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <Card key={file.id} variant="interactive" className="h-full">
                  <CardBody>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-500">
                        {file.createdDate
                          ? new Date(file.createdDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                      {file.title}
                    </h3>
                    
                    <div className="flex items-center mb-4">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 mr-2">
                        {file.user && file.user.firstName
                          ? file.user.firstName.charAt(0) + file.user.lastName.charAt(0)
                          : "?"}
                      </div>
                      <span className="text-sm text-gray-600 truncate">
                        {file.user
                          ? `${file.user.firstName} ${file.user.lastName}`
                          : "Unknown User"}
                      </span>
                    </div>
                    
                    <Link to={`/file/${file.id}/${file.title}`}>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        fullWidth
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        View File
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Users Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              New Users
            </h2>
            <Link to="/allusers" className="text-blue-600 hover:text-blue-800 font-medium">
              View all users →
            </Link>
          </div>
          
          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {users.map((user) => (
                <Link 
                  key={user.id} 
                  to={`/users/${user.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center group-hover:shadow-md transition-shadow duration-300">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-medium mb-4">
                      {user && user.firstName
                        ? user.firstName.charAt(0) + user.lastName.charAt(0)
                        : "?"}
                    </div>
                    <h3 className="text-gray-900 font-medium truncate group-hover:text-blue-600 transition-colors duration-200">
                      {user && user.firstName
                        ? `${user.firstName} ${user.lastName}`
                        : "Unknown User"}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to start sharing your files?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of users who trust FileHub for their file management needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {userId ? (
              <Link to="/upload-file">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Upload Now
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Create Free Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">FileHub</span>
              </div>
              <p className="text-gray-400 mb-4">
                Secure file storage and sharing platform for everyone.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">Home</Link></li>
                <li><Link to="/all-files" className="text-gray-400 hover:text-white transition-colors duration-200">Files</Link></li>
                <li><Link to="/allusers" className="text-gray-400 hover:text-white transition-colors duration-200">Users</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors duration-200">Login</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors duration-200">Register</Link></li>
                <li><Link to="/profile" className="text-gray-400 hover:text-white transition-colors duration-200">Profile</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">support@filehub.com</li>
                <li className="text-gray-400">+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} FileHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ModernHome;
