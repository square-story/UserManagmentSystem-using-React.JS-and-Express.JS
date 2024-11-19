import axios from "axios";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import AdminProfileEditModal from "./AdminProfileEditModal";
import Notification from "../common/Notification";
import ConfirmationModal from "../common/ConfirmationModal";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../../features/adminSlice";

const UserList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, toggleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // To store the selected user for editing
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, userId: null });
    const dispatch = useDispatch();
    const users = useSelector(state => state.users.filteredUsers)

    const handleEdit = (userId) => {
        const userToEdit = users.find(user => user._id === userId);
        setSelectedUser(userToEdit);
        toggleModal(true);
    };

    const handleDelete = async () => {
        try {
            // Optimistically update the UI
            const updatedUsers = users.filter(user => user._id !== confirmDelete.userId);
            dispatch(setUsers(updatedUsers));

            // Send delete request to the server
            const response = await axios.delete(`http://localhost:5000/api/profile/delete/${confirmDelete.userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            console.log('Delete response:', response.data);
            setNotification({ message: response.data.message, type: 'success' });
        } catch (error) {
            setNotification({ message: error.response?.data?.message || 'Failed to delete user.', type: 'error' });
        } finally {
            setConfirmDelete({ isOpen: false, userId: null }); // Close confirmation modal
        }
    };

    const handleConfirmDelete = (userId) => {
        setConfirmDelete({ isOpen: true, userId });
    };


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/profile/getUsers', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                dispatch(setUsers(response.data));
            } catch (error) {
                setError("Failed to fetch users.");
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [dispatch]);

    const handleUserUpdate = (updatedUser) => {
        const updatedUsers = users.map(user =>
            user._id === updatedUser._id ? updatedUser : user
        )
        dispatch(setUsers(updatedUsers));
    };


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

    if (users.length === 0) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">No users found.</p>
            </div>
        );
    }

    return (
        <div className="relative flex w-full flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
            {users.map((user) => (
                <UserCard
                    key={user._id}
                    user={user}
                    onDelete={() => handleConfirmDelete(user._id)}
                    onEdit={() => handleEdit(user._id)} />
            ))}
            {isModalOpen && selectedUser && (
                <AdminProfileEditModal
                    isModalOpen={isModalOpen}
                    toggleModal={() => toggleModal(false)}
                    selectedUser={selectedUser}
                    onUpdateUser={handleUserUpdate} // Pass the function as a prop
                />
            )}

            <ConfirmationModal
                isOpen={confirmDelete.isOpen}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete({ isOpen: false, userId: null })}
                message="Are you sure you want to delete this user?"
            />
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })}
            />
        </div>
    )
}

export default UserList