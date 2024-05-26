import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [EmailError, setEmailError] = useState(false);
  const [PasswordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (localStorage.getItem("Diary_accessToken")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
    } else if (password.length < 1) {
      setPasswordError(true);
    } else {
      axios
        .post("http://localhost:3001/login", { email, password })
        .then((result) => {
          if (!result.data.accessToken) {
            setError("Email or Password incorrect!");
          } else {
            localStorage.setItem("Diary_accessToken", result.data.accessToken);
            navigate("/dashboard");
          }
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Hey, Welcome Back!
          </h2>
        </div>
        <form className="mt-8" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          {EmailError && (
            <div className="text-xs text-red-600">
              Enter a valid Email address.
            </div>
          )}
          <input
            type="text"
            name="email"
            id="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className={`mb-6 appearance-none relative block w-full px-3 py-2 border ${
              error ? "border-red-400" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
            placeholder="Email address"
            onFocus={() => {
              setEmailError(false);
              setError(false);
            }}
          />

          {PasswordError && (
            <div className="text-xs text-red-600">
              Password can't leave empty.
            </div>
          )}
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            className={`mb-6 appearance-none relative block w-full px-3 py-2 border ${
              error ? "border-red-400" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
            placeholder="Password"
            onFocus={() => {
              setPasswordError(false);
              setError(false);
            }}
          />

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Doesn't have an account?{" "}
            <Link className="text-indigo-600 font-medium" to="/register">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
