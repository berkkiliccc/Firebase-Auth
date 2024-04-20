import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/index";
import LoginPage from "./pages/LoginPage";
import { auth } from "./config/firebase";
import SignupPage from "./pages/SignupPage";
import CreateMovie from "./components/CreateMovie";
import Movie from "./components/Movie";
import Navbar from "./components/Navbar";
import MovieList from "./components/MovieList";
import Profile from "./components/Profile";
import CreateSeries from "./components/CreateSeries";
import SeriesList from "./components/SeriesList";

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
  // console.log(currentUser);

  return (
    <BrowserRouter>
      <Navbar />
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
        <Route
          path="/addmovie"
          element={
            currentUser !== null ? <CreateMovie /> : <Navigate to="/login" />
          }
        />
        <Route path={`/movie/:movieId`} element={<Movie />} />
        <Route
          path={"/movies"}
          element={
            currentUser !== null ? <MovieList /> : <Navigate to="/login" />
          }
        />
        <Route
          path={"/diziler"}
          element={
            currentUser !== null ? <SeriesList /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/addseries"
          element={
            currentUser !== null ? <CreateSeries /> : <Navigate to="/login" />
          }
        />
        <Route path={"/profile/:userId"} element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
