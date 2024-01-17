import React, { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  AuthErrorCodes,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate,useHistory } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
    const navigate = useNavigate();
  
    const handleLogout = async () => {
      try {
        await auth.signOut();
        onLogout();
        navigate('/'); // Redirect to the home page or another route
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };
  
    return (
      <nav className="bg-blue-500 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">Your App Name</div>
          <button
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>
    );
  };

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

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
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Invalid email address. Please enter a valid email.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password is too short. Please choose a longer password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please confirm your password.');
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      await sendEmailVerification(user);
      setError('');
      setUser({ email, emailVerified: false });
    } catch (error) {
      handleFirebaseError(error);
    }
  };

  const signInAction = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Invalid email address. Please enter a valid email.');
      return;
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      setError('');
      setUser({ email, emailVerified: user.emailVerified });
    } catch (error) {
      handleFirebaseError(error);
    }
  };

  const handleFirebaseError = (error) => {
    switch (error.code) {
      // ... (add more cases as needed)
      default:
        setError('An error occurred. Please try again later.');
        console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        const { email, emailVerified } = userCred;
        setUser({ email, emailVerified });
      } else {
        setUser(null);
      }
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
            <h2 className="text-2xl font-semibold mb-6">Sign Up / Sign In</h2>
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
                <label htmlFor="password" className="block text-gray-600 text-sm mb-2">
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
              {!showWelcome && (
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-gray-600 text-sm mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Confirm Your password"
                    required
                  />
                </div>
              )}

              {!showWelcome && (
                <button
                  className={`bg-teal-500 text-white p-2 rounded hover:bg-teal-600 mt-5`}
                  onClick={(e) => signUpAction(e)}
                >
                  Sign Up
                </button>
              )}

              {!showWelcome && (
                <button
                  className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-5 ml-2`}
                  onClick={(e) => signInAction(e)}
                >
                  Sign In
                </button>
              )}
            </form>
            {error && (
              <div
                className="bg-red-100 border text-center border-red-400 text-red-700 px-4 py-3 rounded relative mt-2"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {user && !user.emailVerified && !showWelcome && (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="bg-white border border-gray-300 shadow-md p-8 rounded text-center">
            <h2 className="text-2xl font-semibold mb-6">Verify Your Email</h2>
            <p className="mb-4">Please check your email and click on the verification link.</p>
            <p className="text-gray-600 text-sm mb-2">Didn't receive the email?</p>
            <button
              className="text-blue-500 underline focus:outline-none"
              onClick={() => sendEmailVerification(auth.currentUser)}
            >
              Resend Email
            </button>
          </div>
        </div>
      )}

      {user && user.emailVerified && !showWelcome && (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="bg-white border border-gray-300 shadow-md p-8 rounded text-center">
            <h2 className="text-2xl font-semibold mb-6">Welcome {user.email}</h2>
            <p className="text-green-500 text-lg mb-6">You are now signed in!</p>
            <button
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none"
              onClick={() => setShowWelcome(true)}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {showWelcome && (
          <Navbar/>
      )}
    </div>
  );
};

export default Auth;
