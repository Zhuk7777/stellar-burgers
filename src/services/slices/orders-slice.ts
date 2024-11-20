import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type TOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
};

const initialState: TOrdersState = {
  orders: [],
  isLoading: false
};

export const getOrders = createAsyncThunk('orders/getOrders', async () => {
  const res = await getOrdersApi();
  return res;
});

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(
        getOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          (state.isLoading = false), (state.orders = action.payload);
        }
      );
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectordersLoading: (state) => state.isLoading
  }
});

export const { selectOrders, selectordersLoading } = ordersSlice.selectors;
