import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import MoviePreview from "./components/MoviePreview";
import LoginSignup from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/login" Component={LoginSignup} />
          <Route path="/register" Component={Register} />
          <Route path="/mylist" Component={Home} />
          <Route path="/:id" Component={MoviePreview} />

        </Routes>
        <BackToTop />
        <Footer />
      </BrowserRouter>

    </>
  )
}


export default App;
