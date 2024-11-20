import { FC, useCallback, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectOrder,
  selectOrderLoading,
  selectOrderModalData,
  orderBurger,
  resetOrder
} from '../../services/slices/constructor-slice';
import { selectUserAuthorized } from '../../services/slices/user-slice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isUserLoggedIn = useSelector(selectUserAuthorized);
  const constructorItems = useSelector(selectOrder);
  const isOrderLoading = useSelector(selectOrderLoading);
  const orderModalData = useSelector(selectOrderModalData);

  const onOrderClick = useCallback(() => {
    if (!isUserLoggedIn) {
      return navigate('/login');
    } else if (
      constructorItems.bun?._id &&
      constructorItems.ingredients.length
    ) {
      const ingredientsIds = constructorItems.ingredients.map(
        (item) => item._id
      );
      dispatch(
        orderBurger([
          constructorItems.bun._id,
          ...ingredientsIds,
          constructorItems.bun._id
        ])
      );
    }
  }, [isUserLoggedIn, constructorItems]);

  const closeOrderModal = useCallback(() => {
    dispatch(resetOrder());
  }, []);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={isOrderLoading}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
