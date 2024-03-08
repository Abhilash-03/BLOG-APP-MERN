import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"
const OnlyAdminPrivateRoute = () => {
    const { currentUser } = useSelector(state => state.user);
  return currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to='/login' />
}

export default OnlyAdminPrivateRoute
