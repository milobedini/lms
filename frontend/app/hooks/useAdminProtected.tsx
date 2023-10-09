import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';

type ProtectedProps = {
  children: ReactNode;
};

// Redirect to home page if user is not admin user

export default function AdminProtected({ children }: ProtectedProps) {
  const { user } = useSelector((state: any) => state.auth);
  const isAdmin = user?.role === 'admin';
  return isAdmin ? children : redirect('/');
}
