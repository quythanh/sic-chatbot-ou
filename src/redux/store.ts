// store.ts
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from '@/reducer/userSlice'; // Import reducer từ userSlice
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk';
import { useDispatch,useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    user: userReducer, // Add reducer vào store
  },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
