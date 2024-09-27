import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getLocalStoredUser } from "@/api/authentication";

type RequireAuthProps = {
  allowedRoles?: UserDataType["userRole"][]
}

export const RequireAuth: React.FC<RequireAuthProps> = (props: RequireAuthProps) => {

  const localUser = getLocalStoredUser();
  const location = useLocation();

  return (
    localUser !== undefined ? (
      props.allowedRoles === undefined || props.allowedRoles.includes(localUser.userRole) ? (
        <Outlet />
      ) : (
        <Navigate to="/login?reason=unauthorized" state={{ from: location.pathname }} replace />
      )
    ) : (
      <Navigate to="/login?reason=nocredentials" state={{ from: location.pathname }} replace />
    )
  )
}

export default RequireAuth;