// components/ProfileEditModal.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileData } from '../../features/profileSlice';

// eslint-disable-next-line react/prop-types
const ProfileEditModal = ({ isModalOpen, toggleModal }) => {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile.profile);
    const loading = useSelector(state => state.profile.loading);
    const error = useSelector(state => state.profile.error);
    console.log(profile)
    const [editedProfile, setEditedProfile] = useState(profile);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(profile.profileImage);

    // Fetch the user details when the modal is opened
    useEffect(() => {
        setEditedProfile(profile);
        setImagePreview(profile.profileImage);
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

    const handleSaveChanges = async (e) => {
        e.preventDefault();

        try {
            let uploadedImageUrl = editedProfile.profileImage;
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                //TODO:for the upload image
                const response = await axios.post('/api/profile/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                uploadedImageUrl = response.data.imageUrl; // Get the uploaded image URL
            }

            const updatedProfile = { ...editedProfile, profileImage: uploadedImageUrl };

            // Update the profile in Redux store
            dispatch(updateProfileData(updatedProfile));

            toggleModal(); // Close the modal
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    return (
        isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-lg sm:max-w-md md:max-w-sm">
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-red-500">Error: {error}</p>}
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
                                <div className="mt-4">
                                    <img
                                        src={imagePreview}
                                        alt="Profile Preview"
                                        className="w-32 h-32 object-cover rounded-full"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Social Media Links Edit Section */}
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Social Media Links</h3>

                            {/* GitHub */}
                            <div className="flex items-center mb-2">
                                <label className="block text-gray-700 w-20">GitHub</label>
                                <input
                                    type="text"
                                    name="github"
                                    value={editedProfile.github || ''}
                                    onChange={handleModalChange}
                                    placeholder="Enter GitHub URL"
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            {/* LinkedIn */}
                            <div className="flex items-center mb-2">
                                <label className="block text-gray-700 w-20">LinkedIn</label>
                                <input
                                    type="text"
                                    name="linkedin"
                                    value={editedProfile.linkedin || ''}
                                    onChange={handleModalChange}
                                    placeholder="Enter LinkedIn URL"
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            {/* Twitter */}
                            <div className="flex items-center mb-2">
                                <label className="block text-gray-700 w-20">Twitter</label>
                                <input
                                    type="text"
                                    name="twitter"
                                    value={editedProfile.twitter || ''}
                                    onChange={handleModalChange}
                                    placeholder="Enter Twitter URL"
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            {/* Unsplash */}
                            <div className="flex items-center mb-2">
                                <label className="block text-gray-700 w-20">Unsplash</label>
                                <input
                                    type="text"
                                    name="unsplash"
                                    value={editedProfile.unsplash || ''}
                                    onChange={handleModalChange}
                                    placeholder="Enter Unsplash URL"
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
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
