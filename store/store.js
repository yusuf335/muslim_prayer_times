import {configureStore} from '@reduxjs/toolkit';
import isLoadingSlice from './isLoadingSlice';

export default configureStore({
  reducer: {
    isLoading: isLoadingSlice,
  },
});
