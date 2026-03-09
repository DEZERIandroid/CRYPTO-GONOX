import AppRoutes from "./Routes/AppRoutes"
import Sidebar from "./components/Sidebar"
import './App.css'

import { useEffect,useState } from "react";
import ScrollToTop from "./components/ScrollTop";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import { initializeAuth } from "./features/userSlice";
import GonoxLogo from '/Gonoxlogo.png';

function App() {
  const dispatch = useAppDispatch();
  const authLoading = useAppSelector(state => state.user.authLoading);
  
  const [showLoader, setShowLoader] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!authLoading) {
      setIsFading(true); 
      setTimeout(() => {
        setShowLoader(false); 
      }, 600); 
    }
  }, [authLoading]);

  
  return (
    <>
    {showLoader && (
      <div className="loading-logo">
        <img className={`logo-loading ${isFading ? "fade-out" : ""}`} src={GonoxLogo} alt="" />
      </div>
    )}
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
