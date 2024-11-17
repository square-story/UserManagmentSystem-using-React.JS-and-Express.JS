import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../features/authSlice';
import { useState } from 'react';
import AddUser from './addUser';

const AdminNavBar = () => {
    const dispatch = useDispatch();
    const [isModalOpen, toggleModal] = useState(false)
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    }

    return (
        <nav className="bg-gray-800 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-semibold">
                    <Link to="/dashboard" className="hover:text-gray-300">Admin Dashboard</Link>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={() => toggleModal(!isModalOpen)}
                        className="bg-violet-500 text-white px-4 py-2 rounded hover:bg-violet-600"
                    >
                        Add New User
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                    {
                        isModalOpen && (
                            <AddUser isModalOpen={isModalOpen} toggleModal={() => toggleModal(false)} />
                        )
                    }
                </div>
            </div>
        </nav>
    )
}

export default AdminNavBar