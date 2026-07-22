import { Navigate } from "react-router"

export default function ProtectedRoute({children, role}) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')|| 'null');
    if(!token || !user){
        return <Navigate to="/login" replace/>
    }
    if(role && user.role!==role){
        return <Navigate to={user.role === 'admin'? '/admin/dashboard':'/student/dashboard'}/>
    }
    return children;
};
