import { AuthProvider } from '../components/providers/AuthProvider';

const AuthLayout = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default AuthLayout;