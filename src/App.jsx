import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import MoviePreview from "./components/MoviePreview";
import LoginSignup from "./pages/Login";
import Register from "./pages/Register";
import MyList from "./pages/MyList";
import Profile from "./pages/Profile";
import ForgotPass from "./pages/ForgotPassWord";
import ErrorBoundary from "./components/Error";
import ProtectedRoute from "./components/ProtectedRoutes";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/movies" Component={Home} />
          <Route path="/login" Component={LoginSignup} />
          <Route path="/register" Component={Register} />
          <Route path="/forgot-password" Component={ForgotPass} />
          <Route path="/movie/:id" Component={MoviePreview} />

          {/* Protected Routes */}
          <Route
            path="/u/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/u/mylist"
            element={
              <ProtectedRoute>
                <MyList />
              </ProtectedRoute>
            }
          />

          {/* Fallback for unhandled routes */}
          <Route path="/*" Component={ErrorBoundary} />
        </Routes>

        <BackToTop />
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
