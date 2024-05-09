import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

import { auth } from "./config/firebase";

import { MoviesList, Navbar } from "./components";

import Series from "./pages/series/SeriesDetail";
import CreateSeries from "./pages/series/SeriesCreate";
import SeriesList from "./pages/series/SeriesList";
import CreateMovie from "./pages/movie/MovieCreate";
import Movie from "./pages/movie/MovieDetail";
import Settings from "./pages/settings/Settings";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import Home from "./pages";
import Profile from "./pages/profile/Profile";
import EditeSeriesModal from "./pages/EditeModal/EditeSeriesModal";
import EditeMovieModal from "./pages/EditeModal/EditeMovieModal";
import ResetPassword from "./pages/auth/ResetPassword";
import Menu from "./components/common/Menu";
// import NavbarDeneme from "./components/common/NavbarDeneme";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleAuthChanged = (user) => {
    setCurrentUser(user);
    setIsLoading(false);
  };

  onAuthStateChanged(auth, handleAuthChanged);

  if (isLoading) {
    return (
      <div className="d-flex text-center align-items-center justify-content-center vh-100 text-bold ">
        Yukleniyor...
      </div>
    );
  }
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      {auth.currentUser && <Menu />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={currentUser === null ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={
            currentUser === null ? <SignupPage /> : <Navigate to="/login" />
          }
        />
        <Route path={"/profile/:userId"} element={<Profile />} />
        <Route
          path={"/profile/:userId/settings"}
          element={
            currentUser !== null ? <Settings /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/addmovie"
          element={
            currentUser !== null && auth.currentUser.emailVerified !== false ? (
              <CreateMovie />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path={`/movie/:movieId`} element={<Movie />} />
        <Route path={`/movie/:movieId/edit`} element={<EditeMovieModal />} />
        <Route
          path="/movies"
          element={
            currentUser !== null ? <MoviesList /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/diziler"
          element={
            currentUser !== null ? <SeriesList /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/addseries"
          element={
            currentUser !== null && auth.currentUser.emailVerified !== false ? (
              <CreateSeries />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path={`/series/:seriesId`} element={<Series />} />
        <Route path={`/series/:seriesId/edit`} element={<EditeSeriesModal />} />
        <Route
          path={`/resetpassword`}
          element={
            currentUser === null ? <ResetPassword /> : <Navigate to="/" />
          }
        />
      </Routes>
      {/* <NavbarDeneme /> */}
    </BrowserRouter>
  );
}

export default App;
