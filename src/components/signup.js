import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { AuthErrorCodes } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import SignIn from "./signin";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(password === e.target.value);
  };

  const validateEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const validatePassword = (input) => {
    // Add your password validation logic here (e.g., minimum length)
    return input.length >= 6;
  };

  const signUpAction = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Basic input validation
    if (!validateEmail(email)) {
      setError("Invalid email address. Please enter a valid email.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password is too short. Please choose a longer password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please confirm your password.");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCred.user;
      await sendEmailVerification(user);
      console.log("Verification email sent successfully.");
      setError("");
    } catch (error) {
      handleFirebaseError(error);
    }
  };

  const handleFirebaseError = (error) => {
    switch (error.code) {
      case AuthErrorCodes.EMAIL_EXISTS:
        setError(
          "Email address is already in use. Try signing in or use a different email."
        );
        break;
      case AuthErrorCodes.INVALID_EMAIL:
        setError(
          "Invalid email address. Please check your email and try again."
        );
        break;
      case AuthErrorCodes.WEAK_PASSWORD:
        setError("The password is too weak. Choose a stronger password.");
        break;
      case AuthErrorCodes.USER_DISABLED:
        setError(
          "This account has been disabled. Contact support for assistance."
        );
        break;
      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        setError("Too many unsuccessful login attempts. Try again later.");
        break;
      case AuthErrorCodes.OPERATION_NOT_ALLOWED:
        setError(
          "Password sign-in is disabled for this project. Contact support."
        );
        break;
      default:
        setError("An error occurred. Please try again later.");
        console.error(error);
    }
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        const { email, emailVerified } = userCred;
        setUser({ email, emailVerified });
        // console.log(email, emailVerified);
      } else {
        setUser(null); // Set user to null when not authenticated
      }
    });

    return () => {
      // Unsubscribe from the listener when the component unmounts
      unsubscribe();
    };
  }, []);
  return (
<>
      {!user && (
        
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <SignIn/>
        <div className="bg-white border border-gray-300 shadow-md p-8 rounded w-96">
          <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-600 text-sm mb-2"
              >
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

              <button
                className={`bg-teal-500 text-white p-2 rounded hover:bg-teal-600 mt-5`}
                onClick={(e) => signUpAction(e)}
              >
                Sign Up
              </button>
            </div>
            {error && (
              <div
                className="bg-red-100 border text-center border-red-400 text-red-700 px-4 py-3 rounded relative mt-2"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}
          </form>
        </div>
        </div>
      )}
      {user && !user.emailVerified && (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className=" border border-gray-300 shadow-md p-8 rounded text-center bg-lime-200">
              <h1 className="p-10 text-xl mb-6">
                Sent you a link to your email,
                <br />
                verify your account to continue...
              </h1>
            </div>
          </div>
        </div>
      )}
      {user && user.emailVerified && (
        <SignIn/>
      )}
    </>
    
  );
}

export default Signup;
