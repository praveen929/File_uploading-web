import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Modern Page imports
import ModernHome from "./pages/ModernHome";
import ModernLogin from "./pages/ModernLogin";

// Original Page imports
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadFile from "./pages/UploadFile";
import FileList from "./pages/FileList";
import FileView from "./pages/FileView";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";
import EditFile from "./pages/EditFile";
import AllUsers from "./pages/AllUsers";
import Home from "./pages/Home";

// Component imports
import UserProfile from "./components/UserProfile";

// Layout imports
import ModernNavbar from "./layouts/ModernNavbar";
import Navbar from "./layouts/Navbar";

const App = () => {
  // Use modern UI by default
  const useModernUI = true;

  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          {useModernUI ? <ModernNavbar /> : <Navbar />}
          <div className="w-full flex-grow">
            <Routes>
              <Route
                path="/"
                element={useModernUI ? <ModernHome /> : <Home />}
              />
              <Route
                path="/login"
                element={
                  <>
                    <Helmet>
                      <title>Login - FileHub</title>
                    </Helmet>
                    {useModernUI ? <ModernLogin /> : <Login />}
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

          {/* Footer would go here */}
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
