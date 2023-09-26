import Image from 'next/image';
import Link from 'next/link';

export const navItemsData = [
  {
    name: 'Home',
    url: '/',
  },
  {
    name: 'Courses',
    url: '/courses',
  },
  {
    name: 'About',
    url: '/about',
  },
  {
    name: 'Policy',
    url: '/policy',
  },
  {
    name: 'FAQ',
    url: '/faq',
  },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
  return (
    <>
      <div className="hidden 800px:flex">
        {navItemsData &&
          navItemsData.map((item, index) => (
            <Link href={`${item.url}`} key={index} passHref>
              <span
                className={`${
                  activeItem === index ? 'text-accent' : 'text-white'
                } text-[18px] px-6 font-Alegraya font-[400]`}
              >
                {item.name}
              </span>
            </Link>
          ))}
      </div>
      {isMobile && (
        <div className="800px:hidden mt-5">
          <div className="w-full text-center py-6">
            <Link href={'/'} passHref>
              <Image
                src={require('../../public/icon_white.png')}
                alt="logo"
                height={60}
                className="h-[60px] mx-auto mb-[-20px]"
              />
            </Link>
          </div>
          {navItemsData &&
            navItemsData.map((item, index) => (
              <Link href={'/'} passHref key={index}>
                <span
                  className={`${
                    activeItem === index ? 'text-accent' : 'dark:text-white'
                  } block py-6 text-[18px] px-6 font-Alegraya font-[400]`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
        </div>
      )}
    </>
  );
};

export default NavItems;
