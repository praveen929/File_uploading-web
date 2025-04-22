import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async"; // Import Helmet and HelmetProvider

import Login from "./components/Login";
import Register from "./components/Register";
import UploadFile from "./components/UplodeFile";
import FileList from "./components/FileList";
import FileView from "./components/FileView";
import ProfilePage from "./components/ProfilePage";
import ProfileEditPage from "./components/ProfileEditPage";
import EditFile from "./components/EditFile";
import AllUsers from "./components/AllUsers";
import UserProfile from "./UserProfile";
import Navbar from "./Navbar";
import Home from "./components/Home";

<Home />;

const App = () => {
  return (
    <HelmetProvider>
      {" "}
      {/* Wrap the app in HelmetProvider */}
      <Router>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <Navbar />
          <div className="w-full max-w-4xl mt-10">
            <Routes>
              <Route path="/" element={<Home />} />
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
            </Routes>
          </div>
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
