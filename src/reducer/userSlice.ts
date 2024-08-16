// userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '@/redux/store'; // Import AppThunk từ store
import IUser from '@/models/user';
import * as api from '@/utils/api'
interface UserState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserSuccess: (state, action: PayloadAction<IUser>) => {
      state.loading = false;
      state.user = action.payload;
      console.log('userSuccess', action.payload)
    },
    fetchUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
// Action creator để gọi API và lấy dữ liệu người dùng
export const fetchUser = (): AppThunk => async (dispatch) => {
  const token = api.getDataFromLocal('token')
  try {
    if(token){
      dispatch(fetchUserStart());
    
      const userData = await api.get_user_info(token); // Gọi API để lấy dữ liệu người dùng
      console.log("userinredux", userData)
      dispatch(fetchUserSuccess(userData)); // Lưu dữ liệu vào Redux store nếu lấy thành công
      return userData
    }
  
  } catch (error) {
    // dispatch(fetchUserFailure(error.message)); // Xử lý lỗi nếu có
  }
  return
};
export const { fetchUserStart, fetchUserSuccess, fetchUserFailure } = userSlice.actions;

export default userSlice.reducer;
