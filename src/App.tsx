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
  const { theme } = useAppSelector(state => state.user)

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

  type ThemeType = "gonox" | "Тёмная" | "Белая" | "Зелёная" | "Синяя" | "Неоновая";
  const themeMap: Record<ThemeType, string> = {
      "gonox": "grad-gonox",
      "Тёмная": "grad-slate",
      "Белая": "grad-white",
      "Зелёная" : "grad-green",
      "Синяя": "grad-blue",
      "Неоновая": "grad-neon"
  };

  const currentGrad = themeMap[theme as ThemeType] || "none";
  
  return (
    <>
    {showLoader && (
      <div className={`loading-logo ${isFading ? "fade-out" : ""}`}>
        <img
          className={`logo-loading ${isFading ? "fade-out" : ""}`}
          src={GonoxLogo}
          alt=""
        />
      </div>
    )}
      <div className={`wrapper ${currentGrad}`}>
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
