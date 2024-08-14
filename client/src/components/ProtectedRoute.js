import Cookies from 'js-cookie'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute=()=>{
    const token = Cookies.get("token");

    if(!token){
        return <Navigate to="/"/>
    }

    return <Outlet/>
}

export default ProtectedRoute