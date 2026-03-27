import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
