// components/UserNavbar.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileEditModal from "./ProfileEditModal";

const UserNavbar = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        navigate("/");
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <nav className="bg-gray-800 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-semibold">
                    <Link to="/userdetails" className="hover:text-gray-300">Home</Link>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={toggleModal}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Edit profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
            {isModalOpen && <ProfileEditModal isModalOpen={isModalOpen} toggleModal={toggleModal} />}
        </nav>
    );
};

export default UserNavbar;
