'use client';
import { useFormik } from 'formik';
import { FC, useState } from 'react';
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import * as Yup from 'yup';
import { styles } from '../../../app/styles/style';

type Props = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  name: Yup.string().required('Please enter your name'),
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter your email'),
  password: Yup.string()
    .required('Please enter your password')
    .min(6, 'Password must be at least 6 characters'),
});

const Signup: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      console.log(email, password);
      setRoute('Verification');
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Join SkillScape</h1>
      <form onSubmit={handleSubmit}>
        <label className={`${styles.label} `} htmlFor="email">
          Enter your Name
        </label>
        <input
          type="name"
          name="name"
          id="name"
          value={values.name}
          onChange={handleChange}
          placeholder="Joe Bloggs"
          className={`${errors.name && touched.name && 'border-red-500'} 
          ${styles.input} mb-3`}
        />
        {errors.name && touched.name && (
          <span className="text-red-500 text-sm pt-2 block">{errors.name}</span>
        )}
        <label className={`${styles.label}`} htmlFor="email">
          Enter your Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={values.email}
          onChange={handleChange}
          placeholder="email@email.com"
          className={`${errors.email && touched.email && 'border-red-500'} 
          ${styles.input}`}
        />
        {errors.email && touched.email && (
          <span className="text-red-500 text-sm pt-2 block">
            {errors.email}
          </span>
        )}
        <div className="w-full mt-5 relative mb-1">
          <label className={`${styles.label}`} htmlFor="password">
            Enter your Password
          </label>
          <input
            type={!show ? 'password' : 'text'}
            name="password"
            id="password"
            value={values.password}
            onChange={handleChange}
            placeholder="Password!@%"
            className={`${
              errors.password && touched.password && 'border-red-500'
            } 
            ${styles.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
          {errors.password && touched.password && (
            <span className="text-red-500 text-sm pt-2 block">
              {errors.password}
            </span>
          )}
        </div>
        <div className="w-full mt-5">
          <input type="submit" value="Signup" className={`${styles.button}`} />
        </div>
        <br />
        <h5 className="text-center pt-4 font-Alegraya text-[14px] text-text">
          Or create an account with
        </h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle size={30} className="cursor-pointer mr-2" />
          <AiFillGithub size={30} className="cursor-pointer ml-2" />
        </div>
        <h5 className="text-center pt-4 font-Alegraya text-[14px]">
          Already have an account?
          <span
            className="text-button pl-1 cursor-pointer"
            onClick={() => setRoute('Login')}
          >
            Sign In
          </span>
        </h5>
      </form>
      <br />
    </div>
  );
};

export default Signup;
