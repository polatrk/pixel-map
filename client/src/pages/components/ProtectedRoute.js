import { Navigate } from "react-router-dom";
import { GetUserInfos } from "../../utils/UserInfos";

const ProtectedRoute = ({children, requiredRole}) => {
    const { role } = GetUserInfos()
    if(role !== requiredRole && role !== 'admin')
        return <Navigate to='/forbidden'></Navigate>

    return children
}

export default ProtectedRoute;