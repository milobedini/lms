import { useEditPasswordMutation } from '@/redux/features/user/userApi';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { styles } from '../../../app/styles/style';

type Props = {
  //
};

const ChangePassword: FC<Props> = (props) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [updatePassword, { isSuccess, error }] = useEditPasswordMutation();

  const passwordChangeHandler = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }
    if (currentPassword === newPassword) {
      return toast.error('New password cannot be the same as current password');
    }
    await updatePassword({ currentPassword, newPassword });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Password updated successfully');
    }
    if (error) {
      console.log(error);
    }
  }, [isSuccess, error]);

  return (
    <div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
      <h1 className="block text-[25px] 800px:text-[30px] font-Alegraya text-center font-[500] text-[#fff] pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className=" w-[100%] 800px:w-[60%] mt-5 font-Alegraya">
            <label className="block pb-2 text-[#fff] ">
              Enter your current password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-[#fff]`}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[60%] mt-2 font-Alegraya">
            <label className="block pb-2 text-[#fff]">
              Enter your new password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-[#fff]`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[60%] mt-2 font-Alegraya">
            <label className="block pb-2 text-[#fff]">
              Confirm your new password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-[#fff]`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              className={`w-[95%] h-[40px] border border-accent text-center text-[#fff] rounded-[3px] mt-8 cursor-pointer text-xl font-semibold`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
