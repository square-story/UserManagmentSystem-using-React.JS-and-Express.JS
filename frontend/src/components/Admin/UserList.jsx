import axios from "axios";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import AdminProfileEditModal from "./AdminProfileEditModal";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // To store errors, if any
    const [isModalOpen, toggleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // To store the selected user for editing

    const handleEdit = (userId) => {
        const userToEdit = users.find(user => user._id === userId);
        setSelectedUser(userToEdit);
        toggleModal(true);
    };

    const handleDelete = (userId) => {
        console.log("Delete user with ID:", userId);
    };



    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/profile/getUsers', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUsers(response.data);
            } catch (error) {
                setError("Failed to fetch users.");
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="relative flex w-full flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
            {users.map((user) => (
                <UserCard
                    key={user._id}
                    user={user}
                    onDelete={() => handleDelete(user._id)}
                    onEdit={() => handleEdit(user._id)} />
            ))}
            {
                isModalOpen && selectedUser && (
                    <AdminProfileEditModal isModalOpen={isModalOpen} toggleModal={() => toggleModal(false)} selectedUser={selectedUser} />
                )
            }
        </div>
    )
}

export default UserList