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
                  activeItem === index
                    ? 'dark:text-[#37a39a] text-[crimson]'
                    : 'dark:text-white text-black'
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
              <img
                src="icon_white.png"
                alt="logo"
                className="h-[60px] mx-auto"
              />
              <img
                src="icon_black.png"
                alt="logo"
                className="dark:hidden h-[60px] mt-[-60px] mx-auto"
              />
            </Link>
          </div>
          {navItemsData &&
            navItemsData.map((item, index) => (
              <Link href={'/'} passHref>
                <span
                  className={`${
                    activeItem === index
                      ? 'dark:text-[#37a39a] text-[crimson]'
                      : 'dark:text-white text-black'
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
