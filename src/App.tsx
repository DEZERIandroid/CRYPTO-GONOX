import AppRoutes from "./Routes/AppRoutes"
import Sidebar from "./components/Sidebar"
import './App.css'

import { useEffect } from "react";
import ScrollToTop from "./components/ScrollTop";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import { initializeAuth } from "./features/userSlice";

function App() {
  const dispatch = useAppDispatch();
  const authLoading = useAppSelector(state => state.user.authLoading);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (authLoading) {
    return (
      <div className="loading-logo">
        <img src="src/assets/Gonox.png" alt="" />
      </div>
    );
  }

  return (
    <>
      <div className="wrapper">
        <Sidebar />

        <div className="main-content">
          <ScrollToTop />
          <AppRoutes />
        </div>
      </div>
    </>
  )
}

export default App
