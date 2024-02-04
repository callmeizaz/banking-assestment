import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { setCookie } from "cookies-next";

const Login = () => {
  const [loginInput, setLoginInput] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = loginInput;
    // For simplicity, check if username and password are not empty
    if (username && password) {
      // Simulate a successful login
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          setCookie("user", data.user);
          router.push(`/home/${data.user.id}`);
          // Handle success, redirect, or update UI accordingly
        } else {
          const errorData = await response.json();
          return setError(errorData.message || "An error occurred.");
          // Handle error, show error message, or update UI accordingly
        }
      } catch (error) {
        return setError("An error occurred.", error);
      }
    } else {
      setError("Invalid username or password");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInput((prevInput) => ({ ...prevInput, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-500">
          Login
        </h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">
              Username:
            </label>
            <input
              value={loginInput.username}
              type="text"
              id="username"
              name="username"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password:
            </label>
            <input
              value={loginInput.password}
              type="password"
              name="password"
              id="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              onChange={handleChange}
            />
          </div>
          {error && <p className="my-4 text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Login
          </button>
          <p className="mt-4 text-center text-gray-600">
            Don&apos;t have an account
            <Link href="/" className="text-blue-500">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
