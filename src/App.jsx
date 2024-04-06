import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/index";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import { auth } from "./config/firebase";
import SignupPage from "./pages/SignupPage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleAuthChanged = (user) => {
    setCurrentUser(user);
    setIsLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleAuthChanged);

    return unsubscribe ? () => unsubscribe() : null;
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex text-center align-items-center justify-content-center vh-100 text-bold ">
        Yukleniyor...
      </div>
    );
  }
  console.log(currentUser);

  return (
    <BrowserRouter>
      <Navbar currentUser={currentUser} />
      <Routes>
        <Route
          path="/"
          element={<Home currentUser={currentUser} setIsLoading={isLoading} />}
        />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
