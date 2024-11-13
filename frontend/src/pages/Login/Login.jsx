import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../../services/authService";
import { setUser } from "../../features/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import './Login.css'

const Login = () => {
    const [signState, setSignState] = useState('Sign In')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('')
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); // to get current path

    useEffect(() => {
        const token = localStorage.getItem("token");
        const isAdmin = localStorage.getItem("isAdmin") === 'true';

        if (token) {
            const redirectPath = location.state?.from || (isAdmin ? '/dashboard' : '/userdetails');
            navigate(redirectPath, { replace: true });
        }
    }, [navigate, location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let data;
            if (signState === 'Sign In') {
                // User login
                data = await loginUser({ email, password });
            } else {
                // User registration
                data = await registerUser({ email, password, username });
            }

            // Store token and admin status in local storage
            localStorage.setItem("token", data.token);
            localStorage.setItem("isAdmin", data.isAdmin);

            // Dispatch user data to Redux
            dispatch(setUser({ user: data.user, token: data.token, isAdmin: data.isAdmin }));

            // Redirect based on user type and origin of request
            const defaultRedirect = data.isAdmin ? '/dashboard' : '/userdetails';

            navigate(location.state?.from || defaultRedirect);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An unexpected error occurred');
        }
    }
    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                {`${signState} to your account`}
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                {signState === 'Sign Up' ? <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                                    <input type="text" name="email" id="email" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="e.g., Walter White" required="" />
                                </div> : <></>}
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required="" />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                </div>
                                {errorMessage && <div className="text-red-600">{errorMessage}</div>}
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{signState}</button>
                                {signState === 'Sign Up' ? <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet? <a onClick={() => setSignState('Sign In')} className="font-medium text-primary-600 hover:underline dark:text-primary-500 cursor-pointer">Sign in</a>
                                </p> : <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Already have account? <a onClick={() => setSignState('Sign Up')} className="font-medium text-primary-600 hover:underline dark:text-primary-500 cursor-pointer">Sign up</a>
                                </p>}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login
