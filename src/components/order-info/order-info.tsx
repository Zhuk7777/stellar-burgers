import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { selectIngredients } from '../../services/slices/ingredients-slice';
import {
  getOrderByNumber,
  selectOrderModalInfo,
  selectFeedLoading
} from '../../services/slices/feed-slice';
import { TOrderInfo } from '../ui/order-info/type';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();

  const orderData = useSelector(selectOrderModalInfo);
  const isFeedLoading = useSelector(selectFeedLoading);
  const ingredients = useSelector(selectIngredients);
  const { number } = useParams<{ number: string }>();

  useEffect(() => {
    dispatch(getOrderByNumber(Number(number)));
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!isFeedLoading && !orderInfo) {
    return null;
  }

  if (isFeedLoading) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo as TOrderInfo} />;
};
