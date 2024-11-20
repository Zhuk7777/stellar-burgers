import { TOrdersData, TOrder } from '@utils-types';
import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

type TFeedState = TOrdersData & { isLoading: boolean } & {
  orderModalInfo: TOrder | undefined;
};

const initialState: TFeedState = {
  orders: [],
  orderModalInfo: undefined,
  total: 0,
  totalToday: 0,
  isLoading: false
};

export const getFeeds = createAsyncThunk(
  'feed/getFeeds',
  async () => await getFeedsApi()
);

export const getOrderByNumber = createAsyncThunk(
  'feed/getOrderByNumber',
  async (number: number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders;
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeeds.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(
        getFeeds.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
          state.isLoading = false;
        }
      ),
      builder
        .addCase(getOrderByNumber.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getOrderByNumber.rejected, (state) => {
          state.isLoading = false;
        })
        .addCase(
          getOrderByNumber.fulfilled,
          (state, action: PayloadAction<TOrder[]>) => {
            state.orderModalInfo = action.payload[0];
            state.isLoading = false;
          }
        );
  },
  selectors: {
    selectOrderPreview: (state) => state.orders,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday,
    selectOrderModalInfo: (state) => state.orderModalInfo,
    selectFeedLoading: (state) => state.isLoading
  }
});

export const {
  selectOrderPreview,
  selectFeedTotal,
  selectFeedTotalToday,
  selectOrderModalInfo,
  selectFeedLoading
} = feedSlice.selectors;
