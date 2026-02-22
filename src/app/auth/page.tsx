import { useState } from 'react';
import { useNavigate, usePath } from 'next/navigation';
import { signIn, signUp, AuthError } from '../lib/auth';
import { Button, Input, Label } from '../components/ui';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(true);

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
      if (error instanceof AuthError) {
        setError(error.message);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center h-screen"
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-lg font-bold mb-4">{isSigningIn ? 'Sign In' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@example.com"
            />
          </div>
          <div className="mb-4">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password"
            />
          </div>
          {error && (
            <div className="bg-red-100 text-red-500 p-2 mb-4 rounded-lg">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full">
            {isSigningIn ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setIsSigningIn(!isSigningIn)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isSigningIn ? 'Create an account' : 'Already have an account?'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthPage;