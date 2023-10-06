'use client';
import {
  useLogoutQuery,
  useSocialLoginMutation,
} from '@/redux/features/auth/authApi';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import defaultAvatar from '../../public/assets/defaultAvatar.png';
import CustomModal from '../utils/CustomModal';
import NavItems from '../utils/NavItems';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Verification from './auth/Verification';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, setRoute, open }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const { data } = useSession();

  const [socialAuth, { isSuccess, error }] = useSocialLoginMutation();

  const [logout, setLogout] = useState(false);

  // Logout if logout is true
  useLogoutQuery(undefined, {
    skip: !logout ? true : false,
  });

  useEffect(() => {
    if (!user) {
      if (data) {
        socialAuth({
          email: data.user?.email,
          name: data.user?.name,
          avatar: data.user?.image,
        });
      }
    }
    // Np user and success.
    if (data === null) {
      if (isSuccess) {
        toast.success('Logged in successfully');
      }
    }
    if (error) {
      if ('data' in error) {
        const errorData = error as any;
        toast.error(errorData.data.message || 'Something went wrong');
      }
    }
    // If no user, logout.
    if (data === null) {
      setLogout(true);
    }
  }, [data, user]);

  console.log(defaultAvatar);
  console.log(user);

  //   Sticky Header
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  const handleClose = (e: any) => {
    if (e.target.id === 'screen') {
      setOpenSidebar(false);
    }
  };

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? 'bg-opacity-50 bg-gradient-to-b from-gray-900 to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b border-[#ffffff1c] shadow-xl transition duration-500'
            : 'w-full border-b border=[#ffff1c] h-[80px] z-[80] shadow'
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link
                href={'/'}
                className={`text-[25px] font-Alegraya font-[500] text-white`}
              >
                {/* SkillScape */}
                <Image
                  src={require('../../public/logo-white-no.png')}
                  height={40}
                  alt="logo"
                />
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              {/* Only for mobile */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer text-white"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
            </div>
            {user ? (
              <Link href={'/profile'}>
                <Image
                  src={user.avatar ? user.avatar.url : defaultAvatar.src}
                  alt="user"
                  width={30}
                  height={30}
                  className="rounded-full cursor-pointer"
                />
              </Link>
            ) : (
              <HiOutlineUserCircle
                size={25}
                className="hidden 800px:block cursor-pointer text-white"
                onClick={() => setOpen(true)}
              />
            )}
          </div>
        </div>
        {/* Mobile Sidebar */}
        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] bg-[unset] "
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[9999999] h-screen  bg-slate-900 bg-opacity-90 top-0 right-0">
              <NavItems activeItem={activeItem} isMobile={true} />
              <HiOutlineUserCircle
                size={25}
                className="cursor-pointer ml-5 my-2 text-white"
                onClick={() => setOpen(true)}
              />
              <br />
              <br />
              <p className="text-[16px] px-2 pl-5 k text-white">
                Copyright &copy; 2023 SkillScape
              </p>
            </div>
          </div>
        )}
      </div>
      {route === 'Login' && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
            />
          )}
        </>
      )}
      {route === 'Signup' && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Signup}
            />
          )}
        </>
      )}
      {route === 'Verification' && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
