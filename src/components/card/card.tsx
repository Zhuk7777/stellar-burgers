import { PropsWithChildren } from 'react';
import styles from './card.module.css';

interface ICardProps {
  number?: string;
  title?: string;
}

export const Card = ({
  number,
  title,
  children
}: PropsWithChildren<ICardProps>) => {
  const displayTitle = title || (number ? `#${number.padStart(6, '0')}` : '');

  return (
    <div className={`${styles.сard} pt-10`}>
      <h2 className={`${styles.title} text text_type_main-large`}>
        {displayTitle}
      </h2>
      {children}
    </div>
  );
};
