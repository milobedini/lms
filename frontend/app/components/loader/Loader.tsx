'use client';
import { ColorRing } from 'react-loader-spinner';

type LoaderProps = {
  message?: string;
  isFullscreen: boolean;
};

const Loader = ({ message, isFullscreen }: LoaderProps) => {
  return (
    <div
      className={`flex flex-col justify-center items-center ${
        isFullscreen ? 'w-screen h-screen' : 'w-full h-full'
      }`}
    >
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperClass="blocks-wrapper m-4"
        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
      />
      <p className="text-lg text-center px-2">{message}</p>
    </div>
  );
};

export default Loader;
