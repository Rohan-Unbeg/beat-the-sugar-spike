import { useState } from 'react';
import { useNavigate, usePath } from 'next/navigation';
import { signIn, signUp } from '../lib/auth';
import { Button, Input, Label } from '../components/ui';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(true);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isSigningIn) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center h-screen"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-80 md:w-96 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {isSigningIn ? 'Sign In' : 'Sign Up'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@example.com"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password"
            />
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full">
            {isSigningIn ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
        <div className="mt-4">
          {isSigningIn ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSigningIn(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSigningIn(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AuthPage;