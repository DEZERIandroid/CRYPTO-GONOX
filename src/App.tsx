import AppRoutes from "./Routes/AppRoutes"
import Sidebar from "./components/Sidebar"
import './App.css'

import { useEffect } from "react";
import ScrollToTop from "./components/ScrollTop";
import { useAppDispatch } from "./hooks/reduxHooks";
import { initializeAuth } from "./features/userSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

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
