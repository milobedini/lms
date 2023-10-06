import { styles } from '@/app/styles/style';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useUpdateAvatarMutation } from '@/redux/features/user/userApi';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import defaultAvatar from '../../../public/assets/defaultAvatar.png';

type Props = { user: any; avatar: string | null };

const ProfileDetails: FC<Props> = ({ user, avatar }) => {
  const [name, setName] = useState(user && user.name);
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [loadUser, setLoadUser] = useState(false);
  useLoadUserQuery(undefined, { skip: loadUser ? false : true });

  const imageHander = async (e: any) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result as string;
        updateAvatar(avatar);
      }
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (isSuccess) {
      setLoadUser(true);
    }
    if (error) {
      console.log(error);
    }
  }, [isSuccess, error]);

  const handleSubmit = async (e: any) => {
    console.log('handleSubmit');
  };

  return (
    <div className="w-full h-full bg-transparent mt-[80px]">
      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            src={
              user.avatar || avatar ? user.avatar.url || avatar : defaultAvatar
            }
            alt="avatar"
            width={120}
            height={120}
            className="w-[120px] h-[120px] cursor-pointer rounded-full border-2 border-borderAccent"
          />
          <input
            type="file"
            name="avatar"
            id="avatar"
            className="hidden"
            onChange={imageHander}
            accept="image/png,image/jpg,image/jpeg,image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] bg-background rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
              <AiOutlineCamera size={20} fill="white" className="z-1" />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="800px:w-[50%] m-auto  pb-4 flex flex-col items-center">
            <div className="w-[100%]">
              <label className="block pb-2">Full Name</label>
              <input
                type="text"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-[100%] pt-2">
              <label className="block pb-2">Email Address</label>
              <input
                type="email"
                readOnly
                className={`${styles.input} !w-[95%] mb-1 800px:mb-0 outline-none border-none text-gray-300`}
                required
                value={user?.email}
              />
            </div>
            <input
              className={`w-full 800px:w-[250px] h-[40px] border border-accent text-center  text-white rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
        <br />
      </div>
    </div>
  );
};

export default ProfileDetails;
