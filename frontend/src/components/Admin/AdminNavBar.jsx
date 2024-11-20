import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../features/authSlice';
import { useState } from 'react';
import AddUser from './AddUser';
import { searchUsers } from '../../features/adminSlice';

const AdminNavBar = () => {
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, toggleModal] = useState(false)
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    }

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        dispatch(searchUsers(query));
    };

    return (
        <nav className="bg-gray-800 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-semibold hidden lg:block">
                    <Link to="/dashboard" className="hover:text-gray-300">Admin Dashboard</Link>
                </div>
                <div className="text-white text-lg font-semibold flex justify-center lg:justify-start">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search users..."
                        className="w-52 max-w-xs sm:max-w-sm lg:max-w-md bg-gray-700 text-white px-3 py-1 rounded focus:outline-none focus:ring focus:ring-violet-500"
                    />
                </div>

                <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                    <button
                        onClick={() => toggleModal(!isModalOpen)}
                        className="bg-violet-500 text-white px-4 py-2 rounded hover:bg-violet-600 w-full lg:w-auto"
                    >
                        Add New User
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full lg:w-auto"
                    >
                        Logout
                    </button>
                    {isModalOpen && (
                        <AddUser isModalOpen={isModalOpen} toggleModal={() => toggleModal(false)} />
                    )}
                </div>

            </div>
        </nav>
    )
}

export default AdminNavBar