import Image from 'next/image';
import { FC } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import { SiCoursera } from 'react-icons/si';
import defaultAvatar from '../../../public/assets/defaultAvatar.png';

type Props = {
  user: any;
  active: number;
  setActive: (active: number) => void;
  avatar: string | null;
  logoutHandler: any;
};

const SidebarProfile: FC<Props> = ({
  user,
  active,
  setActive,
  avatar,
  logoutHandler,
}) => {
  return (
    <div className="w-full">
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 1
            ? 'bg-dark border-2 border-accent rounded-md'
            : 'bg-transparent'
        }`}
        onClick={() => setActive(1)}
      >
        <Image
          src={
            user.avatar || avatar ? user.avatar.url || avatar : defaultAvatar
          }
          alt="user"
          width={20}
          height={20}
          className="w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full "
        />
        <h5 className="pl-2 800px:block hidden font-Alegraya text-white capitalize ">
          {user.name}&rsquo;s Account
        </h5>
      </div>
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 2
            ? 'bg-dark border-2 border-accent rounded-md'
            : 'bg-transparent'
        }`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={20} fill="white" />
        <h5 className="pl-2 800px:block hidden font-Alegraya text-white ">
          Change Password
        </h5>
      </div>
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 3
            ? 'bg-dark border-2 border-accent rounded-md'
            : 'bg-transparent'
        }`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} fill="white" />
        <h5 className="pl-2 800px:block hidden font-Alegraya text-white ">
          Enrolled Courses
        </h5>
      </div>
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer 
        `}
        onClick={() => logoutHandler()}
      >
        <AiOutlineLogout size={20} fill="white" />
        <h5 className="pl-2 800px:block hidden font-Alegraya text-white ">
          Log Out
        </h5>
      </div>
    </div>
  );
};

export default SidebarProfile;
