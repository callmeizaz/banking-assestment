import { useState } from "react";
import Link from "next/link";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";

const Register = () => {
  const [registerInput, setRegisterInput] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { username, password, confirmPassword } = registerInput;

    // Validate input fields
    if (!username || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const body = {
        username,
        password,
      };
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle success, redirect, or update UI accordingly
        setCookie("user", data.user);
        console.log("id", data.user.id);
        router.push(`/home/${data.user.id}`);
      } else {
        const errorData = await response.json();
        return setError(errorData.message || "An error occurred.");
        // Handle error, show error message, or update UI accordingly
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }

    // Perform registration logic here
    // You can make a API call, send data to server, etc.

    // Reset form and clear error on successful registration
    setRegisterInput({
      username: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-500">
          Register
        </h1>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">
              Username:
            </label>
            <input
              value={registerInput.username}
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
              value={registerInput.password}
              type="password"
              name="password"
              id="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700">
              Confirm Password:
            </label>
            <input
              value={registerInput.confirmPassword}
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              onChange={handleChange}
            />
          </div>
          {error && <p className="my-4 text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Register
          </button>
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
