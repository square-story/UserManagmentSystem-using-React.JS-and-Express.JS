/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError, updateProfile } from "../../features/profileSlice";
import ValidationMessage from "../common/Validation";

const AdminProfileEditModal = ({ isModalOpen, toggleModal, selectedUser, onUpdateUser }) => {
    const dispatch = useDispatch();
    const [editedUser, setEditedUser] = useState(selectedUser);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(selectedUser.profileImage);
    const [validationErrors, setValidationErrors] = useState({});
    const error = useSelector(state => state.profile.error);


    useEffect(() => {
        setEditedUser(selectedUser);
        setImagePreview(selectedUser.profileImage ? `http://localhost:5000${selectedUser.profileImage}` : '');
    }, [selectedUser]);




    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validTypes.includes(file.type)) {
            setValidationErrors((prev) => ({
                ...prev,
                profileImage: "Invalid file type. Only JPEG and PNG are allowed.",
            }));
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setValidationErrors((prev) => ({
                ...prev,
                profileImage: "File size exceeds 2MB",
            }));
            return;
        }
        setImageFile(file);
        setValidationErrors((prev) => ({ ...prev, profileImage: null })); // Clear previous errors
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result); // Preview the selected image
        };

        if (file) reader.readAsDataURL(file); // Show preview
    };

    const handleSave = async () => {
        const errors = validateForm(editedUser);
        setValidationErrors(errors);
        dispatch(setError(''));
        if (Object.keys(errors).length > 0) return;
        try {
            let uploadedImageUrl = editedUser.profileImage;
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const response = await axios.post('http://localhost:5000/api/profile/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                });

                uploadedImageUrl = response.data.imageUrl; // Get the uploaded image URL
            }

            // Update profile
            const updatedProfile = { ...editedUser, profileImage: uploadedImageUrl, selectedUser };
            const response = await axios.put(
                'http://localhost:5000/api/profile/userdata',
                updatedProfile,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            // Dispatch updated profile data
            dispatch(updateProfile(response.data.user));
            console.log(response.data.user);
            onUpdateUser(response.data.user); // Update parent state
            // Close the modal
            toggleModal(false);
        } catch (error) {
            console.error('Error updating profile:', error);

            // Display backend error message
            const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
            dispatch(setError(errorMessage));
        }
    }


    const validateForm = (userData) => {
        const errors = {};
        const urlRegex = /^(https?:\/\/)?([\w-]+)+([\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

        // Username Validation
        if (!userData.username) {
            errors.username = "Username is required";
        } else if (userData.username.trim().length < 3) {
            errors.username = "Username must be at least 3 characters long";
        }

        // Email Validation
        if (!userData.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
            errors.email = "Invalid email format";
        }

        // Social Media Links Validation
        ["github", "linkedin", "twitter", "unsplash"].forEach((platform) => {
            if (userData[platform] && !urlRegex.test(userData[platform])) {
                errors[platform] = `Invalid ${platform} URL`;
            }
        });

        return errors;
    };

    return (
        isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-lg sm:max-w-md md:max-w-sm max-h-screen overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    <form >
                        {/* Username Field */}
                        <div className="mb-4">

                            <label className="block text-gray-700">Username</label>

                            <input
                                type="text"
                                name="username"
                                value={editedUser.username || ''}
                                onChange={handleChange}
                                placeholder="Enter your new username"
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                            {validationErrors.username && <ValidationMessage message={validationErrors.username} />}
                        </div>


                        {/* Email Field */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={editedUser.email || ''}
                                onChange={handleChange}
                                placeholder="Enter your new email"
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                            {validationErrors.email && <ValidationMessage message={validationErrors.email} />}
                        </div>


                        {/* Profile Image Upload */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Profile Image</label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                            {imagePreview && (
                                <div className="mt-4 flex justify-center">
                                    <img
                                        src={imagePreview}
                                        alt="Profile Preview"
                                        className="w-24 h-24 object-cover rounded-full"
                                    />
                                </div>
                            )}
                            {validationErrors.profileImage && <ValidationMessage message={validationErrors.profileImage} />}
                        </div>


                        {/* Social Media Links */}
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Social Media Links</h3>
                            {['GitHub', 'LinkedIn', 'Twitter', 'Unsplash'].map((platform) => (
                                <div className="flex items-center mb-2" key={platform}>
                                    <label className="block text-gray-700 w-20">{platform}</label>
                                    <input
                                        type="text"
                                        name={platform.toLowerCase()}
                                        value={editedUser[platform.toLowerCase()] || ''}
                                        onChange={handleChange}
                                        placeholder={`Enter ${platform} URL`}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Cancel and Save Buttons */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={toggleModal}
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="button" onClick={handleSave}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
}

export default AdminProfileEditModal;