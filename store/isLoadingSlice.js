import {createSlice} from '@reduxjs/toolkit';

export const isLoadingSlice = createSlice({
  name: 'isLoading',
  initialState: {
    value: true,
  },
  reducers: {
    loaded: state => {
      state.value = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {loaded} = isLoadingSlice.actions;

export default isLoadingSlice.reducer;
