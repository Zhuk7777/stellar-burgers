import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectUserData,
  updateUserData,
  selectUserLoading
} from '../../services/slices/user-slice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const user = useSelector(selectUserData);
  const isUserLoading = useSelector(selectUserLoading);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user!.name,
    email: user!.email,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch(
        updateUserData({
          email: formValue.email,
          name: formValue.name,
          password: formValue.password
        })
      );
    },
    [formValue]
  );

  const handleCancel = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      setFormValue({
        name: user!.name,
        email: user!.email,
        password: ''
      });
    },
    [formValue]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValue((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }));
    },
    []
  );

  if (isUserLoading) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
