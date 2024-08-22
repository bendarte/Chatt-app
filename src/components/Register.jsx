import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const Register = ({ csrfToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(""); // Nytt state för avatar-URL
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const payload = {
      username,
      password,
      email,
      avatar, // Lägg till avatar i payload
      csrfToken,
    };

    fetch("https://chatify-api.up.railway.app/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Username or email already exists");
        }
        // Spara användaruppgifter och redirecta till login
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        navigate("/login", { state: { message: "Registration successful" } });
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="bg-cover bg-center min-h-screen flex items-center justify-center">
      <div className="bg-white bg-opacity-60 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-light text-center mb-8 text-white tracking-wide">
          REGISTER
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <p className="text-green-500 text-center mb-4">
          Already have an account?{" "}
          <NavLink to="/login" className="text-blue-500 underline">
            Login
          </NavLink>
        </p>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Username 🙂"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-full bg-gray-800 text-white placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Password 🔒"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-full bg-gray-800 text-white placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="email"
              placeholder="Email ✉️"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-full bg-gray-800 text-white placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Avatar URL 🌐"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="p-3 border border-gray-300 rounded-full bg-gray-800 text-white placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-full hover:bg-green-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;


