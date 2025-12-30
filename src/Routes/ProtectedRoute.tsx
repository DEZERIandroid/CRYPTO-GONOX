import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";

const ProtectedRoute = () => {
  const { isAuthChecked, uid } = useAppSelector((state) => state.user);

  if (!isAuthChecked) {
    return ;
  }

  return uid ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;