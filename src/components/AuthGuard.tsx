import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }: any) => {
  const token = localStorage.getItem("accessToken");

  return token ? children : <Navigate to="/signin" replace />;
};

export default AuthGuard;