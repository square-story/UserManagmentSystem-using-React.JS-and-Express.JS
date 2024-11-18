// components/ProfileEditModal.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setError, updateProfile } from '../../features/profileSlice';

// eslint-disable-next-line react/prop-types
const ProfileEditModal = ({ isModalOpen, toggleModal }) => {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile.profile);
    const loading = useSelector(state => state.profile.loading);
    const error = useSelector(state => state.profile.error);
    const [editedProfile, setEditedProfile] = useState(profile);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(profile.profileImage);
    const [formErrors, setFormErrors] = useState({});

    // Fetch the user details when the modal is opened
    useEffect(() => {
        setEditedProfile(profile);
        setImagePreview(profile.profileImage ? `http://localhost:5000${profile.profileImage}` : ''); // Set initial preview
    }, [profile]);

    const handleModalChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile({ ...editedProfile, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result); // Preview the selected image
        };

        if (file) reader.readAsDataURL(file); // Show preview
    };


    // Form validation function
    const validateForm = () => {
        const errors = {};

        // Username Validation
        if (!editedProfile.username) {
            errors.username = "Username is required.";
        } else if (editedProfile.username.length < 3) {
            errors.username = "Username must be at least 3 characters.";
        }

        // Email Validation
        if (!editedProfile.email) {
            errors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(editedProfile.email)) {
            errors.email = "Email is invalid.";
        }

        // Profile Image Validation (optional)
        if (imageFile && !['image/jpeg', 'image/png'].includes(imageFile.type)) {
            errors.image = "Profile image must be in JPEG or PNG format.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0; // Return true if no errors
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();

        // Clear previous error and validate form
        dispatch(setError(''));
        if (!validateForm()) return;

        try {
            let uploadedImageUrl = editedProfile.profileImage;

            // Handle image upload
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const uploadResponse = await axios.post(
                    'http://localhost:5000/api/profile/upload',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                uploadedImageUrl = uploadResponse.data.imageUrl;
            }

            // Update profile
            const updatedProfile = { ...editedProfile, profileImage: uploadedImageUrl };
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

            // Close the modal
            toggleModal(false);
        } catch (err) {
            console.error('Error updating profile:', err);

            // Display backend error message
            const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
            dispatch(setError(errorMessage));
        }
    };



    return (
        isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-lg sm:max-w-md md:max-w-sm max-h-screen overflow-y-auto">
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
                    <form onSubmit={handleSaveChanges}>
                        {/* Username Field */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={editedProfile.username || ''}
                                onChange={handleModalChange}
                                placeholder="Enter your new username"
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                            {formErrors.username && <p className="text-red-500 text-sm">{formErrors.username}</p>}
                        </div>

                        {/* Email Field */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={editedProfile.email || ''}
                                onChange={handleModalChange}
                                placeholder="Enter your new email"
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                            {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                        </div>

                        {/* Profile Image Upload */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Profile Image</label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                            {formErrors.image && <p className="text-red-500 text-sm">{formErrors.image}</p>}
                            {imagePreview && (
                                <div className="mt-4 flex justify-center">
                                    <img
                                        src={imagePreview}
                                        alt="Profile Preview"
                                        className="w-24 h-24 object-cover rounded-full"
                                    />
                                </div>
                            )}
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
                                        value={editedProfile[platform.toLowerCase()] || ''}
                                        onChange={handleModalChange}
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
                                type="submit"
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

};

export default ProfileEditModal;
