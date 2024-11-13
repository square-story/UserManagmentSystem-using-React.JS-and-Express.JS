import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../features/authSlice";

const UserDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };
    return (
        <div>UserDetails
            <nav>
                <button onClick={handleLogout}>Logout</button>
            </nav>
        </div>
    )
}

export default UserDetails