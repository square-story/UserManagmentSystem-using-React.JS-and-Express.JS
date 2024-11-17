import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  profile: {},
  loading: false,
  error: null
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setProfile, updateProfile, setLoading, setError } = profileSlice.actions;

export const updateProfileData = (updatedProfile) => async (dispatch) => {
  try {
    dispatch(setLoading(true));  // Start loading before API call
    const response = await axios.put(
      'http://localhost:5000/api/profile/userdata', // Make sure the URL is correct
      updatedProfile,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    );

    // Check if the response contains user data
    if (response.data && response.data.user) {
      dispatch(updateProfile(response.data.user)); // Dispatch the updated profile data
    } else {
      throw new Error('Profile data not found in the response.');
    }
    
  } catch (error) {
    dispatch(setError(error.response?.data?.errors)); // Capture error message
    console.log(error.response?.data?.errors)
    console.error('Error updating profile:', error);
  } finally {
    dispatch(setLoading(false)); // Stop loading after the API call
  }
};

export default profileSlice.reducer;
