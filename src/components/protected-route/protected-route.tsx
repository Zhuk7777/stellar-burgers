import { Preloader } from '@ui';
import {
  selectUserData,
  selectUserAuthorized,
  selectUserAuthChecked
} from '../../services/slices/user-slice';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { PropsWithChildren } from 'react';

type protectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: PropsWithChildren<protectedRouteProps>) => {
  const isAuthChecked = useSelector(selectUserAuthChecked);
  const isAuthorized = useSelector(selectUserAuthorized);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuthorized) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthorized) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
