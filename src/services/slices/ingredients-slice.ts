import { getIngredientsApi } from '@api';
import { TIngredient } from '../../utils/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type TIngredientState = {
  data: TIngredient[];
  isLoading: boolean;
};

const initialState: TIngredientState = {
  data: [],
  isLoading: false
};

export const getIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/getIngredients',
  getIngredientsApi
);

export const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getIngredients.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      });
  },
  selectors: {
    selectIngredients: (state) => state.data,
    selectIngredientsLoading: (state) => state.isLoading
  }
});

export const { selectIngredients, selectIngredientsLoading } =
  ingredientSlice.selectors;
