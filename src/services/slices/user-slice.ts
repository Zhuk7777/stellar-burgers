import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi,
  logoutApi,
  getUserApi
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie, getCookie } from '../../utils/cookie';

type TAuthState = {
  user: TUser | null;
  isAuthorized: boolean;
  isAuthChecked: boolean;
  isLoading: boolean;
};

const initialState: TAuthState = {
  user: null,
  isAuthorized: false,
  isAuthChecked: false,
  isLoading: false
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: TLoginData, { dispatch }) => {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    dispatch(setAuthorized(true));
    return res.user;
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData, { dispatch }) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    dispatch(setAuthorized(true));
    return res.user;
  }
);

export const updateUserData = createAsyncThunk(
  'auth/update',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    const res = await logoutApi();
    if (res.success) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch(setAuthorized(false));
    }
  }
);

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      await getUserApi()
        .then((res) => {
          dispatch(setUser(res.user));
          dispatch(setAuthorized(true));
        })
        .finally(() => dispatch(setIsAuthChecked(true)));
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setAuthorized: (state, action: PayloadAction<boolean>) => {
      state.isAuthorized = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      }),
      builder
        .addCase(registerUser.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(registerUser.rejected, (state) => {
          state.isLoading = false;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload;
        }),
      builder
        .addCase(updateUserData.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateUserData.rejected, (state) => {
          state.isLoading = false;
        })
        .addCase(updateUserData.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload;
        }),
      builder
        .addCase(logoutUser.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(logoutUser.rejected, (state) => {
          state.isLoading = false;
        })
        .addCase(logoutUser.fulfilled, (state) => {
          state.isLoading = false;
          state.user = null;
        });
  },
  selectors: {
    selectUserData: (state) => state.user,
    selectUserAuthorized: (state) => state.isAuthorized,
    selectUserAuthChecked: (state) => state.isAuthChecked,
    selectUserLoading: (state) => state.isLoading
  }
});

export const { setIsAuthChecked, setUser, setAuthorized } = authSlice.actions;
export const {
  selectUserData,
  selectUserAuthorized,
  selectUserAuthChecked,
  selectUserLoading
} = authSlice.selectors;
