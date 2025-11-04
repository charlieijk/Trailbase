import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../state/store';

export interface CurrentUser {
  id: number;
  avatar: string;
  username: string;
  password: string;
}

interface UserState {
  currentUser: CurrentUser | null;
}

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<CurrentUser | null>) => {
      state.currentUser = action.payload;
    },
  },
});

export const userReducer = userSlice.reducer;

export const { setCurrentUser } = userSlice.actions;

export const selectCurrentUser = (state: RootState): CurrentUser | null => state.user.currentUser;
