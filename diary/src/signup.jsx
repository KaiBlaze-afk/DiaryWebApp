import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [usernameErrorVisible, setUsernameErrorVisible] = useState(false);
  const [InvalidEmailErrorVisible, setInvalidEmailErrorVisible] =
    useState(false);
  const [PasswordErrorVisible, setPasswordErrorVisible] = useState(false);
  const [CPasswordErrorVisible, setCPasswordErrorVisible] = useState(false);
  const [UserExist, setUserExist] = useState(false);
  const [UserCreated, setUserCreated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password } = formData;
    if (username.trim().length < 3) {
      setUsernameErrorVisible(true);
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setInvalidEmailErrorVisible(true);
    } else if (password.length < 6) {
      setPasswordErrorVisible(true);
    } else if (password !== formData.confirmPassword) {
      setCPasswordErrorVisible(true);
    } else {
      axios
        .post("http://localhost:3001/register", { username, email, password })
        .then((result) => {
          if (!result.data) {
            setUserExist(true);
          } else {
            setUserExist(false);
            setUserCreated(true);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-md shadow-md">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-4">
          Sign up!
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                className={`border-2 p-3 mt-1 block w-full rounded-md ${
                  usernameErrorVisible ? "border-red-400" : "border-gray-300"
                } shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setUsernameErrorVisible(false)}
              />

              {usernameErrorVisible && (
                <div className="text-xs text-red-600">
                  Username must contain more than 3 letters.
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                className={`border-2 p-3 mt-1 block w-full rounded-md ${
                  InvalidEmailErrorVisible
                    ? "border-red-400"
                    : "border-gray-300"
                } shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setInvalidEmailErrorVisible(false)}
              />
              {InvalidEmailErrorVisible && (
                <div className="text-xs text-red-600">
                  Enter a valid email address.
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className={`border-2 p-3 mt-1 block w-full rounded-md ${
                  PasswordErrorVisible ? "border-red-400" : "border-gray-300"
                } shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setPasswordErrorVisible(false)}
              />
              {PasswordErrorVisible && (
                <div className="text-xs text-red-600">
                  Password Must contain atleast 6 characters.
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                className={`border-2 p-3 mt-1 block w-full rounded-md ${
                  CPasswordErrorVisible ? "border-red-400" : "border-gray-300"
                } shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setCPasswordErrorVisible(false)}
              />
              {CPasswordErrorVisible && (
                <div className="text-xs text-red-600">
                  Passwords does not match.
                </div>
              )}
            </div>
            <div>
              {UserExist ? (
                <div className="text-center text-xs mb-2 text-red-600">
                  User already exists!
                </div>
              ) : UserCreated ? (
                <div className="text-center text-xs mb-2 text-green-600">
                  Account created Successfully! Login now
                </div>
              ) : (
                <br />
              )}
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </button>
            </div>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link className="text-indigo-600 font-medium" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
