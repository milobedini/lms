import { styles } from '@/app/styles/style';
import { FC, useRef, useState } from 'react';
// import {toast} from 'react-hot-toast'
import { VscWorkspaceTrusted } from 'react-icons/vsc';

type Props = {
  setRoute: (route: string) => void;
};

type VerifyNumber = {
  '0': string;
  '1': string;
  '2': string;
  '3': string;
};

const Verification: FC<Props> = ({ setRoute }) => {
  const [invalidError, setInvalidError] = useState(false);
  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    '0': '',
    '1': '',
    '2': '',
    '3': '',
  });
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const verificationHandler = async () => {
    setInvalidError(true);
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber: VerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>Verify Your Account</h1>
      <br />
      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-accent flex items-center justify-center">
          <VscWorkspaceTrusted size={40} className="text-white" />
        </div>
      </div>
      <br />
      <br />
      <div className="m-auto flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center text-accent 
            justify-center text-[18px] font-Alegraya outline-none text-center text-4xl ${
              invalidError ? 'shake border-red-500' : 'border-white'
            }`}
            placeholder=""
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <br />
      <br />
      <div className="w-full flex justify-center">
        <button className={`${styles.button}`} onClick={verificationHandler}>
          Verify OTP
        </button>
      </div>
      <br />
      <h5
        className="text-center pt-4 font-Alegraya text-[14px] text-white cursor-pointer"
        onClick={() => setRoute('Login')}
      >
        Go back?
        <span className="text-button pl-1">Sign in</span>
      </h5>
    </div>
  );
};

export default Verification;
