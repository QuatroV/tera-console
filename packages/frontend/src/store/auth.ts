import { createSlice } from "@reduxjs/toolkit";

type AuthModalPage = "login" | "register" | "restorePassword";

type UserInfo = any;

type AuthState = {
  authModalPage: AuthModalPage | null;
  authenticated: boolean;
  waitForAuth: boolean;
  user: UserInfo;
};

const initialState: AuthState = {
  authModalPage: null,
  authenticated: false,
  waitForAuth: true,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.authModalPage = "login";
    },
    openRegisterModal: (state) => {
      state.authModalPage = "register";
    },
    openRestorePasswordModal: (state) => {
      state.authModalPage = "restorePassword";
    },
    closeAuthModal: (state) => {
      state.authModalPage = null;
    },
    setAuthenticated: (state, action) => {
      state.authenticated = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.authenticated = false;
      state.user = null;
    },
    setWaitForAuth: (state, action) => {
      state.waitForAuth = action.payload;
    },
  },
});

export const {
  openLoginModal,
  openRegisterModal,
  openRestorePasswordModal,
  closeAuthModal,
  setAuthenticated,
  setUser,
  logout,
  setWaitForAuth,
} = authSlice.actions;

export default authSlice;
