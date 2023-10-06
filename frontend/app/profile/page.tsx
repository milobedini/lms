'use client';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Profile from '../components/profile/Profile';
import Protected from '../hooks/useProtected';
import Heading from '../utils/Heading';

type Props = {
  //
};

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState('Login');

  const { user } = useSelector((state: any) => state.auth);

  return (
    <div>
      <Protected>
        <Heading
          title={`${user?.name}'s Profile`}
          description="Master Tomorrow, Today"
          keywords="Programming,Coding,MERN,Next,React,MERN,Redux,Development,Engineering"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <Profile user={user} />
      </Protected>
    </div>
  );
};

export default Page;
