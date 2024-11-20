import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUserData } from '../../services/slices/user-slice';

export const AppHeader: FC = () => {
  const userName = useSelector(selectUserData);
  return <AppHeaderUI userName={userName?.name} />;
};
