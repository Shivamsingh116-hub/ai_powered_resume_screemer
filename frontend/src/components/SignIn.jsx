import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../common/Context";
import { jwtDecode } from 'jwt-decode'
const apiUrl = import.meta.env.VITE_API_URL;
const Signin = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { setPopupModal, setCurrentUser, setMessage, setLoading } = useContext(Context);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await axios.post(`${apiUrl}/signin`, formData)
            console.log(response)
            if (response) {
                localStorage.setItem("token", response.data.token)
                navigate("/")
                const decodedUser = jwtDecode(response.data.token);
                setCurrentUser(decodedUser);
                setMessage(response.data.message)
                setPopupModal(true)
                setFormData({ email: "", password: "" })
            }
        } catch (e) {
            if (e.response && e.response.status === 400) {
                setMessage(e.response.data.message)
                setPopupModal(true)
            }
            else if (e.response && e.response.status === 500) {
                setMessage(e.response.data.message)
                setPopupModal(true)
            }
            else {
                setMessage("An error occurred. Please try again.")
                setPopupModal(true)
            }
            console.error(e);
        } finally {
            setLoading(false)

        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signin;
