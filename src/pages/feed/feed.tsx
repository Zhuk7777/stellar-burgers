import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectOrderPreview,
  getFeeds,
  selectFeedLoading
} from '../../services/slices/feed-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrderPreview);
  const isFeedLoading = useSelector(selectFeedLoading);

  useEffect(() => {
    dispatch(getFeeds());
  }, []);

  const handleGetFeeds = useCallback(() => {
    dispatch(getFeeds());
  }, []);

  if (isFeedLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
