import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ArrowRight, Lock, User as UserIcon, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulated network delay
    setTimeout(() => {
      if (password === '123') {
        if (username === 'proc') {
          onLogin({ username: 'proc', role: 'procurement', name: 'Rajendran A' });
        } else if (username === 'acc') {
          onLogin({ username: 'acc', role: 'finance', name: 'Sudha R' });
        } else {
          setError('Invalid username');
        }
      } else {
        setError('Invalid credentials');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 w-full max-w-md border border-white/50">
        <div className="text-center mb-10">
          <img 
            src="https://aaraainfrastructure.com/logo.png" 
            alt="AARAA INFRA" 
            className="h-16 mx-auto mb-6 object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2 text-sm">Sign in to AARAA Infrastructure MIS</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Username (proc / acc)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#ed2f39] transition-all text-sm font-medium"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#ed2f39] transition-all text-sm font-medium"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#ed2f39] text-white py-3.5 rounded-xl font-semibold hover:bg-[#d9252e] focus:outline-none focus:ring-2 focus:ring-[#ed2f39] focus:ring-offset-2 transition-all shadow-lg shadow-red-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Protected by AARAA Secure Systems v2.1
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;