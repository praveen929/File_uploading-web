import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async"; // Import Helmet and HelmetProvider

import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadFile from "./pages/UploadFile";
import FileList from "./pages/FileList";
import FileView from "./pages/FileView";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";
import StudentProfileEdit from "./pages/StudentProfileEdit";
import EditFile from "./pages/EditFile";
import AllUsers from "./pages/AllUsers";
import UserProfile from "./pages/UserProfile";

import Navbar from "./layouts/Navbar";
import Home from "./pages/Home";
import { ThemeProvider } from "./contexts/ThemeContext";

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Navbar />
            <div className="pt-16">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Helmet>
                        <title>FileHub - Share Files Easily</title>
                      </Helmet>
                      <Home />
                    </>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <>
                      <Helmet>
                        <title>Dashboard - FileHub</title>
                      </Helmet>
                      <Home />
                    </>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <>
                      <Helmet>
                        <title>Login - FileHub</title>
                      </Helmet>
                      <Login />
                    </>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <>
                      <Helmet>
                        <title>Register - FileHub</title>
                      </Helmet>
                      <Register />
                    </>
                  }
                />
                <Route
                  path="/upload-file"
                  element={
                    <>
                      <Helmet>
                        <title>Upload File - FileHub</title>
                      </Helmet>
                      <UploadFile />
                    </>
                  }
                />
                <Route
                  path="/all-files"
                  element={
                    <>
                      <Helmet>
                        <title>All Files - FileHub</title>
                      </Helmet>
                      <FileList />
                    </>
                  }
                />
                <Route
                  path="/allusers"
                  element={
                    <>
                      <Helmet>
                        <title>All Users - FileHub</title>
                      </Helmet>
                      <AllUsers />
                    </>
                  }
                />
                <Route
                  path="/users/:id"
                  element={
                    <>
                      <Helmet>
                        <title>User Profile - FileHub</title>
                      </Helmet>
                      <UserProfile />
                    </>
                  }
                />
                <Route
                  path="/file/:fileId/:title"
                  element={
                    <>
                      <Helmet>
                        <title>File View - FileHub</title>
                      </Helmet>
                      <FileView />
                    </>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <>
                      <Helmet>
                        <title>Profile - FileHub</title>
                      </Helmet>
                      <ProfilePage />
                    </>
                  }
                />
                <Route
                  path="/profile-edit"
                  element={
                    <>
                      <Helmet>
                        <title>Edit Profile - FileHub</title>
                      </Helmet>
                      <ProfileEditPage />
                    </>
                  }
                />
                <Route
                  path="/student-profile-edit"
                  element={
                    <>
                      <Helmet>
                        <title>Edit Student Profile - FileHub</title>
                      </Helmet>
                      <StudentProfileEdit />
                    </>
                  }
                />
                <Route
                  path="/edit/:fileId/:userId/:title"
                  element={
                    <>
                      <Helmet>
                        <title>Edit File - FileHub</title>
                      </Helmet>
                      <EditFile />
                    </>
                  }
                />
                <Route
                  path="/profile-edit"
                  element={
                    <>
                      <Helmet>
                        <title>Account Settings - FileHub</title>
                      </Helmet>
                      <ProfileEditPage />
                    </>
                  }
                />
                {/* Catch-all route for unmatched paths */}
                <Route
                  path="*"
                  element={
                    <>
                      <Helmet>
                        <title>FileHub</title>
                      </Helmet>
                      <Home />
                    </>
                  }
                />
              </Routes>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
