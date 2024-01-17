import React, { useState } from "react";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(null);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(password === e.target.value);
  };

  const signUpAction = async () => {
    console.log(email, password);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white border border-gray-300 shadow-md p-8 rounded w-96">
        <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 text-sm mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Your email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-600 text-sm mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Your password"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-600 text-sm mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="Cpassword"
              name="Cpassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Confirm Your password"
              required
            />
            {passwordsMatch === false && (
              <p className="text-red-500 text-xs">Passwords do not match!</p>
            )}
            {passwordsMatch === true && (
              <p className="text-green-500 text-xs">Correct!</p>
            )}
          </div>
          <button
            className={`bg-teal-500 text-white p-2 rounded hover:bg-teal-600 focus:outline-none focus:ring focus:border-blue-300`}
            onClick={signUpAction}
            disabled={passwordsMatch === false}
            style={{
              backgroundColor: passwordsMatch === false ? "gray" : "",
              cursor: passwordsMatch === false ? "not-allowed" : "pointer",
            }}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
