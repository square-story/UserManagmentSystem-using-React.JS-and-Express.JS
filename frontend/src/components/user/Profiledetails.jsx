import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../../features/authSlice";
import { setProfile } from "../../features/profileSlice";
import SocialLinks from "../common/SocialLinks";

const Profiledetails = () => {
    const dispatch = useDispatch();
    let token = localStorage.getItem('token')
    const [localUserDetails, setLocalUserDetails] = useState(null);

    const user = useSelector((state) => state.profile);


    useEffect(() => {
        const fetchUserDetails = async () => {
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/api/auth/getUserDetails', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const userData = response.data.data
                    setLocalUserDetails(userData);
                    dispatch(setUser({ token, user: response.data }));
                    dispatch(setProfile(userData))
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            }
        };
        fetchUserDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setLocalUserDetails(user?.profile);
    }, [user]);

    return (<>
        <header className="w-full h-screen px-2 py-4 flex flex-col justify-center items-center text-center bg-gray-900">
            <img className="inline-flex object-cover border-4 border-indigo-600 rounded-full shadow-[5px_5px_0_0_rgba(0,0,0,1)] shadow-red-600/100 bg-indigo-50 text-indigo-600 h-24 w-24 !h-48 !w-48" src={localUserDetails?.profileImage ? `http://localhost:5000${localUserDetails?.profileImage}` : 'https://static.thenounproject.com/png/801397-200.png'}
                alt="" />
            <h1 className="text-2xl text-gray-500 font-bold mt-2">
                {localUserDetails ? localUserDetails.username : 'Loading...'}
            </h1>
            <h2 className="text-base md:text-xl text-gray-500 font-bold">
                {localUserDetails ? localUserDetails.email : 'Loading...'}
            </h2>
            <SocialLinks userDetails={localUserDetails} />
        </header >
    </>
    )
}

export default Profiledetails