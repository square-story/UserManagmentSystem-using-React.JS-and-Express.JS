import axios from "axios";
import { useState } from "react";
import ValidationMessage from "../common/Validation";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../features/profileSlice";
import { addUser } from "../../features/adminSlice";

/* eslint-disable react/prop-types */
const AddUser = ({ isModalOpen, toggleModal }) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        profileImage: '',
        github: '',
        linkedin: '',
        twitter: '',
        unsplash: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('https://static.thenounproject.com/png/801397-200.png');
    const [validationErrors, setValidationErrors] = useState({});
    const error = useSelector(state => state.profile.error);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        toggleModal(!isModalOpen)

        dispatch(setError(''))
        return;
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("File size must be less than 2MB.");
                return;
            }
            const validTypes = ["image/jpeg", "image/png"];
            if (!validTypes.includes(file.type)) {
                alert("Invalid file type. Only JPEG and PNG are allowed.");
                return;
            }
            setUser((prev) => ({ ...prev, profileImage: file }));
            setImageFile(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            }
            reader.readAsDataURL(file);
        }
    }

    const validateInput = () => {
        const errors = {};
        if (!user.username || user.username.trim().length < 3) {
            errors.username = "Username must be at least 3 characters.";
        }
        if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
            errors.email = "Enter a valid email address.";
        }
        if (!user.password || user.password.length < 6) {
            errors.password = "Password must be at least 6 characters.";
        }
        if (imageFile && !['image/jpeg', 'image/png'].includes(imageFile.type)) {
            errors.image = "Profile image must be in JPEG or PNG format.";
        }
        return errors;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const errors = validateInput();
        setValidationErrors(errors)
        if (Object.keys(errors).length > 0) {
            console.log('Validation Errors:', errors);
            return;
        }
        dispatch(setError(''))
        try {
            let uploadedImageUrl = '';
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const response = await axios.post('http://localhost:5000/api/profile/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                });
                uploadedImageUrl = response.data.imageUrl;
            }
            const newUser = { ...user, profileImage: uploadedImageUrl };
            const response = await axios.post('http://localhost:5000/api/profile/newuser', newUser, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(addUser(response.data.user)); // Update Redux
            toggleModal()
        } catch (error) {
            console.error('Error updating profile:', error.response?.data || error.message);
            dispatch(setError(error.response?.data || { message: "An unexpected error occurred." }));
        }
    }
    if (!isModalOpen) return null;

    return (
        isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4" style={{ zIndex: 50, marginLeft: 0 }}>
                <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-lg sm:max-w-md md:max-w-sm max-h-screen overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4 text-center">Add Profile</h2>
                    <form onSubmit={handleSave}>
                        {error && <ValidationMessage message={error.message} />}
                        {/* Username Field */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Username</label>
                            <input
                                type="text"
                                value={user.username || ''}
                                onChange={handleChange}
                                name="username"
                                placeholder="Enter username"
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                            {validationErrors.username && <ValidationMessage message={validationErrors.username} />}
                        </div>

                        {/* Email Field */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                value={user.email || ''}
                                onChange={handleChange}
                                name="email"
                                placeholder="Enter email"
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                            {validationErrors.email && <ValidationMessage message={validationErrors.email} />}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">password</label>
                            <input
                                type="password"
                                value={user.password || ''}
                                onChange={handleChange}
                                name="password"
                                placeholder="Enter password"
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                            {validationErrors.password && <ValidationMessage message={validationErrors.password} />}
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
                                        className="w-48 h-48 rounded-full object-cover"
                                    />
                                </div>
                            )}
                            {validationErrors.image && <ValidationMessage message={validationErrors.image} />}
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
                                        value={user[platform.toLowerCase()] || ''}
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
                                onClick={handleClose}
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
    )
}

export default AddUser