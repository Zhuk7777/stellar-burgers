import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { useSelector } from '../../services/store';
import { useDispatch } from '../../services/store';
import {
  selectOrders,
  getOrders,
  selectordersLoading
} from '../../services/slices/orders-slice';
import { useEffect } from 'react';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const orders = useSelector(selectOrders);
  const isOrdersLoading = useSelector(selectordersLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  if (isOrdersLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
