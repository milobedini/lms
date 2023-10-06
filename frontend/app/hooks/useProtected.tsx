import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import useUserAuth from './useUserAuth';

type ProtectedProps = {
  children: ReactNode;
};

export default function Protected({ children }: ProtectedProps) {
  const isAuthenticated = useUserAuth();

  return isAuthenticated ? children : redirect('/');
}
