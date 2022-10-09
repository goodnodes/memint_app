import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  auth: null, //관리할 state 초기값 설정
  user: null,
};

const authSlice = createSlice({
  name: 'auth', // slice 이름 설정. 이 이름을 slices/index.js파일에 추가해 줘야함.
  initialState,
  reducers: {
    // state 변화할 action 이름 선언
    authorize(state, action) {
      // action의 인자값은 무조건 action.payload로 받음
      state.auth = action.payload;
    },
    saveInfo(state, action) {
      state.user = action.payload;
    },
    updateTokenInfo(state, action) {
      state.user.tokenAmount = Math.round(action.payload.tokenAmount * 10) / 10;
      state.user.onChainTokenAmount = action.payload.onChainTokenAmount;
      state.user.klayAmount = action.payload.klayAmount;
    },
    // action 인자값 없는 경우
    logout(state) {
      state.auth = null;
    },
    increaseBy(state, action) {
      state.user.tokenAmount = action.payload;
      // Math.round((state.user.tokenAmount + action.payload) * 10) / 10;
    },
    decreaseBy(state, action) {
      // state.user.tokenAmount -= action.payload;
      state.user.tokenAmount = action.payload;
      // Math.round((state.user.tokenAmount - action.payload) * 10) / 10;
    },
    editUserInfo(state, action) {
      state.user.property = action.payload.property;
      state.user.picture = action.payload.picture;
      state.user.selfIntroduction = action.payload.selfIntroduction;
    },
  },
});

export default authSlice.reducer;
export const {
  authorize,
  saveInfo,
  updateTokenInfo,
  logout,
  increaseBy,
  decreaseBy,
  editUserInfo,
} = authSlice.actions;
