import { FC } from 'react';

type HeadProps = {
  title: string;
  description: string;
  keywords: string;
};

const Heading: FC<HeadProps> = ({ title, description, keywords }) => {
  return (
    <>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </>
  );
};

export default Heading;
