'use client';
import { FC, useState } from 'react';
import Header from './components/Header';
import Heading from './utils/Heading';

type Props = {};

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  return (
    <div>
      <Heading
        title="SkillScape"
        description="Master Tomorrow, Today"
        keywords="Programming,Coding,MERN,Next,React,MERN,Redux,Development,Engineering"
      />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} />
    </div>
  );
};

export default Page;
