import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import useUserAuth from './useUserAuth';

type ProtectedProps = {
  children: ReactNode;
};

// Redirect to home page if user is not authenticated

export default function Protected({ children }: ProtectedProps) {
  const isAuthenticated = useUserAuth();

  return isAuthenticated ? children : redirect('/');
}
