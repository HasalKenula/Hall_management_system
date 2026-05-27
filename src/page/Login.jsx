import React from "react";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {

    const { login } = useAuth();

    const navigate = useNavigate()

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function submit(event) {
        event.preventDefault(); //disable default form submission

        if (username === "" || password === "") { //validate user inputs
            setError("Username and password are required")
            toast.error("Username and password are required!");
        }

        const data = {
            username: username,
            password: password
        }

        try {
            const response = await axios.post("http://203.94.72.18/trainee/api/auth/signin", data);
            console.log("Full response:", response);
            console.log("Response data:", response.data);
            console.log("Token type:", typeof response.data);
            login(response.data);
            toast.success("Loging successful!");
            navigate("/");
        } catch (error) {
            setError("There was an error logging in");
            toast.error("here was an error logging in!");
        }
    }

    return (
        <div className="w-full h-screen p-10 flex items-center justify-center">
            <div className="w-[600px] p-8 shadow-xl rounded-lg mx-auto border border-slate-200">
                <div className="text-center mb-5">
                    <h1 className="text-4xl font-semibold text-primary">Login</h1>
                </div>

                <form onSubmit={submit}>
                    <div className="mb-4">
                        <label className="block mb-1">Username</label>
                        <input type="text" onChange={function (event) {
                            setUsername(event.target.value);
                            setError("");
                        }} className="block w-full p-2 border border-gray-200 rounded-lg" placeholder="Enter your username" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Password</label>
                        <input type="password" onChange={function (event) {
                            setPassword(event.target.value);
                            setError("");
                        }} className="block w-full p-2 border border-gray-200 rounded-lg" placeholder="Enter your password" />
                    </div>

                    {error && <div className="text-sm text-red-500">{error}</div>}

                    <div className="mt-8">
                        <button type="submit" className="bg-primary text-black px-4 py-2 rounded-lg w-full hover:bg-white hover:text-primary border border-primary">Login</button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p>
                        Already have an account?
                        <span
                            onClick={() => navigate("/auth/register")}
                            className="text-primary cursor-pointer ml-1"
                        >
                            Register
                        </span>
                    </p>
                </div>
            </div>

        </div>
    )
}
export default Login;