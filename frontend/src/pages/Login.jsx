import { useState } from "react"
import { useDispatch } from "react-redux";
import { loginUser } from "../services/authService";
import { setUser } from "../features/authSlice";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser({ email, password })
            dispatch(setUser({ user: data.user, token: data.token }))
            // Redirect to dashboard or home page
            console.log("User logged in successfully")
        } catch (error) {
            console.error("An error occurred while logging in', " + error);
        }
    }
    return (
        <>
            <form onClick={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
        </>
    )
}

export default Login