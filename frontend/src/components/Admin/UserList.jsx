import axios from "axios";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // To store errors, if any

    const handleEdit = (userId) => {
        console.log("Edit user with ID:", userId);
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
        </div>
    )
}

export default UserList