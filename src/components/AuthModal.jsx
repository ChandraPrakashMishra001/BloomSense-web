import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AuthModal = ({ onClose, onGuestLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGuestLogin = () => {
    onGuestLogin();
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onClose(); // Automatically closes if success, triggers App.jsx onAuthStateChanged
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message.replace('Firebase: ', ''));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onClose(); // Close modal on success
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('Email is already registered.');
      else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') setError('Invalid email or password.');
      else setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col liquid-glass-strong border border-emerald-100"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-50 transition-colors bg-white/50 border border-emerald-100 shadow-sm z-20"
        >
          <X className="w-5 h-5 text-emerald-900/60" />
        </button>

        <div className="px-10 pt-12 pb-8 bg-gradient-to-b from-pink-50/50 to-white relative">
          <h3 className="font-heading italic text-4xl tracking-tight text-emerald-950 mb-2">
            {isLogin ? 'Welcome Back' : 'Join BloomSense'}
          </h3>
          <p className="text-sm font-semibold text-emerald-800/60">
            {isLogin ? 'Sign in to access the early warning network.' : 'Create an account to scan and protect your crops.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-10 pb-10 flex flex-col gap-5 relative z-10">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 text-rose-600 px-4 py-3 rounded-2xl text-xs font-bold border border-rose-100 mb-2">
              {error}
            </motion.div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700/50 group-focus-within:text-emerald-600 transition-colors" />
            <input 
              type="email" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full liquid-glass rounded-2xl pl-12 pr-4 py-4 text-emerald-950 placeholder:text-emerald-800/40 outline-none focus:bg-white transition-all border border-emerald-900/10 focus:border-emerald-500/30 text-sm font-semibold"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700/50 group-focus-within:text-emerald-600 transition-colors" />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full liquid-glass rounded-2xl pl-12 pr-4 py-4 text-emerald-950 placeholder:text-emerald-800/40 outline-none focus:bg-white transition-all border border-emerald-900/10 focus:border-emerald-500/30 text-sm font-semibold"
              required
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 bg-emerald-600 text-white w-full py-4 rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          <div className="relative flex items-center gap-4 my-2">
            <div className="flex-1 border-t border-emerald-900/10"></div>
            <span className="text-xs font-bold text-emerald-800/40 uppercase tracking-widest">OR</span>
            <div className="flex-1 border-t border-emerald-900/10"></div>
          </div>

          <button 
            type="button" 
            disabled={loading}
            onClick={handleGoogleLogin}
            className="bg-white text-emerald-950 w-full py-3.5 rounded-2xl font-bold text-sm hover:bg-emerald-50 transition-all border border-emerald-900/10 flex items-center justify-center gap-3 disabled:opacity-70 shadow-sm"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <button 
            type="button" 
            disabled={loading}
            onClick={handleGuestLogin}
            className="bg-emerald-50 text-emerald-800 w-full py-3.5 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-all border border-emerald-200/60 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            Continue as Guest
          </button>

          <p className="text-center mt-2 text-xs font-semibold text-emerald-800/60">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              className="text-pink-600 hover:text-pink-700 hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
