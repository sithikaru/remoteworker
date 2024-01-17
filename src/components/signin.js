import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
  } from 'firebase/auth';
  import React, { useState, useEffect } from 'react';
  import { auth } from '../config/firebase';
  
  const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
  
    const validateEmail = (input) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(input);
    };
  
    const signInAction = async (e) => {
      e.preventDefault();
  
      if (!validateEmail(email)) {
        setError('Invalid email address. Please enter a valid email.');
        return;
      }
  
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setError(null);
      } catch (error) {
        setError('Invalid email or password. Please try again.');
        console.error(error);
      }
    };
  
    const resetPassword = async () => {
      try {
        await sendPasswordResetEmail(auth, email);
        setError('Password reset email sent. Check your inbox.');
      } catch (error) {
        setError('Error sending password reset email.');
        console.error(error);
      }
    };
  
    const handleSignOut = async () => {
      try {
        await signOut(auth);
        setUser(null);
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((userCred) => {
        setUser(userCred);
      });
  
      return () => {
        unsubscribe();
      };
    }, []);
  
    return (
      <div>
        {!user && (
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white border border-gray-300 shadow-md p-8 rounded w-96">
              <h2 className="text-2xl font-semibold mb-6">Sign In</h2>
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
                    onChange={handleEmailChange}
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
                <button
                  className={`bg-teal-500 text-white p-2 rounded hover:bg-teal-600 mt-5`}
                  onClick={signInAction}
                >
                  Sign In
                </button>
                {error && (
                  <div
                    className="bg-red-100 border text-center border-red-400 text-red-700 px-4 py-3 rounded relative mt-2"
                    role="alert"
                  >
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
                <p className="text-sm mt-3">
                  <button
                    className="text-blue-500 hover:underline focus:outline-none"
                    onClick={resetPassword}
                  >
                    Forgot your password?
                  </button>
                </p>
              </form>
            </div>
          </div>
        )}
        {user && (
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white border border-gray-300 shadow-md p-8 rounded w-96">
              <h2 className="text-2xl font-semibold mb-6">Welcome, {user.email}</h2>
              <button
                className={`bg-teal-500 text-white p-2 rounded hover:bg-teal-600`}
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default SignIn;
  